  
import React, { useEffect, useState, useMemo  } from "react"; 
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';   
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { useToast, DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { PieChart, Pie, Cell,  PieLabelRenderProps , TooltipProps } from 'recharts';
import { ResponsivePie } from '@nivo/pie';  


import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {  } from 'recharts';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
} 



interface CustomData {
  name: string;
  value: number;
  color: string;
}

interface CustomPieChartProps {
  categorywiseEmissionSummaryData: CustomData[];
}


  const Emissions_Category_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => { 

 
 
    let toast = useToast();
 
    let [ClientFilter,setClientFilter] =  React.useState<string>('0');
    let [MainUnitFilter,setMainUnitFilter] =  React.useState<string>('0');
    let [SubUnitFilter,setSubUnitFilter] =  React.useState<string>('0');

    let [ClientFilterList,setClientFilterList] =  React.useState<any[]>([]);
    let [MainUnitFilterList,setMainUnitFilterList] =  React.useState<any[]>([]);
    let [SubUnitFilterList,setSubUnitFilterList] =  React.useState<any[]>([]); 

    React.useEffect(()=>{
        getClientListFilter();
    },[])

function getClientListFilter(){
        props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetClientList", {}, { json: true })
        .then(res => {
            let result = res;
            //debugger
            setClientFilterList(result)
            setClientFilter(result[0].ClientKey)
        })
        .catch(e => {
            console.log("except: ", e);
            toast.error("Something went wrong" + e);
        });
    }

    React.useEffect(()=>{
        if(ClientFilter!='0'){
            getBusinessUnitsFilter()
        }
    },[ClientFilter])


    function getBusinessUnitsFilter(){
        props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:'0'}, { json: true })
        .then(res => {
            let result = res;
            var filteredArray = result.filter(function(itm:any){
                return itm.ParentKey=='';
              });
            setMainUnitFilterList(filteredArray);
            setMainUnitFilter(filteredArray[0].BusinessUnitKey);
            //debugger
        })
        .catch(e => {
            console.log("except: ", e);
            toast.error("Something went wrong" + e);
        });
    }
    
    React.useEffect(()=>{
        if(MainUnitFilter!='0'){
            getSubBusinessUnitsFilter();
        }
    },[MainUnitFilter])

    function getSubBusinessUnitsFilter(){
        props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:MainUnitFilter}, { json: true })
        .then(res => {
            let result = res;
            if(result.length>0){
                setSubUnitFilterList(result);
                setSubUnitFilter(result[0].BusinessUnitKey);
            }else{
                setSubUnitFilterList([]);
                setSubUnitFilter("0");
            } 
        })
        .catch(e => {
            console.log("except: ", e);
            toast.error("Something went wrong" + e);
        });
    }  
 
    const [startYear, setStartYear] = useState(2024);
    const [startMonth, setStartMonth] = useState(7);
    const [endYear, setEndYear] = useState(2024);
    const [endMonth, setEndMonth] = useState(12);
    const [scopeKey, setScopeKey] = useState(1);
  
    const Years = GetYears();

    function GetYears(){
        const currentYear = new Date().getFullYear();
        const yearList = [];
     
        for (let year = currentYear - 5; year <= currentYear + 5; year++) {
            yearList.push({ Label: year, Value: year });
        }
        
        return yearList;
     }; 

    const months=[
        {Value:'1',Label:'January'},
        {Value:'2',Label:'February'},
        {Value:'3',Label:'March'},
        {Value:'4',Label:'April'},
        {Value:'5',Label:'May'},
        {Value:'6',Label:'June'},
        {Value:'7',Label:'July'},
        {Value:'8',Label:'August'},
        {Value:'9',Label:'September'},
        {Value:'10',Label:'October'},
        {Value:'11',Label:'November'},
        {Value:'12',Label:'December'}
     ]

    let [scopedata, setScopeData] = useState<any[]>([]);   

    useEffect(() => {
        getScopeData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth); 
       
    },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 
 
    useEffect(() => {
 
      getCategorywiseEmissionSummaryData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth, scopeKey);
     
  },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter, scopeKey]) 
    

  function getScopeData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
    props.uxpContext.executeAction(
      "OrganizationalDetailedEmissionOverview-Dataprovider",
      "GetScopewiseOverview",
      { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
      { json: true }
    )
    .then((res: any) => {
      console.log("response", res);
      setScopeData(res);  
    })
    .catch((e: any) => {
      console.error("Error fetching scope data", e);
    });
  } 
 
  const getClassName = (scopeKey: string) => {
    switch (scopeKey) {
      case "1":
        return "green-scope-box";
      case "2":
        return "blue-scope-box";
      case "3":
        return "orange-scope-box";
     case "4":
        return "green_blue-scope-box";
     case "5":
        return "green_blue_orange-scope-box";
      default:
        return "scope-box"; 
    }
  };  
 
    const [isPieChart, setIsPieChart] = useState(false);

    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1");     


