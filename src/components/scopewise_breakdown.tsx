import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { DataList, WidgetWrapper, Button, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { ResponsivePie } from '@nivo/pie';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Scopewise_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => { 

 
    let scopewiseData = [,
        {"ScopeWiseKey":"1","ScopewiseName":"Scope 1","ScopewiseCount":"30"},
        {"ScopeWiseKey":"2","ScopewiseName":"Scope 2","ScopewiseCount":"20"},
        {"ScopeWiseKey":"3","ScopewiseName":"Scope 3","ScopewiseCount":"50"} 
    ]
    return (
        <WidgetWrapper>
            <TitleBar title='Scope-wise Total Emission Breakdown'/> 

            <div className="scopewise-chart">

                <div className="chart">  
                    <ResponsiveContainer>   
                        <ResponsivePie  
                            data={scopewiseData}
                            id="ScopewiseName" 
                            margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
                            innerRadius={0.75}  // Increase inner radius to create a donut-like shape
                            padAngle={0}
                            cornerRadius={3}
                            colors={["#466f81", "#b97244", "#4c6a48"]}  // Custom colors to match the image
                            borderWidth={1}
                            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }} 
                            animate={true}   
                            value="ScopewiseCount"  
                            activeOuterRadiusOffset={8}  
                            
                            // Configure labels and links
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={1}
                            arcLabelsTextColor="#ffffff" 
                            arcLabelsRadiusOffset={0.5}  // Adjust label position outside the donut
                            arcLabel={d => `${d.value}%`}  // Format labels with name and percentage
                        />    
                    </ResponsiveContainer>      
                </div>  
                
               <div className="view-more"><a href="">View More</a></div>

            </div>

        </WidgetWrapper>
    )
};
 

export default Scopewise_Breakdown;