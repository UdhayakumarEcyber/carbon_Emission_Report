// import * as React from "react"; 
// import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
// import { PieChart, Pie, AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,Cell  } from 'recharts';
// import { DataList, Modal, WidgetWrapper, Button, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
// import { ResponsivePie } from '@nivo/pie';
// import { ResponsiveSunburst } from "@nivo/sunburst"; 

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }

// const Categorywise_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => {   
 
//  // Data structure
//  const data = {
//     "name": "Total Emissions",
//     "children": [
//       {
//         "name": "Scope 1",
//         "color": "#466f81",
//         "children": [
//           { "name": "Stationary Combustion", "value": 20 },
//           { "name": "Fugitive Emission-Refrigerant", "value": 5 },
//           { "name": "Fugitive Emission-Fire Suppressant", "value": 5 },
//           { "name": "Fugitive Emission-Electrical Insulating Gas", "value": 5 },
//           { "name": "Fugitive Emission-Anesthetic Gas", "value": 5 },
//           { "name": "Fugitive Emission-Waste Water Treatment", "value": 5 }
//         ]
//       },
//       {
//         "name": "Scope 2",
//         "color": "#b97244",
//         "children": [
//           { "name": "Electricity purchased - location based", "value": 20 },
//           { "name": "Electricity purchased - market based", "value": 10 }
//         ]
//       },
//       {
//         "name": "Scope 3",
//         "color": "#4c6a48",
//         "children": [
//           { "name": "Category 1 - Purchased Goods & Services", "value": 5 },
//           { "name": "Category 2 - Capital Goods", "value": 5 },
//           { "name": "Category 3 - Fuel & Energy related Emissions", "value": 5 },
//           { "name": "Category 4 - Upstream Transportation", "value": 5 },
//           { "name": "Category 5 - Waste generated in Operations", "value": 5 },
//           { "name": "Category 6 - Business Travels", "value": 5 },
//           { "name": "Category 7 - Employee Commuting", "value": 5 }
//         ]
//       }
//     ]
//   }; 

 
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
 
//     const data1 = [
//         { month: 'Stationary Combustion', Scope1: 150},
//         { month: 'Mobile Combustion', Scope1: 160},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 180},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 100 },
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 170},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 200},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 190},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 200},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 180},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 170},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 140},
//         { month: 'Fugitive Emission-Refrigerent', Scope1: 180}
//     ]; 
    
//     let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [selected1, setSelected1] = React.useState<string | null>("op-1");
//     let [selected2, setSelected2] = React.useState<string | null>("op-1"); 

//     let [startDate, setStartDate] = React.useState<string | Date>(new Date()); 
//     let [endDate, setEndDate] = React.useState<string | Date>(addDays(90));  

//     function parseDate(date:string){ 
//         var currentTime = new Date(date);  
//         var month = ("0" + (currentTime.getMonth() + 1)).slice(-2); 
//         var day = ("0" + currentTime.getDate()).slice(-2);
//         var year = currentTime.getFullYear();
//         var formatedate = year + '-' + month + '-' + day; 
//         return formatedate;
//     }
 
//     let date = new Date(); 
//     date.setDate(date.getDate() + 1);
    
//     function addDays(days: number) { 
//         var result = new Date();
//         result.setDate(result.getDate() + days);
//         return result;
//     }  
    
//     return (
//         <WidgetWrapper>
//             <TitleBar title='Category-wise Total Emission Breakdown'/> 

//             <div className="scopewise-chart">
//                 <div className="chart">  
                      
//                         <ResponsiveSunburst  
//                             data={data}  
//                             margin={{ top: 10, right: 10, bottom: 10, left: 10 }}  
//                             id="name"  
//                             value="value"  
//                             cornerRadius={1}  
//                             borderWidth={1}  
//                             borderColor="white"  
//                             colors={[ '#4c6a48', '#466f81', '#b97244']} // Set custom colors  
//                             childColor={{ from: "color", modifiers: [["darker", 0.5]] }}  
//                             enableArcLabels={true}  
//                             arcLabelsSkipAngle={2} // Avoid labels on very small arcs  
//                             arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}  
//                             animate={true}  
//                             motionConfig="gentle"  
//                             isInteractive={true}  
//                             inheritColorFromParent={true} // Use parent's color for child arcs  
//                             arcLabel={(d) => `${d.id} (${d.value}%)`} // Customize label format  
//                         />    
                         
