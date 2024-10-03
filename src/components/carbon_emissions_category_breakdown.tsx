// import  React, {useState} from "react";
// import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
// import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
// import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
// import { PieChart, Pie, Cell } from 'recharts';
// import { ResponsivePie } from '@nivo/pie';

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }

// const Emissions_Category_Breakdown: React.FunctionComponent<IWidgetProps> = (_props) => {

//     const org_overview = {
//         "scopeName": "Scope 1" 
//       };    
    
//     let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [selected1, setSelected1] = React.useState<string | null>("op-1");
//     let [selected2, setSelected2] = React.useState<string | null>("op-1");
//     let [selected3, setSelected3] = React.useState<string | null>("op-1");
    
//     let [startDate, setStartDate] = React.useState<string | Date>(new Date()); 
//     let [endDate, setEndDate] = React.useState<string | Date>(addDays(90));   


//     const [toggleFilterValue, setToggleFilterValue] = useState<"Scope 1" | "Scope 2" | "Scope 3">("Scope 1");
//     const [filter, setFilter] = useState<'Scope 1' | 'Scope 2' | 'Scope 3'>('Scope 1');  

//   const handleFilterChange = (value: "Scope 1" | "Scope 2" | "Scope 3") => {
//     console.log("Selected Filter Value:", value);
//     setToggleFilterValue(value);
//     if (value === 'Scope 1') {
//       setFilter('Scope 1');
//     } else if (value === 'Scope 2') {
//       setFilter('Scope 2');
//     } else if (value === 'Scope 3') {
//       setFilter('Scope 3');
//     }
//   }; 
 
//     let date = new Date(); 
//     date.setDate(date.getDate() + 1);
    
//     function addDays(days: number) { 
//         var result = new Date();
//         result.setDate(result.getDate() + days);
//         return result;
//     }  

//     const [isBarChart, setIsBarChart] = useState(true); 


//     const data = [  
//         {  
//          name: 'Stationary Combustion',  
//          value: 500,  
//          label: '500 tCO2e (25%)'  
//         },  
//         {  
//          name: 'Mobile Combustion',  
//          value: 480,  
//          label: '400 tCO2e (20%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Refrigerant',  
//          value: 421,  
//          label: '300 tCO2e (15%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Fire Suppressant',  
//          value: 200,  
//          label: '200 tCO2e (10%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Electrical Insulating Gas',  
//          value: 156,  
//          label: '150 tCO2e (7.5%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Anesthetic Gas',  
//          value: 390,  
//          label: '100 tCO2e (5%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Waste Water Treatment',  
//          value: 368,  
//          label: '50 tCO2e (2.5%)'  
//         }  
//     ];

    
//     const data1 = [  
//         {  
//          name: 'Stationary Combustion',  
//          value: 452,  
//          label: '500 tCO2e (25%)'  
//         },  
//         {  
//          name: 'Mobile Combustion',  
//          value: 280,  
//          label: '400 tCO2e (20%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Refrigerant',  
//          value: 421,  
//          label: '300 tCO2e (15%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Fire Suppressant',  
//          value: 300,  
//          label: '200 tCO2e (10%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Electrical Insulating Gas',  
//          value: 432,  
//          label: '150 tCO2e (7.5%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Anesthetic Gas',  
//          value: 302,  
//          label: '100 tCO2e (5%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Waste Water Treatment',  
//          value: 157,  
//          label: '50 tCO2e (2.5%)'  
//         }  
//     ];


    
//     const data2 = [  
//         {  
//          name: 'Stationary Combustion',  
//          value: 300,  
//          label: '500 tCO2e (25%)'  
//         },  
//         {  
//          name: 'Mobile Combustion',  
//          value: 124,  
//          label: '400 tCO2e (20%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Refrigerant',  
//          value: 478,  
//          label: '300 tCO2e (15%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Fire Suppressant',  
//          value: 230,  
//          label: '200 tCO2e (10%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Electrical Insulating Gas',  
//          value: 236,  
//          label: '150 tCO2e (7.5%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Anesthetic Gas',  
//          value: 124,  
//          label: '100 tCO2e (5%)'  
//         },  
//         {  
//          name: 'Fugitive Emission-Waste Water Treatment',  
//          value: 390,  
//          label: '50 tCO2e (2.5%)'  
//         }  
//     ];

//     const COLORS = ['#4f805d', '#82ca9d', '#8884d8', '#ffc658', '#ff7300', '#00c49f', '#4c99a2'];

 
//   const transformedData = data.map((entry, index) => ({
//     id: entry.name,
//     label: entry.label,
//     value: entry.value,
//     color: COLORS[index % COLORS.length],
//   }));

