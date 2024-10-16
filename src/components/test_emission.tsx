import React, { useEffect, useState } from "react"; 
import { registerWidget, registerLink, registerUI, IContextProvider } from '../uxp';  
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official"; 
import { WidgetWrapper, TitleBar } from "uxp/components";

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}   
interface EmissionData {
    ScopeKey: string;
    ScopeName: string;
    CarbonEmission: string; // You can change this to number if your API always returns numbers
}
interface AggregatedData {
    name: string;
    y: number; // This will hold the aggregated carbon emissions
}
const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => {
    // State to store the emission breakdown data
    let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<any[]>([]);

    // Function to get scope emission breakdown data
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

    // Effect to call the data fetching function when the component mounts
    useEffect(() => {
        // Example parameters for BusinessUnitKey and dates
        const BusinessUnitKey = "5";
        const StartYear = 2023;
        const StartMonth = 1;
        const EndYear = 2023;
        const EndMonth = 12;

        // Call the function to get data
        getScopeEmissionBreakdownData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
    }, []); // Empty dependency array means it only runs once when the component mounts

    // Aggregate the data for the chart
    const aggregateData = (data: EmissionData[]): AggregatedData[] => {
        const aggregated: { [key: string]: number } = {}; // Use a record type to specify the key as a string and value as a number
    
        data.forEach(item => {
            const scopeName = item.ScopeName;
            const carbonEmission = parseFloat(item.CarbonEmission) || 0;
    
            if (aggregated[scopeName]) {
                aggregated[scopeName] += carbonEmission;
            } else {
                aggregated[scopeName] = carbonEmission;
            }
        });
    
        return Object.entries(aggregated).map(([name, value]) => ({
            name,
            y: value,
        }));
    };
    

    // Prepare the chart data
    const chartData = aggregateData(scopeEmissionBreakdowndata);

    const options = {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
            },
        },
        title: {
            text: 'Carbon Emissions by Scope',
        },
        plotOptions: {
            pie: {
                innerSize: '50%',
                depth: 45,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: <b>{point.y:.1f}</b>',
                },
                showInLegend: true,
            },
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemMarginTop: 5,
        },
        series: [{
            name: 'Carbon Emissions',
            data: chartData,
            showInLegend: true,
        }],
    };

    return (
        <WidgetWrapper>
            <TitleBar title='Test Emissions' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png" />
            <div style={{ display: "inline-flex", padding: "3em 3em" }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </WidgetWrapper>
    );
};

export default Test_Emission;














// import React, { useEffect, useState, useMemo  } from "react";
 

// import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
// import {  AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
// import { useToast, DataList, WidgetWrapper, Button, DynamicSelect, SearchBox, Modal, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
// import { ResponsivePie } from '@nivo/pie'; 
// import { ResponsiveSunburst } from "@nivo/sunburst";  


// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import Sunburst from "highcharts/modules/sunburst";


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
// interface ScopePopupData {
//     MonthString: string;
//     Scope1: number;
//     Scope2: number;
//     Scope3: number;
// } 

// interface IDataItem {
//     name: string;
//     value: number;
//     color?: string;  
//   }

// const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => { 

// let toast = useToast();
 
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
//         props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetClientList", {}, { json: true })
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
//         props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:'0'}, { json: true })
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
//         props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:MainUnitFilter}, { json: true })
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
 
//     useEffect(() => { 
//         getScopeEmissionBreakdownData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth); 
//     },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 
 
 
 
//   let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<any[]>([]); // Initialized as an empty array since the data is an array

//   function getScopeEmissionBreakdownData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
//     props.uxpContext.executeAction(
//       "OrganizationalEmissionOverview-Dataprovider",
//       "GetScopewiseEmissionBreakdown",
//       { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
//       { json: true }
//     )
//     .then((res: any) => {
//       console.log("response", res);
//       setScopeEmissionBreakdowndata(res);  
//     })
//     .catch((e: any) => {
//       console.error("Error fetching scope data", e);
//     });
//   }  

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
 
//     let [showModal, setShowModal] = React.useState(false);
//     let [modelData, setModelData] = React.useState<any>(null); 

//     function handleClick() {
//         console.log("Button clicked");  
//         setShowModal(true);  
//         setModelData({}); 
//     } 
    
//     const handleCloseModal = () => {
//         setShowModal(false);  
//         setModelData(null);  
//     };  
   
//     let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [selected1, setSelected1] = React.useState<string | null>("op-1");
//     let [selected2, setSelected2] = React.useState<string | null>("op-1");  

  

//     return (
//         <WidgetWrapper>
//             <TitleBar title='Test Emission' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
//                             <div className="top-filter">
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


//                                             <Select
//                                                 selected={endYear.toString()}
//                                                 options={Years}
//                                                 labelField="Label"
//                                                 valueField="Value"
//                                                 onChange={(value) => { setEndYear(Number(value)) }}
//                                                 placeholder=" -- select --"
//                                                 isValid={selected ? selected?.length > 0 : null}
//                                             /> 
//                                             <Select
//                                                 selected={endMonth.toString()}
//                                                 options={months}
//                                                 labelField="Label"
//                                                 valueField="Value"
//                                                 onChange={(value) => { setEndMonth(Number(value)) }}
//                                                 placeholder=" -- select --"
//                                                 isValid={selected ? selected?.length > 0 : null}
//                                             />   

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
//             </TitleBar> 
 

//                 <div style={{display:"inline-flex", padding:"3em 3em"}}>

//                     <div className="emi-breakdown" style={{display:"inline-block", width:"40%", height: "38em", margin:"0 1.5em 0 0"}}>  
                        
//                         {/* <Scopewise_Breakdown/> */}

//                 <WidgetWrapper>
//                         <TitleBar title='Scope-wise Total Emission Breakdown'>  
//                         </TitleBar>

//                         <div className="scopewise-chart">

//                             <div className="chart">  
//                                 <ResponsiveContainer>   

//                                 {groupedScopeEmissionBreakdowndata.length === 0 || groupedScopeEmissionBreakdowndata.every(item => item.value === 0) ? (
//                                     <div style={{ textAlign: "center", padding: "30% 0" }}>
//                                         <h3>No Data Available</h3>
//                                     </div>
//                                 ) : (
//                                     <>
//                                      <ResponsivePie
//                                         data={groupedScopeEmissionBreakdowndata}
//                                         margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
//                                         innerRadius={0.75}
//                                         padAngle={0}
//                                         cornerRadius={3}
//                                         colors={["#537453", "#486e76", "#b98056"]}
//                                         borderWidth={1}
//                                         borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
//                                         animate={false}
//                                         value="value"
//                                         activeOuterRadiusOffset={8}
//                                         arcLinkLabelsSkipAngle={10}
//                                         arcLinkLabelsTextColor="#333333"
//                                         arcLinkLabelsThickness={2}
//                                         arcLinkLabelsColor={{ from: 'color' }}
//                                         arcLabelsSkipAngle={1}
//                                         arcLabelsTextColor="#ffffff"
//                                         arcLabelsRadiusOffset={0.5}
//                                         arcLabel={d => `${d.value.toFixed(2)}%`} 
//                                     />  


                                    

//                                     <div className="view-more"> 
//                                         <Button title="View More" onClick={handleClick} />
//                                     </div>
//                                     </>
//                                 )}


//                                 </ResponsiveContainer>      
//                             </div>   

//                         </div>
//                     </WidgetWrapper>
                        
//                      </div>

                 
//                 </div> 

//         </WidgetWrapper>
//     )
// }; 

// export default Test_Emission;


  
 