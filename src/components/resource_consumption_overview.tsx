
import React, { useEffect, useState, useMemo  } from "react";
 

import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import {  AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,PieChart, Pie  } from 'recharts';
import { useToast, DataList, WidgetWrapper, Button, DynamicSelect, SearchBox, Modal, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
import { ResponsivePie } from '@nivo/pie';  


interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}    
interface ScopePopupData {
    MonthString: string;
    Scope1: number;
    Scope2: number;
    Scope3: number;
} 
 

const Resource_Consumption_Overview: React.FunctionComponent<IWidgetProps> = (props) => { 

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
        props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetClientList", {}, { json: true })
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
        props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:'0'}, { json: true })
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
        props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:MainUnitFilter}, { json: true })
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

    
    useEffect(() => { 
        getScopeEmissionBreakdownData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
        getScopewisePopUpData(SubUnitFilter !== '0' ? SubUnitFilter : MainUnitFilter, startYear, startMonth, endYear, endMonth); // Correct function call
       // scopewisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
       // getCategorywiseEmissionOverview(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
        getcategorywisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
    },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 
  
 
  let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<any[]>([]); // Initialized as an empty array since the data is an array

  function getScopeEmissionBreakdownData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
    props.uxpContext.executeAction(
      "OrganizationalEmissionOverview-Dataprovider",
      "GetScopewiseEmissionBreakdown",
      { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
      { json: true }
    )
    .then((res: any) => {
      console.log("response", res);
      setScopeEmissionBreakdowndata(res);  
    })
    .catch((e: any) => {
      console.error("Error fetching scope data", e);
    });
  }  

// const groupedScopeEmissionBreakdowndata = useMemo(() => { 
//     const groupedData = scopeEmissionBreakdowndata.reduce((acc, item) => {
//         if (item.CarbonEmission && Number(item.CarbonEmission) > 0) { // Skip empty or zero values
//             if (acc[item.ScopeName]) {
//                 acc[item.ScopeName] += Number(item.CarbonEmission); // Add to existing scope
//             } else {
//                 acc[item.ScopeName] = Number(item.CarbonEmission); // Initialize new scope
//             }
//         }
//         return acc;
//     }, {}); 
   
//     return Object.keys(groupedData).map(scope => ({
//         id: scope,
//         value: groupedData[scope],
//         label: scope
//     }));
// }, [scopeEmissionBreakdowndata]);    
 

var groupedScopeEmissionBreakdowndata = [
    {
      "id": "rust",
      "label": "rust",
      'value_rate':127.377,
      "value": 125,
      "color": "hsl(124, 70%, 50%)"
    },
    {
      "id": "ruby",
      "label": "ruby",
      'value_rate':127.377,
      "value": 33,
      "color": "hsl(124, 70%, 50%)"
    } 
  ];
    

 const [scopewisePopUpData, setScopewisePopUpData] = useState<ScopePopupData[]>([]); 

const getScopewisePopUpData = (BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) => {
    props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetScopewiseEmissionBreakdownPopup", {
        BusinessUnitKey,
        StartYear,
        StartMonth,
        EndYear,
        EndMonth
    }, { json: true }).then(res => {
        console.log("data", res);
        setScopewisePopUpData(processScopeData(res)); // Process the data after fetching
    }).catch(e => {
        console.error("Error fetching data", e);
    });
};
 // Process the fetched data
 const processScopeData = (data: any[]): ScopePopupData[] => {
    const groupedScopePopupData: Record<string, ScopePopupData> = {};

    data.forEach(item => {
        const month = item.MonthString;
        if (!groupedScopePopupData[month]) {
            groupedScopePopupData[month] = { MonthString: month, Scope1: 0, Scope2: 0, Scope3: 0 };
        }

        const emission = parseFloat(item.CarbonEmission);
        if (item.ScopeKey === "1") {
            groupedScopePopupData[month].Scope1 += emission;
        } else if (item.ScopeKey === "2") {
            groupedScopePopupData[month].Scope2 += emission;
        } else if (item.ScopeKey === "3") {
            groupedScopePopupData[month].Scope3 += emission;
        }
    });

    return Object.values(groupedScopePopupData);
}; 
   
    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1");  

   
  

  
let [categorywisePopUpData,setCategorywisePopUpData] = React.useState<any>([]) 
function getcategorywisePopUpData (BusinessUnitKey:string,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number) {  
    props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider","GetCategorywiseEmissionBreakdown",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
        console.log("data",res);
        setCategorywisePopUpData(res);
    }).catch(e=>{
        // console.log("hi", e);
    }); 
} 
 



var consumptionPieData = [
    {
      "id": "rust",
      "label": "rust",
      'value_rate':"127.377",
      "value": 125,
      "color": "hsl(124, 70%, 50%)"
    },
    {
      "id": "ruby",
      "label": "ruby",
      'value_rate':"127.377",
      "value": 33,
      "color": "hsl(124, 70%, 50%)"
    } 
  ];
   


