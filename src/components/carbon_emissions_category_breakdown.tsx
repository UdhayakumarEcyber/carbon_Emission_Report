    

import React, { useEffect, useState, useMemo  } from "react"; 
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';   
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { useToast, DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { PieChart, Pie, Cell } from 'recharts';
import { ResponsivePie } from '@nivo/pie';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}
   
interface EmissionData {
    Year: string;
    Month: string;
    MonthString: string;
    ScopeKey: string;
    ScopeName: string;
    CarbonEmission: string;
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
const [categorywiseEmissionSummaryData, setCategorywiseEmissionSummaryData] = useState([]);  
const getCategorywiseEmissionSummaryData = (BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number, ScopeKey: number) => {  
  props.uxpContext  
   .executeAction(  
    'OrganizationalCategorywiseEmissionOverview-Dataprovider',  
    'GetCategorywiseEmissionBreakdownByScope',  
    { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth, ScopeKey },  
    { json: true }  
   )  
   .then((res) => {  
    const transformedData = res.map((item: { ActivityCategorytableName: any; CarbonEmission: number; }) => ({  
      name: item.ActivityCategorytableName,  
      value: item.CarbonEmission,    
      label: `${item.CarbonEmission} tCO2e (${((item.CarbonEmission / res.reduce((acc: any, curr: { CarbonEmission: any; }) => acc + curr.CarbonEmission, 0)) * 100).toFixed(2)}%)`,  
    }));  
    if (transformedData.every((item:any) => item.value === 0)) {  
      setCategorywiseEmissionSummaryData([]);  
    } else {  
      setCategorywiseEmissionSummaryData(transformedData);  
    }  
   })  
   .catch((e) => {  
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

const transformedData = categorywiseEmissionSummaryData.map((entry, index) => ({  
  id: entry.name,  
  label: entry.label,  
  value: entry.value,  
 // color: ['#4f805d', '#82ca9d', '#8884d8', '#ffc658', '#ff7300', '#00c49f', '#4c99a2'][index % 7], 
    color:["#466f81", "#b97244", "#4c6a48"][index % 7], 
}));   

// const hasData = categorywiseEmissionSummaryData.some((item) => item.value !== 0);

const hasData = categorywiseEmissionSummaryData.some((item) => item.value > 0);

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
                                    <h3>{Number(scope.CurrentEmission).toFixed(2)} tCO<em>2</em>e</h3>
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
 


<div className="scopewise-chart" style={{height:"400px"}}>
      <div className="chart">
      {hasData ? (
          <ResponsiveContainer width="100%" height={380}>
            {isPieChart ? (
              <ResponsivePie
                data={transformedData}
                id="id"
                margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                innerRadius={0.75}
                padAngle={0}
                cornerRadius={3}
                colors={transformedData.map((item) => item.color)}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                animate={true}
                value="value"
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={1}
                arcLabelsTextColor="#000000"
                arcLabelsRadiusOffset={0.5}
                arcLabel={(d) => `${d.value}%`}
              />
            ) : (
              <BarChart
                data={categorywiseEmissionSummaryData}
                layout="vertical"
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={280} />
                <YAxis
                  type="category"
                  yAxisId="right"
                  orientation="right"
                  dataKey="label"
                  width={100}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#4f805d"
                  barSize={20}
                  label={(props:any) => (
                    <text
                      x={props.x + props.width + 10}
                      y={props.y + props.height / 2}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fontSize="12"
                      fill="#f00"
                    >
                      {props.label}
                    </text>
                  )}
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
















// import React, { useEffect, useState, useMemo  } from "react"; 
// import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';   
// import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
// import { useToast, DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
// import { PieChart, Pie, Cell } from 'recharts';
// import { ResponsivePie } from '@nivo/pie';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }
   
// interface EmissionData {
//     Year: string;
//     Month: string;
//     MonthString: string;
//     ScopeKey: string;
//     ScopeName: string;
//     CarbonEmission: string;
// } 

//  const Emissions_Category_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => { 
 
//     let toast = useToast();
 
//     let [ClientFilter,setClientFilter] =  React.useState<string>('0');
//     let [MainUnitFilter,setMainUnitFilter] =  React.useState<string>('0');
//     let [SubUnitFilter,setSubUnitFilter] =  React.useState<string>('0');

// let [ClientFilterList,setClientFilterList] =  React.useState<any[]>([]);
//     let [MainUnitFilterList,setMainUnitFilterList] =  React.useState<any[]>([]);
//     let [SubUnitFilterList,setSubUnitFilterList] =  React.useState<any[]>([]); 

//     React.useEffect(()=>{
//         getClientListFilter();
//     },[])

// function getClientListFilter(){
//         props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetClientList", {}, { json: true })
//         .then(res => {
//             let result = res;
//             //debugger
//             setClientFilterList(result)
//             setClientFilter(result[0].ClientKey)
//         })
//         .catch(e => {
//             console.log("except: ", e);
//             toast.error("Something went wrong" + e);
//         });
//     }

//     React.useEffect(()=>{
//         if(ClientFilter!='0'){
//             getBusinessUnitsFilter()
//         }
//     },[ClientFilter])


//     function getBusinessUnitsFilter(){
//         props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:'0'}, { json: true })
//         .then(res => {
//             let result = res;
//             var filteredArray = result.filter(function(itm:any){
//                 return itm.ParentKey=='';
//               });
//             setMainUnitFilterList(filteredArray);
//             setMainUnitFilter(filteredArray[0].BusinessUnitKey);
//             //debugger
//         })
//         .catch(e => {
//             console.log("except: ", e);
//             toast.error("Something went wrong" + e);
//         });
//     }
    
//     React.useEffect(()=>{
//         if(MainUnitFilter!='0'){
//             getSubBusinessUnitsFilter();
//         }
//     },[MainUnitFilter])

//     function getSubBusinessUnitsFilter(){
//         props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:MainUnitFilter}, { json: true })
//         .then(res => {
//             let result = res;
//             if(result.length>0){
//                 setSubUnitFilterList(result);
//                 setSubUnitFilter(result[0].BusinessUnitKey);
//             }else{
//                 setSubUnitFilterList([]);
//                 setSubUnitFilter("0");
//             } 
//         })
//         .catch(e => {
//             console.log("except: ", e);
//             toast.error("Something went wrong" + e);
//         });
//     } 

 
//     const [startYear, setStartYear] = useState(2024);
//     const [startMonth, setStartMonth] = useState(7);
//     const [endYear, setEndYear] = useState(2024);
//     const [endMonth, setEndMonth] = useState(12);
  
//     const Years = GetYears();

//     function GetYears(){
//         const currentYear = new Date().getFullYear();
//         const yearList = [];
     
//         for (let year = currentYear - 5; year <= currentYear + 5; year++) {
//             yearList.push({ Label: year, Value: year });
//         }
        
//         return yearList;
//      }; 

//     const months=[
//         {Value:'1',Label:'January'},
//         {Value:'2',Label:'February'},
//         {Value:'3',Label:'March'},
//         {Value:'4',Label:'April'},
//         {Value:'5',Label:'May'},
//         {Value:'6',Label:'June'},
//         {Value:'7',Label:'July'},
//         {Value:'8',Label:'August'},
//         {Value:'9',Label:'September'},
//         {Value:'10',Label:'October'},
//         {Value:'11',Label:'November'},
//         {Value:'12',Label:'December'}
//      ]

//     let [scopedata, setScopeData] = useState<any[]>([]);  


//     useEffect(() => {
//         getScopeData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
//         getCategorywiseEmissionSummaryData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
       
//     },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 
 

//   function getScopeData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
//     props.uxpContext.executeAction(
//       "OrganizationalDetailedEmissionOverview-Dataprovider",
//       "GetScopewiseOverview",
//       { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
//       { json: true }
//     )
//     .then((res: any) => {
//       console.log("response", res);
//       setScopeData(res);  
//     })
//     .catch((e: any) => {
//       console.error("Error fetching scope data", e);
//     });
//   } 
 
//   const getClassName = (scopeKey: string) => {
//     switch (scopeKey) {
//       case "1":
//         return "green-scope-box";
//       case "2":
//         return "blue-scope-box";
//       case "3":
//         return "orange-scope-box";
//      case "4":
//         return "green_blue-scope-box";
//      case "5":
//         return "green_blue_orange-scope-box";
//       default:
//         return "scope-box"; 
//     }
//   }; 
     

//   const [toggleFilterValue, setToggleFilterValue] = useState<"Scope 1" | "Scope 2" | "Scope 3">("Scope 1"); 

  
//   const [isPieChart, setIsPieChart] = useState(false);

//      let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [selected1, setSelected1] = React.useState<string | null>("op-1");
//     let [selected2, setSelected2] = React.useState<string | null>("op-1");
//     let [selected3, setSelected3] = React.useState<string | null>("op-1");
    
     
// const [categorywiseEmissionSummaryData, setCategorywiseEmissionSummaryData] = useState([]);


// const getCategorywiseEmissionSummaryData = (BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) => {
//     props.uxpContext
//       .executeAction(
//         'OrganizationalDetailedEmissionOverview-Dataprovider',
//         'GetCategorywiseEmissionSummary',
//         { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
//         { json: true }
//       )
//       .then((res) => {
      
//         const transformedData = res.map((item: { ActivityCategorytableName: any; CarbonEmission: number; }) => ({
//           name: item.ActivityCategorytableName,
//           value: item.CarbonEmission,
//           label: `${item.CarbonEmission} tCO2e (${((item.CarbonEmission / res.reduce((acc: any, curr: { CarbonEmission: any; }) => acc + curr.CarbonEmission, 0)) * 100).toFixed(2)}%)`,
//         }));
//         setCategorywiseEmissionSummaryData(transformedData);
//       })
//       .catch((e) => {
//         console.error('Error fetching data', e);
//       });
//   };

//   const transformedData = categorywiseEmissionSummaryData.map((entry, index) => ({
//     id: entry.name,
//     label: entry.label,
//     value: entry.value,
//     color: ['#4f805d', '#82ca9d', '#8884d8', '#ffc658', '#ff7300', '#00c49f', '#4c99a2'][index % 7],
//   }));
 
//   const handleFilterChange = (value: "Scope 1" | "Scope 2" | "Scope 3") => {
//     setToggleFilterValue(value);
//   };

//   return (
//     <WidgetWrapper>

//                     <TitleBar title='Organizational Carbon Emissions Category Breakdown' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
//                     <div className="top-filter">
//                                 <div className="select-filter">  

//                                         <div className="uxp-emi-dropdown"> 
                                                                                
//                                             <div className="uxp-emi-select-sec no-padding mb-only">

//                                                     <Select
//                                                         selected={startYear.toString()}
//                                                         options={Years}
//                                                         labelField="Label"
//                                                         valueField="Value"
//                                                         onChange={(value) => { setStartYear(Number(value)) }}
//                                                         placeholder=" -- select --"
//                                                         isValid={selected ? selected?.length > 0 : null}
//                                                     /> 
//                                                     <Select
//                                                         selected={startMonth.toString()}
//                                                         options={months}
//                                                         labelField="Label"
//                                                         valueField="Value"
//                                                         onChange={(value) => { setStartMonth(Number(value)) }}
//                                                         placeholder=" -- select --"
//                                                         isValid={selected ? selected?.length > 0 : null}
//                                                     />  

//                                             </div> 

//                                             <label>To</label>

//                                             <div className="uxp-emi-select-sec no-padding mb-only">  

//                                                 <Select
//                                                     selected={endYear.toString()}
//                                                     options={Years}
//                                                     labelField="Label"
//                                                     valueField="Value"
//                                                     onChange={(value) => { setEndYear(Number(value)) }}
//                                                     placeholder=" -- select --"
//                                                     isValid={selected ? selected?.length > 0 : null}
//                                                 /> 
//                                                 <Select
//                                                     selected={endMonth.toString()}
//                                                     options={months}
//                                                     labelField="Label"
//                                                     valueField="Value"
//                                                     onChange={(value) => { setEndMonth(Number(value)) }}
//                                                     placeholder=" -- select --"
//                                                     isValid={selected ? selected?.length > 0 : null}
//                                                 />   

//                                            </div>  
                                     
//                                         </div> 
                                    
//                                 </div> 

//                             <FilterPanel>

//                                     <Select
//                                         selected={ClientFilter}
//                                         options={ClientFilterList}
//                                         labelField="ClientID"
//                                         valueField="ClientKey"
//                                         onChange={(value) => { setClientFilter(value) }}
//                                         placeholder=" -- select --"
//                                         isValid={selected ? selected?.length > 0 : null}
//                                     /> 
//                                     <br/>
//                                     <Select
//                                         selected={MainUnitFilter}
//                                         options={MainUnitFilterList}
//                                         labelField="BusinessUnitName"
//                                         valueField="BusinessUnitKey"
//                                         onChange={(value) => { setMainUnitFilter(value) }}
//                                         placeholder=" -- select --"
//                                         isValid={selected1 ? selected1?.length > 0 : null}
//                                     />    
//                                     <br/>
//                                     <Select
//                                             selected={SubUnitFilter}
//                                             options={SubUnitFilterList}
//                                              labelField="BusinessUnitName"
//                                             valueField="BusinessUnitKey"
//                                             onChange={(value) => { setSubUnitFilter(value) }}
//                                             placeholder=" -- select --"
//                                             isValid={selected2 ? selected2?.length > 0 : null}
//                                         /> 
//                             </FilterPanel>
//                         </div>
//              </TitleBar> 
      
//              <div className="scope-overall">    
//                             {scopedata.length > 0 ? (
//                                 scopedata.map((scope, index) => (   
//                                      <div key={index} className={`scope-box ${getClassName(scope.ScopeKey)}`}>
//                                     <h4> {scope.ScopeName} </h4>
//                                     {/* <h3>{scope.CurrentEmission} tCO<em>2</em>e</h3> */}
//                                     <h3>{Number(scope.CurrentEmission).toFixed(2)} tCO<em>2</em>e</h3>
//                                     <div className="scope-bottom">
//                                     <em>{Number(scope.PrevEmission).toFixed(2) ? `${Number(scope.PrevEmission).toFixed(2)} %` : 0}</em>
//                                     <span className={`arrow ${scope.PrevEmission && parseFloat(scope.PrevEmission) > 0 ? 'up-arrow' : 'down-arrow'}`}></span>
//                                     </div>
//                                 </div>
//                                 ))
//                             ) : (
//                                 <p>Loading data...</p> 
//                             )}  
//                     </div>    

//            <div className="scope1_breakdown_widget"> 

//                <WidgetWrapper>
                 
//                <TitleBar title={`${toggleFilterValue} BreakDown`}>
//         <div className="top-filter">
//           <div className="toggle-btn">
//             <em className="chart_label barchart_label">Bar Chart </em>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={isPieChart}
//                 onChange={() => setIsPieChart(!isPieChart)} // Toggle on change
//               />
//               <span className="slider"></span>
//             </label>
//             <em className="chart_label piechart_label">Pie Chart </em>
//           </div>

//           <ToggleFilter
//             options={[
//               { label: 'Scope 1', value: 'Scope 1' },
//               { label: 'Scope 2', value: 'Scope 2' },
//               { label: 'Scope 3', value: 'Scope 3' },
//             ]}
//             value={toggleFilterValue}
//             onChange={handleFilterChange}
//           /> 
 
//         </div>
//       </TitleBar>




//       <div className="scopewise-chart">
//         <div className="chart">
//           <ResponsiveContainer width="100%" height={400}>
//             {isPieChart ? (
//               <ResponsivePie
//                 data={transformedData}
//                 id="id"
//                 margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
//                 innerRadius={0.75}
//                 padAngle={0}
//                 cornerRadius={3}
//                 colors={transformedData.map((item) => item.color)}
//                 borderWidth={1}
//                 borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
//                 animate={true}
//                 value="value"
//                 activeOuterRadiusOffset={8}
//                 arcLinkLabelsSkipAngle={10}
//                 arcLinkLabelsTextColor="#333333"
//                 arcLinkLabelsThickness={2}
//                 arcLinkLabelsColor={{ from: 'color' }}
//                 arcLabelsSkipAngle={1}
//                 arcLabelsTextColor="#000000"
//                 arcLabelsRadiusOffset={0.5}
//                 arcLabel={(d) => `${d.value}%`}
//               />
//             ) : (
//               <BarChart
//                 data={categorywiseEmissionSummaryData}
//                 layout="vertical"
//                 margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis type="category" dataKey="name" width={280} />
//                 <YAxis type="category" yAxisId="right" orientation="right" dataKey="label" width={100} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar
//                   dataKey="value"
//                   fill="#4f805d"
//                   barSize={20}
//                   label={(props: { x: any; width: any; y: number; height: number; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => (
//                     <text
//                       x={props.x + props.width + 10}
//                       y={props.y + props.height / 2}
//                       textAnchor="end"
//                       dominantBaseline="middle"
//                       fontSize="12"
//                       fill="#f00"
//                     >
//                       {props.label}
//                     </text>
//                   )}
//                 />
//               </BarChart>
//             )}
//           </ResponsiveContainer>
//         </div>
//       </div> 

//             </WidgetWrapper>
         
//          </div>

//     </WidgetWrapper>
    
//   );
// };

// export default Emissions_Category_Breakdown;