//     return (
//         <WidgetWrapper>
//             <TitleBar title='Organizational Carbon Emissions Category Breakdown' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
//                             <div className="top-filter">
//                                 <div className="select-filter">  
                                        
//                                     <FormField className="no-padding mb-only">
                                        
//                                         <DateRangePicker title=""
//                                             startDate={startDate}
//                                             endDate={endDate}
//                                             closeOnSelect
//                                             onChange={(newStart, newEnd) => { setStartDate(newStart); setEndDate(newEnd)}}
//                                         /> 
//                                     </FormField>

//                                     <Select
//                                         selected={selected}
//                                         options={[
//                                             { label: "Pruksha", value: "op-1" },
//                                             { label: "Pruksha 1", value: "op-2" },
//                                             { label: "Pruksha 2", value: "op-3" },
//                                         ]}
//                                         onChange={(value) => { setSelected(value) }}
//                                         placeholder=" -- select --"
//                                         isValid={selected ? selected?.length > 0 : null}
//                                     /> 

//                                     <Select
//                                         selected={selected1}
//                                         options={[
//                                             { label: "BU 01", value: "op-1" },
//                                             { label: "BU 02", value: "op-2" },
//                                             { label: "BU 03", value: "op-3" },
//                                         ]}
//                                         onChange={(value) => { setSelected1(value) }}
//                                         placeholder=" -- select --"
//                                         isValid={selected1 ? selected1?.length > 0 : null}
//                                     />    
//                                 </div> 

//                             <FilterPanel>

//                             <Select
//                                  selected={selected2}
//                                     options={[
//                                         { label: "RE-CD ", value: "op-1" },
//                                         { label: "RE-TH", value: "op-2" },
//                                         { label: "RE-SDH", value: "op-3" },
//                                     ]}
//                                     onChange={(value) => { setSelected2(value) }}
//                                     placeholder=" -- select --"
//                                     isValid={selected2 ? selected2?.length > 0 : null}
//                                 /> 
//                             </FilterPanel>
//                         </div>
//             </TitleBar>


//                 <div className="scope-overall"> 

//                     <div className="scope-box green-scope-box">  
//                         <h4>{org_overview.scopeName}</h4>
//                         {/* <h3>{assetagedata.AssetAge}<em className="years">YRS</em></h3>  */}
//                         <h3>453 tCO<em>2</em>e</h3>  
                       
//                         <div className="scope-bottom">
//                               <em>23.1 %</em><span className="arrow up-arrow"></span>
//                         </div>
//                     </div>

//                     <div className="scope-box blue-scope-box">  
//                         <h4>{org_overview.scopeName}</h4> 
//                         <h3>453 tCO<em>2</em> e</h3>  
//                         <div className="scope-bottom">
//                             <em>23.1 %</em><span className="arrow down-arrow"></span>
//                         </div>
//                     </div>
                    
//                     <div className="scope-box orange-scope-box">  
//                         <h4>{org_overview.scopeName}</h4> 
//                         <h3>453 tCO<em>2</em> e</h3>  
//                         <div className="scope-bottom">
//                              <em>23.1 %</em><span className="arrow down-arrow"></span>
//                         </div>
//                     </div> 


//                 </div>


//             <div className="scope1_breakdown_widget">
//                 <WidgetWrapper>
//                     <TitleBar title='Scope 1 BreakDown'>  
                        
//                             <div className="top-filter"> 

                     
//                             <div className="toggle-btn">
//                                     <em className="piechart_label">Pie Chart </em>
                                   
//                                     <label className="switch">
//                                         <input
//                                             type="checkbox"
//                                             checked={isBarChart}
//                                             onChange={() => setIsBarChart(!isBarChart)} // Toggle on change
//                                         />
//                                         <span className="slider"></span>
//                                     </label>
//                                     <em className="barchart_label">Bar Chart </em>    
//                             </div> 

//                             <ToggleFilter
//                                 options={[
//                                     { label: "Scope 1", value: "Scope 1" },
//                                     { label: "Scope 2", value: "Scope 2" },
//                                     { label: "Scope 3", value: "Scope 3" },
//                                 ]}
//                                 value={toggleFilterValue}
//                                 onChange={handleFilterChange}
//                                 />  
//                         </div>
//                  </TitleBar> 


//                     <div className="scopewise-chart scope1_breakdown">
//                         <div className="chart">     