//                 </div>  
                
//                 <div className="view-more"> 
//                     <Button title="View More" onClick={handleClick} />
//                 </div>


//                  {/* Modal for Bar Chart */}
//                  <Modal className="popup"  title="Scope-Wise Operational Carbon Emissions Overview" show={showModal} onClose={handleCloseModal}>
//                     <div id="my_Popup">

//                         <div className="top-filter"> 

//                             <div className="select-filter">  

//                                 <FormField className="no-padding mb-only">
                                
//                                     <DateRangePicker title=""
//                                         startDate={startDate}
//                                         endDate={endDate}
//                                         closeOnSelect
//                                         onChange={(newStart, newEnd) => { setStartDate(newStart); setEndDate(newEnd)}}
//                                     /> 
//                                 </FormField>
                                

//                                 <Select
//                                     selected={selected}
//                                     options={[
//                                         { label: "Pruksha", value: "op-1" },
//                                         { label: "Pruksha 1", value: "op-2" },
//                                         { label: "Pruksha 2", value: "op-3" },
//                                     ]}
//                                     onChange={(value) => { setSelected(value) }}
//                                     placeholder=" -- select --"
//                                     isValid={selected ? selected?.length > 0 : null}
//                                 /> 

//                                 <Select
//                                     selected={selected1}
//                                     options={[
//                                         { label: "BU 01", value: "op-1" },
//                                         { label: "PS", value: "op-2" },
//                                         { label: "Vimut", value: "op-3" },
//                                     ]}
//                                     onChange={(value) => { setSelected1(value) }}
//                                     placeholder=" -- select --"
//                                     isValid={selected1 ? selected1?.length > 0 : null}
//                                 />   

//                                 <Select
//                                     selected={selected2}
//                                     options={[
//                                         { label: "RE-CD ", value: "op-1" },
//                                         { label: "RE-TH", value: "op-2" },
//                                         { label: "RE-SDH", value: "op-3" },
//                                     ]}
//                                     onChange={(value) => { setSelected2(value) }}
//                                     placeholder=" -- select --"
//                                     isValid={selected2 ? selected2?.length > 0 : null}
//                                 />    
//                             </div>  
//                             </div> 

//                         <ResponsiveContainer width="100%" height={400}>
//                             <BarChart data={data1} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="month" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar barSize={10} dataKey="Scope1" stackId="a" fill="#4c6a48" /> 
//                             </BarChart>
//                         </ResponsiveContainer> 
//                     </div>
//                 </Modal> 

//             </div>
//         </WidgetWrapper>
//     );
// }; 

// export default Categorywise_Breakdown;








// Live data //



