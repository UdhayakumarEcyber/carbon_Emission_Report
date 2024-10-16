// import React, { useEffect, useState, useMemo  } from "react";
// import { registerWidget, registerLink, registerUI, IContextProvider } from '../uxp';  
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official"; 
// import { WidgetWrapper, TitleBar } from "uxp/components";

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }   
// interface EmissionData {
//     ScopeKey: string;
//     ScopeName: string;
//     CarbonEmission: string;  
// }
// interface AggregatedData {
//     name: string;
//     y: number; 
// }
// const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => { 

//     const colorMap: { [key: string]: string } = {
//         'Scope 1': '#537453',
//         'Scope 2': '#486e76',
//         'Scope 3': '#b98056',
//       }; 

//     useEffect(() => { 
//         const BusinessUnitKey = "5";
//         const StartYear = 2023;
//         const StartMonth = 1;
//         const EndYear = 2023;
//         const EndMonth = 12;
 
//         getScopeEmissionBreakdownData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
//     }, []);  
  
//     let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<EmissionData[]>([]);
  
//     function getScopeEmissionBreakdownData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
//       props.uxpContext.executeAction(
//         "OrganizationalEmissionOverview-Dataprovider",
//         "GetScopewiseEmissionBreakdown",
//         { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
//         { json: true }
//       )
//       .then((res: any) => {
//         console.log("response", res);
//         setScopeEmissionBreakdowndata(res);  
//       })
//       .catch((e: any) => {
//         console.error("Error fetching scope data", e);
//       });
//     }  
     
//   const groupedScopeEmissionBreakdowndata = useMemo(() => {
//       const groupedData = scopeEmissionBreakdowndata.reduce((acc: { [key: string]: number }, item) => {
//           const scopeKey = item.ScopeKey;
//           const carbonEmission = parseFloat(item.CarbonEmission) || 0;
  
//           if (scopeKey && carbonEmission > 0) {
//               if (acc[scopeKey]) {
//                   acc[scopeKey] += carbonEmission;
//               } else {
//                   acc[scopeKey] = carbonEmission;
//               }
//           }
//           return acc;
//       }, {});
   
//       return Object.keys(groupedData).map(scopeKey => ({
//           name: `Scope ${scopeKey}`,
//           y: parseFloat(groupedData[scopeKey].toFixed(2)),  
//           color: colorMap[`Scope ${scopeKey}`]            
//       }));
//   }, [scopeEmissionBreakdowndata]); 
//   const chartData = groupedScopeEmissionBreakdowndata; 
    
// const scope_options = {
    
//     chart: {
//         type: "pie",
//         height: "80%",
//         margin: [20,10, 0, 10],
//       },
    
//     title: {
//       text: "",
//     },
//     tooltip: { 
//             pointFormat: "<b>{point.name}</b>: {point.y:.2f} kgCO2e"  
//         },
//     plotOptions: {
//         pie: {
//             innerSize: '60%',
//             depth: 40,
//             dataLabels: {
//                 enabled: true, 
//                 format: "{point.name}: {point.y:.2f} kgCO2e",
//             },
//             showInLegend: true
//         }
//     },
//     legend: {
//         enabled: true,
//         layout: 'vertical',
//         align: 'right',
//         verticalAlign: 'middle',
//         itemMarginTop: 1,
//     },
//     credits: {
//         enabled: false,
//       },
//     series: [{
//         name: 'Emissions',
//         colorByPoint: true,
//         data: chartData
//     }]
// }; 

//     return (
//         <WidgetWrapper>
//             <TitleBar title='Test Emissions' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png" />
//             <div style={{ display: "inline-flex", padding: "3em 3em" }}> 
//                 <HighchartsReact highcharts={Highcharts} options={scope_options} /> 
//             </div>
//         </WidgetWrapper>
//     );
// };

// export default Test_Emission;


 