//                         <ResponsiveContainer width="100%" height={400}> 
//                             {isBarChart ? ( 
//                             <BarChart
//                                 data={data}
//                                 layout="vertical"
//                                 margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis type="number" />
//                                 <YAxis type="category" dataKey="name" width={280} />
//                                 <YAxis type="category" yAxisId="right" orientation="right" dataKey="label" width={100} />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Bar
//                                 dataKey="value"
//                                 fill="#4f805d"
//                                 barSize={20}
//                                 label={(props: any) => (
//                                     <text
//                                     x={props.x + props.width + 10}
//                                     y={props.y + props.height / 2}
//                                     textAnchor="end"
//                                     dominantBaseline="middle"
//                                     fontSize="12"
//                                     fill="#f00"
//                                     >
//                                     {props.label}
//                                     </text>
//                                 )}
//                                 />
//                             </BarChart>
                            
//                         ) : ( 
//                             <ResponsivePie  
//                                 data={transformedData}
//                                 id="id"
//                                 margin={{ top: 5, right: 30, bottom:30, left: 0 }}
//                                 innerRadius={0.75}
//                                 padAngle={0}
//                                 cornerRadius={3}
//                                 colors={transformedData.map((item) => item.color)}
//                                 borderWidth={1}
//                                 borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
//                                 animate={true}
//                                 value="value"
//                                 activeOuterRadiusOffset={8}
//                                 arcLinkLabelsSkipAngle={10}
//                                 arcLinkLabelsTextColor="#333333"
//                                 arcLinkLabelsThickness={2}
//                                 arcLinkLabelsColor={{ from: 'color' }}
//                                 arcLabelsSkipAngle={1}
//                                 arcLabelsTextColor="#000000"
//                                 arcLabelsRadiusOffset={0.5}
//                                 arcLabel={(d) => `${d.value}%`}
//                             /> 
//                             )} 
//                             </ResponsiveContainer>  
//                       </div> 
//                  </div>

//                 </WidgetWrapper>

//               </div>   

//         </WidgetWrapper>
//     )
// }; 

// export default Emissions_Category_Breakdown;


 