const [toggleFilterValue, setToggleFilterValue] = useState<"Scope 1" | "Scope 2" | "Scope 3">("Scope 1");

 
const pieColors = {
  "Scope 1": ["#8bc34a", "#6c9646", "#5c8a43", "#4e7945", "#4c6a48", "#3e5a3f", "#2e4a35", "#244a31", "#1a3a2d", "#144a29", "#0a3a25", "#033a22"],
  
"Scope 2": ["#033f4f", "#0a3f4f", "#144f5f", "#1a3f4f", "#244f5f", "#2f4f5f", "#3a5f6f", "#466f81", "#4f7f8f", "#56a3c9", "#6495a3", "#87a2b5"],
"Scope 3": ["#b97244", "#c07a4e", "#c58458", "#c98c62", "#d0946c", "#d29c76", "#d4a280", "#d6a98a", "#d8b194", "#dab99e", "#dcc3a8", "#ded7b2"]

};
 
const barChartColors = {
  "Scope 1": "#4c6a48",
  "Scope 2": "#466f81",
  "Scope 3": "#b97244"
};

const [categorywiseEmissionSummaryData, setCategorywiseEmissionSummaryData] = useState([]);
 

const getCategorywiseEmissionSummaryData = (
  BusinessUnitKey: string, 
  StartYear: number, 
  StartMonth: number, 
  EndYear: number, 
  EndMonth: number, 
  ScopeKey: number
) => {
  props.uxpContext
    .executeAction(
      'OrganizationalCategorywiseEmissionOverview-Dataprovider',
      'GetCategorywiseEmissionBreakdownByScope',
      { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth, ScopeKey },
      { json: true }
    )
    .then((res: any) => {
      console.log('Raw data:', res); // Log the raw response for debugging
 
      const transformedData = res.map((item: { ActivityCategorytableName: string; CarbonEmission: string | number }, index: number) => {
        const emissionValue = Number(item.CarbonEmission); // Ensure CarbonEmission is a number
        const totalEmission = res.reduce((acc: number, curr: { CarbonEmission: string | number }) => acc + Number(curr.CarbonEmission), 0); // Sum of emissions for percentage calculation

        return {
          name: item.ActivityCategorytableName,
          value: emissionValue, // The raw emission value
          label: `${emissionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO2e (${((emissionValue / totalEmission) * 100).toFixed(2)}%)`, // Add comma separators and percentage
          color: pieColors[toggleFilterValue][index % 12] // Assign colors based on scope and index
        };
      });

      setCategorywiseEmissionSummaryData(transformedData);
    })
    .catch((e: any) => {
      console.error('Error fetching data', e);
    });
};

 
const handleFilterChange = (value: "Scope 1" | "Scope 2" | "Scope 3") => {
  setToggleFilterValue(value);
  switch (value) {
    case "Scope 1":
      setScopeKey(1);
      break;
    case "Scope 2":
      setScopeKey(2);
      break;
    case "Scope 3":
      setScopeKey(3);
      break;
    default:
      setScopeKey(1);
  }
};
 
const hasData = categorywiseEmissionSummaryData.some((item: { value: number }) => item.value > 0); 