import React, { useEffect, useState, useMemo } from "react";
import { registerWidget, registerLink, registerUI, IContextProvider } from '../uxp';  
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official"; 
import { WidgetWrapper, TitleBar } from "uxp/components";
import { Modal } from "uxp/components";

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}   
interface EmissionData {
    ScopeKey: string;
    ScopeName: string;
    CarbonEmission: string;  
}
interface AggregatedData {
    name: string;
    y: number; 
}
const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => { 

    const colorMap: { [key: string]: string } = {
        'Scope 1': '#537453',
        'Scope 2': '#486e76',
        'Scope 3': '#b98056',
      }; 

    useEffect(() => { 
        const BusinessUnitKey = "5";
        const StartYear = 2023;
        const StartMonth = 1;
        const EndYear = 2023;
        const EndMonth = 12;
 
        getScopeEmissionBreakdownData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
    }, []);  
   
    let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<EmissionData[]>([]);
    let [selectedScope, setSelectedScope] = useState<any>(null); // State for the clicked scope data
    let [isModalVisible, setModalVisible] = useState(false); // State to toggle the modal visibility
  
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
     
  const groupedScopeEmissionBreakdowndata = useMemo(() => {
      const groupedData = scopeEmissionBreakdowndata.reduce((acc: { [key: string]: number }, item) => {
          const scopeKey = item.ScopeKey;
          const carbonEmission = parseFloat(item.CarbonEmission) || 0;
  
          if (scopeKey && carbonEmission > 0) {
              if (acc[scopeKey]) {
                  acc[scopeKey] += carbonEmission;
              } else {
                  acc[scopeKey] = carbonEmission;
              }
          }
          return acc;
      }, {});
   
      return Object.keys(groupedData).map(scopeKey => ({
          name: `Scope ${scopeKey}`,
          y: parseFloat(groupedData[scopeKey].toFixed(2)),  
          color: colorMap[`Scope ${scopeKey}`]            
      }));
  }, [scopeEmissionBreakdowndata]); 
  const chartData = groupedScopeEmissionBreakdowndata; 

  // Bar chart options for the modal with horizontal bars
  const barChartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      inverted: true,  // To create horizontal bar chart
    },
    title: {
      text: selectedScope ? `Details for ${selectedScope.name}` : ''
    },
    xAxis: {
      categories: [selectedScope ? selectedScope.name : '']
    },
    yAxis: {
      title: {
        text: 'kgCO2e'
      }
    },
    series: [{
      name: selectedScope ? selectedScope.name : '',
      data: [selectedScope ? selectedScope.y : 0]
    }],
    credits: {
      enabled: false
    }
  }), [selectedScope]);
    
const scope_options = {
    
    chart: {
        type: "pie",
        height: "80%",
        margin: [20,10, 0, 10],
      },
    
    title: {
      text: "",
    },
    tooltip: { 
        pointFormat: "<b>{point.name}</b>: {point.y:.2f} kgCO2e"  
    },
    plotOptions: {
        pie: {
            innerSize: '60%',
            depth: 40,
            dataLabels: {
                enabled: true, 
                format: "{point.name}: {point.y:.2f} kgCO2e",
            },
            showInLegend: true,
            events: {
              click: (event: any) => {
                setSelectedScope(event.point); // Set selected scope
                setModalVisible(true); // Show modal on click
              }
            }
        }
    },
    legend: {
        enabled: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 1,
    },
    credits: {
        enabled: false,
      },
    series: [{
        name: 'Emissions',
        colorByPoint: true,
        data: chartData
    }]
}; 

    return (
        <WidgetWrapper>
            <TitleBar title='Test Emissions' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png" />
            <div style={{ display: "inline-flex", padding: "3em 3em" }}> 
                <HighchartsReact highcharts={Highcharts} options={scope_options} /> 
            </div>

            {/* Modal for Horizontal Bar Chart */}
            {isModalVisible && (
                <Modal show={isModalVisible} onClose={() => setModalVisible(false)} title="Scope Emission Details">
                  <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
                </Modal>
            )}
        </WidgetWrapper>
    );
};

export default Test_Emission;

