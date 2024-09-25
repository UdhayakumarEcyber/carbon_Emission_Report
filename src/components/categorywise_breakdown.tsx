import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; 
import { WidgetWrapper, TitleBar } from "uxp/components";
import { IContextProvider } from "../uxp";

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Categorywise_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => {  

    const data = [
        { name: 'Scope 1', value: 40 },
        { name: 'Scope 2', value: 30 },
        { name: 'Scope 3', value: 30 },
    ];
    
    const scope1Data = [
        { name: 'Stationary Combustion', value: 20 },
        { name: 'Stationary Combustion', value: 20 },
        { name: 'Fugitive Emission-Refrigerent', value: 5 },
        { name: 'Fugitive Emission-Fire Suppressant', value: 5 },
        { name: 'Fugitive Emission-Electircal Insulating Gas', value: 5 },
        { name: 'Fugitive Emission-Anesthetic Gas', value: 5 },
        { name: 'Fugitive Emission-Waste Water Treatment', value: 5 },
    ];
    
    const scope2Data = [
        { name: 'Electricity purchased-location based', value: 20 },
        { name: 'Electricity purchased-market based', value: 10 },
    ];
    
    const scope3Data = [
        { name: 'Electricity sold', value: 5 },
        { name: 'Category 1-Purchased Goods & Services', value: 5 },
        { name: 'Category 2-Capital Goods', value: 5 },
        { name: 'Category 3-Fuel & Energy related Emissions', value: 5 },
        { name: 'Category 4-Upstream Transportation', value: 5 },
        { name: 'Category 5-Waste generated in Operations', value: 5 },
        { name: 'Category 6-Business Travels', value: 5 },
        { name: 'Category 7-Employee Commuting', value: 5 },
    ];

    const COLORS = [
        // Scope 1 colors
        '#547949', '#46653B', '#37502A', '#293C1A', '#1B270A', '#203312', '#2A401B',
        // Scope 2 colors
        '#4682B4', '#274056',
        // Scope 3 colors
        '#A0522D', '#8B4513', '#783808', '#652B03', '#521E00', '#3F1100', '#2C0A00', '#190300',
    ];

    const RADIAN = Math.PI / 180;

    // Updated function to ensure labels are visible
    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Adjust text color dynamically based on background slice color
        const textColor = percent > 0.1 ? 'black' : 'white';

        return (
            <text
                x={x}
                y={y}
                fill={textColor} // Use the calculated text color
                fontSize={12} // Adjust font size for better visibility
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    
    return (
        <WidgetWrapper>
            <TitleBar title='Category-wise Total Emission Breakdown'/> 

            <div className="scopewise-chart">
                <div className="chart">  
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie 
                                data={data} 
                                dataKey="value" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={60} 
                                fill="#8884d8" 
                                labelLine={false}
                                label={renderCustomizedLabel} // Ensure label is applied
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Pie 
                                data={scope1Data} 
                                dataKey="value" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                fill="#82ca9d" 
                                label={renderCustomizedLabel} // Apply labels here
                            >
                                {scope1Data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Pie 
                                data={scope2Data} 
                                dataKey="value" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={80} 
                                outerRadius={100} 
                                fill="#ffc658" 
                                label={renderCustomizedLabel} // Apply labels here
                            >
                                {scope2Data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index + scope1Data.length]} />
                                ))}
                            </Pie>
                            <Pie 
                                data={scope3Data} 
                                dataKey="value" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={100} 
                                outerRadius={120} 
                                fill="#ffd700" 
                                label={renderCustomizedLabel} // Apply labels here
                            >
                                {scope3Data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index + scope1Data.length + scope2Data.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                </div>  
                
               <div className="view-more"><a href="">View More</a></div>
            </div>
        </WidgetWrapper>
    );
}; 

export default Categorywise_Breakdown;