const piechartoptions = {  
  chart: {  
   type: 'pie',  
   options3d: {  
    enabled: true,  
    alpha: 10,  
    beta: 0  
   }  
  },  
  title: {  
   text: ''  
  },   
  tooltip: {  
   formatter: function () {  
      return `<b>${this.point.name}</b>: ${(this.y || 0).toLocaleString(undefined, {  
        minimumFractionDigits: 2,  
        maximumFractionDigits: 2  
      })} kgCO2e`;    
   }  
},  
  
credits: {  
   enabled: false,  
},  
  
  plotOptions: {  
   pie: {  
    innerSize: '50%',  
    depth: 45,  
    dataLabels: {  
      enabled: true,  
      style: {  
       fontSize: '11px', // Increase font size to 11px  
       fontWeight: 'normal' // Set font weight to normal  
      },  
      formatter: function () {  
       return `${this.point.name}: ${(this.y || 0).toLocaleString(undefined, {  
        minimumFractionDigits: 2,  
        maximumFractionDigits: 2  
       })} kgCO2e`; // Using toLocaleString for data labels  
      }  
    }  
   }  
  },  
  series: [{  
   name: 'Emissions',  
   data: categorywiseEmissionSummaryData.map((item) => ({  
    name: item.name,  
    y: item.value,  
    color: pieColors[toggleFilterValue][categorywiseEmissionSummaryData.indexOf(item) % pieColors[toggleFilterValue].length]  
   }))  
  }]  
};



 
  return (
    <WidgetWrapper>

                    <TitleBar title='Organizational Carbon Emissions Category Breakdown' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
                    <div className="top-filter">
                                <div className="select-filter">  

                                        <div className="uxp-emi-dropdown"> 
                                                                                
                                            <div className="uxp-emi-select-sec no-padding mb-only">

                                                    <Select
                                                        selected={startYear.toString()}
                                                        options={Years}
                                                        labelField="Label"
                                                        valueField="Value"
                                                        onChange={(value) => { setStartYear(Number(value)) }}
                                                        placeholder=" -- select --"
                                                        isValid={selected ? selected?.length > 0 : null}
                                                    /> 
                                                    <Select
                                                        selected={startMonth.toString()}
                                                        options={months}
                                                        labelField="Label"
                                                        valueField="Value"
                                                        onChange={(value) => { setStartMonth(Number(value)) }}
                                                        placeholder=" -- select --"
                                                        isValid={selected ? selected?.length > 0 : null}
                                                    />  

                                            </div> 

                                            <label>To</label>

                                            <div className="uxp-emi-select-sec no-padding mb-only">  

                                                <Select
                                                    selected={endYear.toString()}
                                                    options={Years}
                                                    labelField="Label"
                                                    valueField="Value"
                                                    onChange={(value) => { setEndYear(Number(value)) }}
                                                    placeholder=" -- select --"
                                                    isValid={selected ? selected?.length > 0 : null}
                                                /> 
                                                <Select
                                                    selected={endMonth.toString()}
                                                    options={months}
                                                    labelField="Label"
                                                    valueField="Value"
                                                    onChange={(value) => { setEndMonth(Number(value)) }}
                                                    placeholder=" -- select --"
                                                    isValid={selected ? selected?.length > 0 : null}
                                                />   

                                           </div>  
                                     
                                        </div> 
                                    
                                </div> 

                            <FilterPanel>

                                    <Select
                                        selected={ClientFilter}
                                        options={ClientFilterList}
                                        labelField="ClientID"
                                        valueField="ClientKey"
                                        onChange={(value) => { setClientFilter(value) }}
                                        placeholder=" -- select --"
                                        isValid={selected ? selected?.length > 0 : null}
                                    /> 
                                    <br/>
                                    <Select
                                        selected={MainUnitFilter}
                                        options={MainUnitFilterList}
                                        labelField="BusinessUnitName"
                                        valueField="BusinessUnitKey"
                                        onChange={(value) => { setMainUnitFilter(value) }}
                                        placeholder=" -- select --"
                                        isValid={selected1 ? selected1?.length > 0 : null}
                                    />    
                                    <br/>
                                    <Select
                                            selected={SubUnitFilter}
                                            options={SubUnitFilterList}
                                             labelField="BusinessUnitName"
                                            valueField="BusinessUnitKey"
                                            onChange={(value) => { setSubUnitFilter(value) }}
                                            placeholder=" -- select --"
                                            isValid={selected2 ? selected2?.length > 0 : null}
                                        /> 
                            </FilterPanel>
                        </div>
             </TitleBar> 
      
                    <div className="scope-overall">     


                            {scopedata.length > 0 ? (
                                scopedata.map((scope, index) => (   
                                     <div key={index} className={`scope-box ${getClassName(scope.ScopeKey)}`}>
                                    <h4> {scope.ScopeName} </h4> 
                                    {/* <h3>{Number(scope.CurrentEmission).toFixed(2)} tCO<em>2</em>e</h3> */}
                                    <h3>{Number(scope.CurrentEmission || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span>tCO<em>2</em>e</span></h3>  
                                    <div className="scope-bottom">
                                    <em>{Number(scope.PrevEmission).toFixed(2) ? `${Number(scope.PrevEmission).toFixed(2)} %` : 0}</em>
                                    <span className={`arrow ${scope.PrevEmission && parseFloat(scope.PrevEmission) > 0 ? 'up-arrow' : 'down-arrow'}`}></span>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p>Loading data...</p> 
                            )}  
                    </div>    

           <div className="scope1_breakdown_widget"> 

           <WidgetWrapper>
              <TitleBar title={`${toggleFilterValue} BreakDown`}>
                <div className="top-filter">
                  <div className="toggle-btn">
                    <em className="chart_label barchart_label">Bar Chart </em>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isPieChart}
                        onChange={() => setIsPieChart(!isPieChart)}
                      />
                      <span className="slider"></span>
                    </label>
                    <em className="chart_label piechart_label">Pie Chart </em>
                  </div>

                  <ToggleFilter
                    options={[
                      { label: 'Scope 1', value: 'Scope 1' },
                      { label: 'Scope 2', value: 'Scope 2' },
                      { label: 'Scope 3', value: 'Scope 3' },
                    ]}
                    value={toggleFilterValue}
                    onChange={handleFilterChange}
                  />
                </div>
              </TitleBar>   

                <div className="scopewise-chart" style={{ height: "500px" }}>
                    <div className="chart">
                      {hasData ? (
                        <ResponsiveContainer width="98%" height={500}>
                          {isPieChart ? ( 

                              <HighchartsReact highcharts={Highcharts} options={piechartoptions} /> 

                          ) : ( 

                             <BarChart
      data={categorywiseEmissionSummaryData}
      layout="vertical"
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        type="number"
        domain={[0, 'auto']}
        tickFormatter={(value: number) => value.toFixed(2)} // Ensure proper formatting
        label={{
          value: "Emission",
          position: "insideBottom",
          offset: -5,
          style: {
            textAnchor: 'middle',
            fontSize: 14,
          },
        }}
      />

      <YAxis
        type="category"
        dataKey="name"
        width={180}
        tick={{ angle: 0, fontSize: 12 }} // Ensure text is readable
        label={{
          value: "Emission Category",
          angle: -90,
          position: "insideLeft",
          style: { textAnchor: 'middle' } // Y-axis label
        }} 
      />

      <YAxis
        type="category"
        yAxisId="right"
        orientation="right"
        dataKey="label"
        width={180}
        tick={{
          fontSize: 12,
          formatter: (value: string) => {
            return value; // Format as required
          },
        }} 
      />  
 

      <Tooltip 
        content={({ active, payload }: TooltipProps) => {
          if (active && payload && payload.length) {
            const { name, value } = payload[0].payload; // Access name and value from the payload
            return (
              <div className="custom-tooltip">
                <b>{name}</b>: {value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} kgCO2e
              </div>
            );
          }
          return null;
        }} 
      />

      <Bar
        dataKey="value"
        fill={barChartColors[toggleFilterValue]} // Set bar color based on scope
        barSize={15}
      />
    </BarChart> 


                          )}
                        </ResponsiveContainer>
                      ) : (
                        <div className="no-data-available" style={{ textAlign: 'center', padding: '20px' }}>
                          <h3>No data available</h3>
                        </div>
                      )}
                    </div>
                </div> 

  </WidgetWrapper>
         
         </div>

    </WidgetWrapper>
    
  );
};

export default Emissions_Category_Breakdown;


 


 