import * as React from "react"; 
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { PieChart, Pie, AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,Cell  } from 'recharts';
import { DataList, Modal, WidgetWrapper, Button, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveSunburst } from "@nivo/sunburst"; 

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Categorywise_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => {   
 
 // Data structure
 const data = {
    "name": "Total Emissions",
    "children": [
      {
        "name": "Scope 1",
        "color": "#466f81",
        "children": [
          { "name": "Stationary Combustion", "value": 20 },
          { "name": "Fugitive Emission-Refrigerant", "value": 5 },
          { "name": "Fugitive Emission-Fire Suppressant", "value": 5 },
          { "name": "Fugitive Emission-Electrical Insulating Gas", "value": 5 },
          { "name": "Fugitive Emission-Anesthetic Gas", "value": 5 },
          { "name": "Fugitive Emission-Waste Water Treatment", "value": 5 }
        ]
      },
      {
        "name": "Scope 2",
        "color": "#b97244",
        "children": [
          { "name": "Electricity purchased - location based", "value": 20 },
          { "name": "Electricity purchased - market based", "value": 10 }
        ]
      },
      {
        "name": "Scope 3",
        "color": "#4c6a48",
        "children": [
          { "name": "Category 1 - Purchased Goods & Services", "value": 5 },
          { "name": "Category 2 - Capital Goods", "value": 5 },
          { "name": "Category 3 - Fuel & Energy related Emissions", "value": 5 },
          { "name": "Category 4 - Upstream Transportation", "value": 5 },
          { "name": "Category 5 - Waste generated in Operations", "value": 5 },
          { "name": "Category 6 - Business Travels", "value": 5 },
          { "name": "Category 7 - Employee Commuting", "value": 5 }
        ]
      }
    ]
  }; 

 
    let [showModal, setShowModal] = React.useState(false);
    let [modelData, setModelData] = React.useState<any>(null); 
 
    function handleClick() {
        console.log("Button clicked");  
        setShowModal(true);  
        setModelData({}); 
    }
 
    const handleCloseModal = () => {
        setShowModal(false);  
        setModelData(null);  
    };



    
    let [categorywisePopUpData,setCategorywisePopUpData] = React.useState<any>([]) 
    function getData (BusinessUnitKey:number,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number) {  
        props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider","GetCategorywiseEmissionOverview",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
            console.log("data",res);
            setCategorywisePopUpData(res);
        }).catch(e=>{
            // console.log("hi", e);
        }); 
    } 

    // let categorywisePopUpData = [
    //     {
    //         "ActivityCategoryTableKey": "32",
    //         "ActivityCategorytableName": "Table-2 : Method: Distance based",
    //         "CarbonEmission": "387526.79681396484"
    //     }
    // ]

 
    const data1 = [
        { month: 'Stationary Combustion', Scope1: 150},
        { month: 'Mobile Combustion', Scope1: 160},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 180},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 100 },
        { month: 'Fugitive Emission-Refrigerent', Scope1: 170},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 200},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 190},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 200},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 180},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 170},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 140},
        { month: 'Fugitive Emission-Refrigerent', Scope1: 180}
    ]; 
    

    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1"); 

    let [startDate, setStartDate] = React.useState<string | Date>(new Date()); 
    let [endDate, setEndDate] = React.useState<string | Date>(addDays(90));  

    function parseDate(date:string){ 
        var currentTime = new Date(date);  
        var month = ("0" + (currentTime.getMonth() + 1)).slice(-2); 
        var day = ("0" + currentTime.getDate()).slice(-2);
        var year = currentTime.getFullYear();
        var formatedate = year + '-' + month + '-' + day; 
        return formatedate;
    }
 
    let date = new Date(); 
    date.setDate(date.getDate() + 1);
    
    function addDays(days: number) { 
        var result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }  
    
    return (
        <WidgetWrapper>
            <TitleBar title='Category-wise Total Emission Breakdown'/> 

            <div className="scopewise-chart">
                <div className="chart">  
                      
                        <ResponsiveSunburst  
                            data={data}  
                            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}  
                            id="name"  
                            value="value"  
                            cornerRadius={1}  
                            borderWidth={1}  
                            borderColor="white"  
                            colors={[ '#4c6a48', '#466f81', '#b97244']} // Set custom colors  
                            childColor={{ from: "color", modifiers: [["darker", 0.5]] }}  
                            enableArcLabels={true}  
                            arcLabelsSkipAngle={2} // Avoid labels on very small arcs  
                            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}  
                            animate={true}  
                            motionConfig="gentle"  
                            isInteractive={true}  
                            inheritColorFromParent={true} // Use parent's color for child arcs  
                            arcLabel={(d) => `${d.id} (${d.value}%)`} // Customize label format  
                        />    
                         
                </div>  
                
                <div className="view-more"> 
                    <Button title="View More" onClick={handleClick} />
                </div>


                 {/* Modal for Bar Chart */}
                 <Modal className="popup"  title="Scope-Wise Operational Carbon Emissions Overview" show={showModal} onClose={handleCloseModal}>
                    <div id="my_Popup">

                        <div className="top-filter"> 

                            <div className="select-filter">  

                                <FormField className="no-padding mb-only">
                                
                                    <DateRangePicker title=""
                                        startDate={startDate}
                                        endDate={endDate}
                                        closeOnSelect
                                        onChange={(newStart, newEnd) => { setStartDate(newStart); setEndDate(newEnd)}}
                                    /> 
                                </FormField>
                                

                                <Select
                                    selected={selected}
                                    options={[
                                        { label: "Pruksha", value: "op-1" },
                                        { label: "Pruksha 1", value: "op-2" },
                                        { label: "Pruksha 2", value: "op-3" },
                                    ]}
                                    onChange={(value) => { setSelected(value) }}
                                    placeholder=" -- select --"
                                    isValid={selected ? selected?.length > 0 : null}
                                /> 

                                <Select
                                    selected={selected1}
                                    options={[
                                        { label: "BU 01", value: "op-1" },
                                        { label: "PS", value: "op-2" },
                                        { label: "Vimut", value: "op-3" },
                                    ]}
                                    onChange={(value) => { setSelected1(value) }}
                                    placeholder=" -- select --"
                                    isValid={selected1 ? selected1?.length > 0 : null}
                                />   

                                <Select
                                    selected={selected2}
                                    options={[
                                        { label: "RE-CD ", value: "op-1" },
                                        { label: "RE-TH", value: "op-2" },
                                        { label: "RE-SDH", value: "op-3" },
                                    ]}
                                    onChange={(value) => { setSelected2(value) }}
                                    placeholder=" -- select --"
                                    isValid={selected2 ? selected2?.length > 0 : null}
                                />    
                            </div>  
                            </div> 

                                        
                    <ResponsiveContainer width="100%" height={400}>
                    <BarChart 
                        data={categorywisePopUpData}  // Set the entire array as the data
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="CarbonEmission" />  {/* Match this with the key in the data */}
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                        barSize={10} 
                        dataKey="ActivityCategorytableName"  // Use "CarbonEmission" to match your data
                        stackId="a" 
                        fill="#4c6a48" 
                        />
                    </BarChart>
                    </ResponsiveContainer>


                    </div>
                </Modal> 

            </div>
        </WidgetWrapper>
    );
}; 