const consumptionOverviewData = [
    {
      "name": "BU 1",
      "uv": 4000,
      "BU": 2400,
      "amt": 2400
    },
    {
      "name": "BU 2",
      "uv": 3000,
      "BU": 1398,
      "amt": 2210
    },
    {
      "name": "BU 3",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "BU 4",
      "uv": 2780,
      "BU": 3908,
      "amt": 2000
    },
    {
      "name": "BU 5",
      "uv": 1890,
      "BU": 4800,
      "amt": 2181
    },
    {
      "name": "BU 6",
      "uv": 2390,
      "BU": 3800,
      "amt": 2500
    },
    {
      "name": "BU 7",
      "uv": 3490,
      "BU": 4300,
      "amt": 2100
    }
  ];
 

  const [toggleFilterValue, setToggleFilterValue] = useState<"Energy" | "Water" | "Waste">("Energy"); 
 
  const handleFilterChange = (value: "Energy" | "Water" | "Waste") => {
    setToggleFilterValue(value);
  }; 

  const consumptionCompositionData = [
    {
      "name": "BU1",
      "Non Renewable Fuel Consumption": 4000,
      "Electricity Consumption": 2400
    },
    {
      "name": "BU2",
      "Non Renewable Fuel Consumption": 3000,
      "Electricity Consumption": 1398
    },
    {
      "name": "BU3",
      "Non Renewable Fuel Consumption": 2000,
      "Electricity Consumption": 9800
    },
    {
      "name": "BU4",
      "Non Renewable Fuel Consumption": 2780,
      "Electricity Consumption": 3908
    },
    {
      "name": "BU5",
      "Non Renewable Fuel Consumption": 1890,
      "Electricity Consumption": 4800
    },
    {
      "name": "BU6",
      "Non Renewable Fuel Consumption": 2390,
      "Electricity Consumption": 3800
    },
    {
      "name": "BU7",
      "Non Renewable Fuel Consumption": 3490,
      "Electricity Consumption": 4300
    }
  ];

 

    return (
        <WidgetWrapper>
            <TitleBar title='Organizational Resource Consumption Overview' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
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

                                           <Select
                                                selected={ClientFilter}
                                                options={ClientFilterList}
                                                labelField="ClientID"
                                                valueField="ClientKey"
                                                onChange={(value) => { setClientFilter(value) }}
                                                placeholder=" -- select --"
                                                isValid={selected ? selected?.length > 0 : null}
                                            /> 
                                     
                                        </div> 
                                    
                                </div>  
                        </div> 

            </TitleBar> 


            <div style={{display:"inline-block", width:"100%"}}>
                <div className="top-filter"> 
                        <ToggleFilter
                            options={[
                            { label: 'Energy', value: 'Energy' },
                            { label: 'Water', value: 'Water' },
                            { label: 'Waste', value: 'Waste' },
                            ]}
                            value={toggleFilterValue}
                            onChange={handleFilterChange}
                        /> 
                    
                      </div>
                </div>

 
                <div className="resource_consumption_overview"> 


                    <div className="emi-breakdown" style={{ width:"40%", margin:"0 1.5em 0 0"}}>  
                         
                        <WidgetWrapper>

                            <TitleBar title='CORPORATE-WIDE ENERGY CONSUMPTION'/> 

                             <div className="scopewise-chart">  

                                    <div className="energy_consumption-intensity">
                                        <p>Energy Intensity 3652.52 MJ/m2</p>
                                    </div> 

                                        <ResponsiveContainer width="100%" height={300}> 
 
                                                    <ResponsivePie  
                                                    data={consumptionPieData}  
                                                    margin={{ top: 5, right: 30, bottom: 30, left: 30 }}  
                                                    innerRadius={0.75}  
                                                    padAngle={0}  
                                                    cornerRadius={3}  
                                                    colors={["#466f81", "#b97244"]}  
                                                    borderWidth={1}  
                                                    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}  
                                                    animate={false}  
                                                    value="value"  
                                                    activeOuterRadiusOffset={8}  
                                                    arcLinkLabelsSkipAngle={10}  
                                                    arcLinkLabelsTextColor="#333333"  
                                                    arcLinkLabelsThickness={2}  
                                                    arcLinkLabelsColor={{ from: 'color' }}  
                                                    arcLabelsSkipAngle={1}  
                                                    arcLabelsTextColor="#ffffff"  
                                                    arcLabelsRadiusOffset={0.5}   
                                                    />  
 
                                         </ResponsiveContainer> 
                            
                            </div>

                         </WidgetWrapper>
                        
                     </div>

                    <div className="emi-breakdown" style={{ width:"60%", margin:"0 0 0 1.5em"}}>  
                       
                            <WidgetWrapper> 
                                <TitleBar title='CORPORATE-WIDE ENERGY CONSUMPTION OVERVIEW'/>  

                                    <ResponsiveContainer width="100%" height={380}> 

                                        <ComposedChart width={730} height={250} data={consumptionOverviewData}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <CartesianGrid stroke="#f5f5f5" />
                                            <Line type="monotone" dataKey="amt" stroke="#8884d8" />
                                            <Bar dataKey="BU" barSize={20} fill="#e7d183" />
                                            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                                        </ComposedChart>

                                    </ResponsiveContainer> 

                            </WidgetWrapper>

                    </div>


                </div>

"           <div className="resource_consumption_overview"> 
                <div  className="consuption_composition" >
                   
                    <WidgetWrapper>
                            <TitleBar title='CORPORATE-WIDE ENERGY CONSUMPTION COMPOSITION'/> 

                            <div className="scopewise-chart">  
                                <ResponsiveContainer width="100%" height={400}> 

                                    <BarChart data={consumptionCompositionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar barSize={10} dataKey="Non Renewable Fuel Consumption" stackId="a" fill="#4c6a48" />
                                        <Bar barSize={10} dataKey="Electricity Consumption" stackId="a" fill="#466f81" /> 
                                    </BarChart>

                                </ResponsiveContainer> 
                            
                            </div>
                         </WidgetWrapper>

                </div> 
            </div>
        </WidgetWrapper>
    )
}; 

export default Resource_Consumption_Overview;


 








 