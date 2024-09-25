// import * as React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
// import { WidgetWrapper, TitleBar } from "uxp/components";
// import { IContextProvider } from "../uxp";
 

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }

// const Scope1_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => {  
  
//     const data = [
//         { name: 'Stationary Combustion', value: 285 },
//         { name: 'Mobile Combustion', value: 421 },
//         { name: 'Fugitive Emission-Refrigerant', value: 158 },
//         { name: 'Fugitive Emission-Fire Suppressant', value: 325 },
//         { name: 'Fugitive Emission-Electrical Insulating Gas', value: 312 },
//         { name: 'Fugitive Emission-Anesthetic Gas', value: 400 },
//         { name: 'Fugitive Emission-Waste Water Treatment', value: 368 },
//       ];
      
//       const maxValue = 500; // Set the maximum value for 100%


//     return (
//         <WidgetWrapper>
//             <TitleBar title='Category-wise Total Emission Breakdown'/> 

//             <div className="scopewise-chart">
//                 <div className="chart">  
                   
//                 <ResponsiveContainer width="100%" height={400}>
//                     <BarChart
//                         data={data}
//                         layout="vertical"
//                         margin={{ top: 10, right: 100, left: 40, bottom: 10 }}  > 
//                         <XAxis type="number" domain={[0, 500]} ticks={[0, 100, 200, 300, 400, 500]} /> 
//                         <YAxis dataKey="name" type="category" width={250} />  
//                         {/* <Tooltip />  */}
//                         {data.map((entry, index) => {
//                         const percentage = (entry.value / maxValue) * 100;  
//                         const barHeight = 30;  
//                         const barSpacing = 50;   
//                         return (
//                             <g key={`bar-${index}`}> 
//                             <rect
//                                 x={290}
//                                 y={index * barSpacing + 25}  
//                                 width={`${percentage}%`}
//                                 height={barHeight}
//                                 fill="#4f805d" 
//                             />
                            
//                             <rect
//                                 x={`${percentage}%`}
//                                 y={index * barSpacing + 25} 
//                                 width={`${100 - percentage}%`}
//                                 height={barHeight}
//                                 fill="#ccc" 
//                             /> 
//                             <text
//                                 x="100%"  
//                                 y={index * barSpacing + barHeight / 2 + 25}  
//                                 fill="#000"
//                                 textAnchor="end"  
//                                 dominantBaseline="middle"
//                             >
//                                 {/* {`${entry.value} tCO2e (${percentage.toFixed(1)}%)`} */}
//                                 {`${500} tCO2e (${25}%)`}
//                             </text>
//                             </g>
//                         );
//                         })}
//                     </BarChart>
//                     </ResponsiveContainer>

//                 </div>  
                
                
//             </div>
//         </WidgetWrapper>
//     );
// }; 

// export default Scope1_Breakdown;




 

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { WidgetWrapper, TitleBar } from "uxp/components";
import { IContextProvider } from "../uxp";
 

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Scope1_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => {  
  
    const data = [  
        {  
         name: 'Stationary Combustion',  
         value: 500,  
         label: '500 tCO2e (25%)'  
        },  
        {  
         name: 'Mobile Combustion',  
         value: 480,  
         label: '400 tCO2e (20%)'  
        },  
        {  
         name: 'Fugitive Emission-Refrigerant',  
         value: 421,  
         label: '300 tCO2e (15%)'  
        },  
        {  
         name: 'Fugitive Emission-Fire Suppressant',  
         value: 200,  
         label: '200 tCO2e (10%)'  
        },  
        {  
         name: 'Fugitive Emission-Electrical Insulating Gas',  
         value: 156,  
         label: '150 tCO2e (7.5%)'  
        },  
        {  
         name: 'Fugitive Emission-Anesthetic Gas',  
         value: 390,  
         label: '100 tCO2e (5%)'  
        },  
        {  
         name: 'Fugitive Emission-Waste Water Treatment',  
         value: 368,  
         label: '50 tCO2e (2.5%)'  
        }  
      ]; 


    return (
        <WidgetWrapper>
            <TitleBar title='Category-wise Total Emission Breakdown'/> 

            <div className="scopewise-chart">
                <div className="chart">  
                   
                <ResponsiveContainer width="100%" height={400}>  
                    <BarChart  
                      width={500}  
                      height={300}  
                      data={data}  
                      layout="vertical"  
                      margin={{  
                       top: 20,  
                       right: 20,  
                       bottom: 20,  
                       left: 20  
                      }}  
                    >  
                      <CartesianGrid strokeDasharray="3 3" />  
                      <XAxis type="number"/>  
                      <YAxis type="category" dataKey="name" width={280} />  
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
                </ResponsiveContainer>


                </div>  
                
                
            </div>
        </WidgetWrapper>
    );
}; 

export default Scope1_Breakdown;