import  React, {useState} from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { PieChart, Pie, Cell } from 'recharts';
import { ResponsivePie } from '@nivo/pie';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

 const Emissions_Category_Breakdown: React.FunctionComponent<IWidgetProps> = (_props) => {
  const [toggleFilterValue, setToggleFilterValue] = useState<"Scope 1" | "Scope 2" | "Scope 3">("Scope 1");
  const [isPieChart, setIsPieChart] = useState(false);

     let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1");
    let [selected3, setSelected3] = React.useState<string | null>("op-1");
    
    let [startDate, setStartDate] = React.useState<string | Date>(new Date()); 
    let [endDate, setEndDate] = React.useState<string | Date>(addDays(90));  


    let date = new Date(); 
    date.setDate(date.getDate() + 1);
    
    function addDays(days: number) { 
        var result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }  

      const org_overview = {
        "scopeName": "Scope 1" 
      };  

  const dataScope1 = [
    { name: 'Stationary Combustion', value: 500, label: '500 tCO2e (25%)' },
    { name: 'Mobile Combustion', value: 480, label: '400 tCO2e (20%)' },
    { name: 'Fugitive Emission-Refrigerant', value: 421, label: '300 tCO2e (15%)' },
    { name: 'Fugitive Emission-Fire Suppressant', value: 200, label: '200 tCO2e (10%)' },
    { name: 'Fugitive Emission-Electrical Insulating Gas', value: 156, label: '150 tCO2e (7.5%)' },
    { name: 'Fugitive Emission-Anesthetic Gas', value: 390, label: '100 tCO2e (5%)' },
    { name: 'Fugitive Emission-Waste Water Treatment', value: 368, label: '50 tCO2e (2.5%)' }
  ];

  const dataScope2 = [
    { name: 'Stationary Combustion', value: 452, label: '500 tCO2e (25%)' },
    { name: 'Mobile Combustion', value: 280, label: '400 tCO2e (20%)' },
    { name: 'Fugitive Emission-Refrigerant', value: 421, label: '300 tCO2e (15%)' },
    { name: 'Fugitive Emission-Fire Suppressant', value: 300, label: '200 tCO2e (10%)' },
    { name: 'Fugitive Emission-Electrical Insulating Gas', value: 432, label: '150 tCO2e (7.5%)' },
    { name: 'Fugitive Emission-Anesthetic Gas', value: 302, label: '100 tCO2e (5%)' },
    { name: 'Fugitive Emission-Waste Water Treatment', value: 157, label: '50 tCO2e (2.5%)' }
  ];

  const dataScope3 = [
    { name: 'Stationary Combustion', value: 300, label: '500 tCO2e (25%)' },
    { name: 'Mobile Combustion', value: 124, label: '400 tCO2e (20%)' },
    { name: 'Fugitive Emission-Refrigerant', value: 478, label: '300 tCO2e (15%)' },
    { name: 'Fugitive Emission-Fire Suppressant', value: 230, label: '200 tCO2e (10%)' },
    { name: 'Fugitive Emission-Electrical Insulating Gas', value: 236, label: '150 tCO2e (7.5%)' },
    { name: 'Fugitive Emission-Anesthetic Gas', value: 124, label: '100 tCO2e (5%)' },
    { name: 'Fugitive Emission-Waste Water Treatment', value: 390, label: '50 tCO2e (2.5%)' }
  ];

  const handleFilterChange = (value: "Scope 1" | "Scope 2" | "Scope 3") => {
    setToggleFilterValue(value);
  };

  const getDataForScope = () => {
    if (toggleFilterValue === 'Scope 1') return dataScope1;
    if (toggleFilterValue === 'Scope 2') return dataScope2;
    return dataScope3;
  };

  const transformedData = getDataForScope().map((entry, index) => ({
    id: entry.name,
    label: entry.label,
    value: entry.value,
    color: ['#4f805d', '#82ca9d', '#8884d8', '#ffc658', '#ff7300', '#00c49f', '#4c99a2'][index % 7],
  }));

  return (
    <WidgetWrapper>

                    <TitleBar title='Organizational Carbon Emissions Category Breakdown' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
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
                                             { label: "BU 02", value: "op-2" },
                                             { label: "BU 03", value: "op-3" },
                                         ]}
                                         onChange={(value) => { setSelected1(value) }}
                                         placeholder=" -- select --"
                                         isValid={selected1 ? selected1?.length > 0 : null}
                                     />    
                                 </div> 
 
                             <FilterPanel>
 
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
                             </FilterPanel>
                         </div>
             </TitleBar>



      
               <div className="scope-overall"> 

                   <div className="scope-box green-scope-box">  
                       <h4>{org_overview.scopeName}</h4>
                       {/* <h3>{assetagedata.AssetAge}<em className="years">YRS</em></h3>  */}
                       <h3>453 tCO<em>2</em>e</h3>  
                       
                       <div className="scope-bottom">
                             <em>23.1 %</em><span className="arrow up-arrow"></span>
                       </div>
                   </div>

                   <div className="scope-box blue-scope-box">  
                       <h4>{org_overview.scopeName}</h4> 
                       <h3>453 tCO<em>2</em> e</h3>  
                       <div className="scope-bottom">
                           <em>23.1 %</em><span className="arrow down-arrow"></span>
                       </div>
                   </div>
                    
                   <div className="scope-box orange-scope-box">  
                       <h4>{org_overview.scopeName}</h4> 
                       <h3>453 tCO<em>2</em> e</h3>  
                       <div className="scope-bottom">
                            <em>23.1 %</em><span className="arrow down-arrow"></span>
                       </div>
                   </div> 


               </div>

           <div className="scope1_breakdown_widget"> 

               <WidgetWrapper>
                 
               <TitleBar title='Scope 1 BreakDown'>  

                    <div className="top-filter">

                        <div className="toggle-btn">
                              
                                <em className="chart_label barchart_label">Bar Chart </em>   
                                    <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isPieChart}
                                        onChange={() => setIsPieChart(!isPieChart)} // Toggle on change
                                    />
                                    <span className="slider"></span>
                                </label>
                                <em className="chart_label piechart_label">Pie Chart </em>
                        </div> 

                <ToggleFilter
                    options={[
                    { label: "Scope 1", value: "Scope 1" },
                    { label: "Scope 2", value: "Scope 2" },
                    { label: "Scope 3", value: "Scope 3" },
                    ]}
                    value={toggleFilterValue}
                    onChange={handleFilterChange}
                />
        </div>
      </TitleBar> 

 

            <div className="scopewise-chart">
                <div className="chart">
                <ResponsiveContainer width="100%" height={400}>
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
                        data={getDataForScope()}
                        layout="vertical"
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={280} />
                        <YAxis type="category" yAxisId="right" orientation="right" dataKey="label" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar
                        dataKey="value"
                        fill="#4f805d"
                        barSize={20}
                        label={(props: any) => (
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
                </div>
            </div>
            </WidgetWrapper>
         
         </div>

    </WidgetWrapper>
    
  );
};

export default Emissions_Category_Breakdown;