export default Categorywise_Breakdown;











// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Plugin } from 'chart.js';
// import { WidgetWrapper, TitleBar } from 'uxp/components';

// // Register necessary components from Chart.js
// ChartJS.register(ArcElement, Tooltip, Legend);

// const Categorywise_Breakdown = () => {
//   const data = {
//     labels: [
//       'Stationary Combustion (Scope 1)', 'Fugitive Emission-Refrigerant (Scope 1)',
//       'Fugitive Emission-Fire Suppressant (Scope 1)', 'Fugitive Emission-Electrical Insulating Gas (Scope 1)',
//       'Fugitive Emission-Anesthetic Gas (Scope 1)', 'Fugitive Emission-Waste Water Treatment (Scope 1)',
//       'Purchased Goods & Services (Scope 3)', 'Capital Goods (Scope 3)',
//       'Fuel & Energy related Emissions (Scope 3)'
//     ],
//     datasets: [
//       {
//         label: 'Scope 1',
//         data: [50, 5, 5, 20, 5, 5, 20, 5, 5], // Matching percentages for Scope 1
//         backgroundColor: ['rgb(76, 106, 72)', 'rgb(76, 106, 72)', 'rgb(76, 106, 72)', 'rgb(65, 103, 120)', 'rgb(65, 103, 120)', 'rgb(65, 103, 120)', 'rgb(185, 114, 68)','rgb(185, 114, 68)','rgb(185, 114, 68)'],
//         borderWidth: 2,
//       },
//       {
//         label: 'Scope 3',
//         data: [50, 30, 20], // Matching percentages for Scope 3
//         backgroundColor: ['rgb(76, 106, 72)', 'rgb(65, 103, 120)', 'rgb(185, 114, 68)'],
//         borderWidth: 1,
//       },
//     ],
//   };

 
//   const options: ChartOptions<'doughnut'> = {
//     cutout: '0%', // Adjust the cutout to make space for the legend inside the doughnut chart
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'chartArea', // Positioning legend on the chart
//         align: 'center',       // Align legend in the center
//         labels: {
//           boxWidth: 0,        // Box size for legend labels
//         },
//       },
//       tooltip: {
//         enabled: true,         // Enable tooltips
//       },
//     },
//   };

//   // Define the custom plugin with proper TypeScript typing
//   const centerLegendPlugin: Plugin<'doughnut'> = {
//     id: 'centerLegendPlugin', // Ensure the 'id' field is correctly typed
//     afterDraw: (chart) => {
//       const { width } = chart;
//       const ctx = chart.ctx;
//       const totalLabel = 'Total Emissions'; // You can add a label in the center if needed

//       ctx.save();
//       ctx.font = 'bold 16px Arial';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillStyle = '#666'; // Text color
//       ctx.fillText(totalLabel, width / 2, chart.height / 2);
//       ctx.restore();
//     },
//   };

//   return (
//     <WidgetWrapper>
//       <TitleBar title="Category-wise Total Emission Breakdown" />

//       <div className="scopewise-chart">
//         <div className="chart" style={{ width: '100%', height: '500px' }}>
//           <Doughnut data={data} options={options} plugins={[centerLegendPlugin]} />
//         </div>
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Categorywise_Breakdown;
