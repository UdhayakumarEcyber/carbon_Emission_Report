import React, { useEffect, useState } from "react";  
import { IContextProvider } from '../uxp';  
import Highcharts from "highcharts";  
import HighchartsReact from "highcharts-react-official";  
import { WidgetWrapper, TitleBar } from "uxp/components";  

interface IWidgetProps {  
  uxpContext?: IContextProvider;  
}  

interface EmissionData1 {  
  ActivityCategoryTableKey: string;  
  ActivityCategorytableName: string;  
  ScopeKey: string;  
  ScopeName: string;  
  CarbonEmission: string;  
}  

const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => {   
  const [chartCategorywiseOptions, setChartCategorywiseOptions] = useState({});  
  const [categorywisePopUpData, setCategorywisePopUpData] = useState<EmissionData1[]>([]); // State for fetched data

  useEffect(() => {
    const BusinessUnitKey = "5";
    const StartYear = 2019;
    const StartMonth = 1;
    const EndYear = 2024;
    const EndMonth = 12;

    getCategorywisePopUpData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
  }, []);

  function getCategorywisePopUpData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
    props.uxpContext.executeAction(
      "OrganizationalEmissionOverview-Dataprovider",
      "GetCategorywiseEmissionOverview",
      {
        BusinessUnitKey,
        StartYear,
        StartMonth,
        EndYear,
        EndMonth
      },
      { json: true }
    )
    .then((res: EmissionData1[]) => {
      setCategorywisePopUpData(res); // Store fetched data in state
      updateChart(res); // Update the chart with fetched data
    })
    .catch(e => {
      console.error("Error fetching data:", e);
    });
  }

  function updateChart(data: EmissionData1[]) {
    const scopeData = data.reduce((acc: { [key: string]: any }, current) => {   
      const carbonEmissionValue = parseFloat(current.CarbonEmission); 
      // Filter out values less than or equal to 0.01
      if (carbonEmissionValue > 0.01) {  
        if (!acc[current.ScopeKey]) {   
          acc[current.ScopeKey] = {   
            name: current.ScopeName,   
            data: []   
          };   
        }   
        acc[current.ScopeKey].data.push({  
          name: current.ActivityCategorytableName,  
          y: carbonEmissionValue  
        });   
      }   
      return acc;   
    }, {});   
      
    const seriesData = Object.values(scopeData).map(scope => ({   
      name: scope.name,   
      data: scope.data,  
      color: getScopeColor(scope.name)  
    }));  

    function getScopeColor(scopeName: string) {  
      switch (scopeName) {  
        case 'Scope 1':  
          return '#4c6a48';  
        case 'Scope 2':  
          return '#466f81';  
        case 'Scope 3':  
          return '#b97244';  
        default:  
          return 'gray';  
      }  
    }

    setChartCategorywiseOptions({  
      chart: {   
        type: 'column'   
      },   
      title: {   
        text: ''   
      },   
      xAxis: {   
        type: 'category',  
        title: {  
          text: ''  
        }  
      },   
      yAxis: {   
        title: {   
          text: 'Carbon Emissions (kgCO2e)'   
        }   
      },  
      series: seriesData.map(scope => ({ 
        ...scope, 
        data: scope.data.map((point: { name: any; y: any; }) => ({ 
          name: point.name, 
          y: point.y, 
          dataLabels: { 
            enabled: true, 
            format: '{point.y:,.2f} kgCO2e'  // Format for data labels with commas and two decimal points
          } 
        })), 
        tooltip: {  // Tooltip formatting
          pointFormat: '<b>{point.y:,.2f} kgCO2e</b>' // Format for tooltip with commas and two decimal points
        }
      })), 
      legend: {
        align: 'left',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        x: 0,
        y: 0
      },  
      credits: { enabled: false }, 
    });
  }
  
  return (  
    <WidgetWrapper>  
      <TitleBar title='Test Emissions' />  
      <div style={{ width: "96%", padding: "2em 2%" }}>  
        <HighchartsReact  
          highcharts={Highcharts}  
          options={chartCategorywiseOptions}  
        />  
      </div>  
    </WidgetWrapper>  
  );  
};  

export default Test_Emission;  















// import React, { useEffect, useState } from "react";
// import { IContextProvider } from '../uxp';
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { WidgetWrapper, TitleBar } from "uxp/components";

// interface IWidgetProps {
//   uxpContext?: IContextProvider;
// }

// interface EmissionData1 {
//   ActivityCategorytableName: string;
//   ScopeKey: string;
//   ScopeName: string;
//   CarbonEmission: string;
// }

// const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => {
//   const [categorywisePopUpData, setCategorywisePopUpData] = useState<EmissionData1[]>([]);
//   const [selectedScope, setSelectedScope] = useState<string>("all");

//   useEffect(() => {
//     const BusinessUnitKey = "5";
//     const StartYear = 2019;
//     const StartMonth = 1;
//     const EndYear = 2024;
//     const EndMonth = 12;

//     getCategorywisePopUpData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
//   }, []);

//   function getCategorywisePopUpData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
//     props.uxpContext.executeAction(
//       "OrganizationalEmissionOverview-Dataprovider",
//       "GetCategorywiseEmissionOverview",
//       {
//         BusinessUnitKey,
//         StartYear,
//         StartMonth,
//         EndYear,
//         EndMonth
//       },
//       { json: true }
//     )
//       .then((res: EmissionData1[]) => {
//         setCategorywisePopUpData(res);
//       })
//       .catch(e => {
//         console.error("Error fetching data:", e);
//       });
//   }

//   // Filter data based on selected scope
//   const filteredData = selectedScope === "all" 
//     ? categorywisePopUpData 
//     : categorywisePopUpData.filter(item => item.ScopeKey === selectedScope);

//   // Group emissions by Activity Category
//   const groupedCategoryData = filteredData.reduce<Record<string, { categories: string[], data: number[] }>>((acc, item) => {
//     const emissionValue = parseFloat(item.CarbonEmission);
//     if (emissionValue > 0.01) {
//       if (!acc[item.ActivityCategorytableName]) {
//         acc[item.ActivityCategorytableName] = { categories: [], data: [] };
//       }
//       acc[item.ActivityCategorytableName].categories.push(item.ScopeName);
//       acc[item.ActivityCategorytableName].data.push(emissionValue);
//     }
//     return acc;
//   }, {});

//   // Prepare series data for the chart
//   const seriesData = Object.entries(groupedCategoryData).map(([category, values]) => {
//     return {
//       name: category,
//       data: values.data,
//       color: '#7cb5ec', // You can adjust the color based on your needs
//       visible: true // Always visible, or conditionally based on selectedScope
//     };
//   });

//   // Chart options
//   const chartOptions = {
//     chart: {
//       type: 'column'
//     }, 
//     title: {
//       text: 'Carbon Emissions by Activity Category'
//     },
//     xAxis: {
//       categories: Object.keys(groupedCategoryData), // Activity Categories
//       title: { text: 'Activity Category' },
//       crosshair: true,
//     },
//     yAxis: {
//       min: 0,
//       title: { text: 'Carbon Emissions (kgCO2e)' },
//       labels: { format: '{value} kgCO2e' }
//     },
//     series: seriesData,
//     plotOptions: {
//       column: {
//           dataLabels: {
//               enabled: true,
//               formatter: function () {
//                   if (this.y > 0) {
//                       return `${this.y.toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                       })} kgCO2e`;
//                   }
//                   return null;
//               }
//           },
//           pointPadding: 0.2,
//           borderWidth: 0
//       }
//     },
//     tooltip: {
//       shared: true, // Enables scope-wise display
//       formatter: function () {
//         let tooltipText = `<b>${this.x}</b><br/>`; // X-axis category (activity category)
//         this.points.forEach(function (point:any) {
//           if (point.y > 0) {
//             tooltipText += `<b>${point.series.name}</b>: ${point.y.toFixed(2)} kgCO2e<br/>`; // Each scope's emission value
//           }
//         });
//         return tooltipText;
//       }
//     },
//     legend: {
//       align: 'left',
//       verticalAlign: 'bottom',
//       layout: 'horizontal',
//       x: 0,
//       y: 0
//     },
//     credits: { enabled: false }
//   };

//   return (
//     <WidgetWrapper>
//       <TitleBar title='Test Emissions' />
//       <div style={{ width: "96%", padding: "2em 2%" }}>
//         <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Test_Emission;


 














// import React, { useEffect, useState } from "react";
// import { IContextProvider } from '../uxp';
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { WidgetWrapper, TitleBar, Select } from "uxp/components";

// interface IWidgetProps {
//   uxpContext?: IContextProvider,
//   instanceId?: string
// }

// interface EmissionData1 {
//   ActivityCategoryTableKey: string;
//   ActivityCategorytableName: string;
//   ScopeKey: string;
//   ScopeName: string;
//   CarbonEmission: string;
// }

// const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => {
//   const [categorywisePopUpData, setCategorywisePopUpData] = useState<EmissionData1[]>([]);
//   const [selectedScope, setSelectedScope] = useState<string>("1");

//   useEffect(() => {
//     const BusinessUnitKey = "5";
//     const StartYear = 2019;
//     const StartMonth = 1;
//     const EndYear = 2024;
//     const EndMonth = 12;

//     getCategorywisePopUpData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
//   }, []);

//   function getCategorywisePopUpData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
//     props.uxpContext.executeAction(
//       "OrganizationalEmissionOverview-Dataprovider",
//       "GetCategorywiseEmissionOverview",
//       {
//         BusinessUnitKey,
//         StartYear,
//         StartMonth,
//         EndYear,
//         EndMonth
//       },
//       { json: true }
//     )
//       .then((res: EmissionData1[]) => {
//         console.log("data", res);
//         setCategorywisePopUpData(res);
//       })
//       .catch(e => {
//         console.log("error", e);
//       });
//   }

//   // Filter data based on selected scope
//   const filteredData = categorywisePopUpData.filter(item => item.ScopeKey === selectedScope);

//   const groupedCategoryData = filteredData.reduce<Record<string, { categories: string[], data: number[], name: string }>>((acc, item) => {
//     const scopeKey = item.ScopeKey;
//     const emissionValue = parseFloat(item.CarbonEmission);

//     if (emissionValue > 0.01) { // Only include values greater than 0.00
//       if (!acc[scopeKey]) {
//         acc[scopeKey] = {
//           name: item.ScopeName,
//           categories: [],
//           data: []
//         };
//       }
//       acc[scopeKey].categories.push(item.ActivityCategorytableName);
//       acc[scopeKey].data.push(emissionValue);
//     }
//     return acc;
//   }, {});

//   const filteredCategories = Object.values(groupedCategoryData).flatMap(scope => scope.categories);
//   const uniqueCategories = [...new Set(filteredCategories)];

//   const seriesData = Object.values(groupedCategoryData).map(scope => {
//     const emissionsData = uniqueCategories.map(category => {
//       const index = scope.categories.indexOf(category);
//       return index !== -1 ? scope.data[index] : null; // Only include categories with non-zero data
//     }).filter(val => val !== null); // Remove null values (i.e., 0 values)
//     return {
//       name: scope.name,
//       data: emissionsData,
//       color: scope.name === "Scope 1" ? "#4c6a48" : scope.name === "Scope 2" ? "#466f81" : "#b97244"
//     };
//   });

//   const chartCategorywiseOptions = {
//     chart: {
//       type: 'column'
//     },
//     title: {
//       text: ''
//     },
//     xAxis: {
//       categories: uniqueCategories,
//       title: {
//         text: 'Emissions'
//       },
//       accessibility: {
//         description: 'Emissions'
//       },
//       crosshair: true,
//     },
//     yAxis: {
//       min: 0,
//       title: {
//         text: 'Carbon Emissions (kgCO2e)'
//       },
//       labels: {
//         format: '{value} kgCO2e'
//       }
//     },
//     series: seriesData,
//     legend: {
//       enabled: true
//     },
//     plotOptions: {
//       column: {
//         dataLabels: {
//           enabled: true,
//           formatter: function () {
//             if (this.y > 0) {
//               return `${this.y.toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//               })} kgCO2e`;
//             }
//             return null;
//           }
//         },
//         pointPadding: 0.2,
//         borderWidth: 0
//       }
//     },
//     tooltip: {
//       formatter: function () {
//         if (this.y > 0) {
//           return `<b>${this.series.name}</b>: ${this.y.toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//           })} kgCO2e`;
//         }
//         return false;
//       }
//     },
//     credits: {
//       enabled: false
//     }
//   };

//   return (
//     <WidgetWrapper>

//             <TitleBar title='Test Emissions'>

//                   <div className="top-filter">

//                     <select value={selectedScope} onChange={(e) => setSelectedScope(e.target.value)}>
//                         <option value="1">Scope 1</option>
//                         <option value="2">Scope 2</option>
//                         <option value="3">Scope 3</option>
//                     </select> 
                              
//                 </div>
//             </TitleBar> 

//               <div style={{ display: "inline-block", width: "96%", padding: "2em 2%" }}>
                
//                     <HighchartsReact highcharts={Highcharts} options={chartCategorywiseOptions} />

//               </div>

//      </WidgetWrapper>
//   );
// };

// export default Test_Emission;










// import React, { useEffect, useState } from "react";
// import { IContextProvider } from '../uxp';
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { WidgetWrapper, TitleBar } from "uxp/components";

// interface IWidgetProps {
//   uxpContext?: IContextProvider,
//   instanceId?: string
// }

// interface EmissionData1 {
//   ActivityCategoryTableKey: string;
//   ActivityCategorytableName: string;
//   ScopeKey: string;
//   ScopeName: string;
//   CarbonEmission: string;
// }

// const Test_Emission: React.FunctionComponent<IWidgetProps> = (props) => {
//   const [categorywisePopUpData, setCategorywisePopUpData] = useState<EmissionData1[]>([]);

//   useEffect(() => {
//     const BusinessUnitKey = "5";
//     const StartYear = 2019;
//     const StartMonth = 1;
//     const EndYear = 2024;
//     const EndMonth = 12;

//     getCategorywisePopUpData(BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth);
//   }, []);

//   function getCategorywisePopUpData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
//     props.uxpContext.executeAction(
//       "OrganizationalEmissionOverview-Dataprovider",
//       "GetCategorywiseEmissionOverview",
//       {
//         BusinessUnitKey,
//         StartYear,
//         StartMonth,
//         EndYear,
//         EndMonth
//       },
//       { json: true }
//     )
//       .then((res: EmissionData1[]) => {
//         console.log("data", res);
//         setCategorywisePopUpData(res);
//       })
//       .catch(e => {
//         console.log("error", e);
//       });
//   }

//   const groupedCategoryData = categorywisePopUpData.reduce<Record<string, { categories: string[], data: number[], name: string }>>((acc, item) => {
//     const scopeKey = item.ScopeKey;
//     const emissionValue = parseFloat(item.CarbonEmission);

//     if (emissionValue !== 0) {
//       if (!acc[scopeKey]) {
//         acc[scopeKey] = {
//           name: item.ScopeName,
//           categories: [],
//           data: []
//         };
//       }
//       acc[scopeKey].categories.push(item.ActivityCategorytableName);
//       acc[scopeKey].data.push(emissionValue);
//     }
//     return acc;
//   }, {});

//   const filteredCategories = Object.values(groupedCategoryData).flatMap(scope => scope.categories);
//   const uniqueCategories = [...new Set(filteredCategories)];

//   const seriesData = Object.values(groupedCategoryData).map(scope => {
//     const emissionsData = uniqueCategories.map(category => {
//       const index = scope.categories.indexOf(category);
//       return index !== -1 ? scope.data[index] : 0; // Include categories, use 0 if no data
//     });
//     return {
//       name: scope.name,
//       data: emissionsData,
//       color: scope.name === "Scope 1" ? "#4c6a48" : scope.name === "Scope 2" ? "#466f81" : "#b97244"
//     };
//   });

//   const chartCategorywiseOptions = {
//     chart: {
//       type: 'column'
//     },
//     title: {
//       text: 'Carbon Emissions by Category'
//     },
//     xAxis: {
//       categories: uniqueCategories,
//       title: {
//         text: 'Emissions'
//       },
//       accessibility: {
//         description: 'Emissions'
//       },
//       crosshair: true,
//     },
//     yAxis: {
//       min: 0,
//       title: {
//         text: 'Carbon Emissions (kgCO2e)'
//       },
//       labels: {
//         format: '{value} kgCO2e'
//       }
//     },
//     series: seriesData, // Initially show all data
//     legend: {
//       enabled: true,
//       itemClick: function (event: any) {
//         const series = event.target;
//         if (series.visible) {
//           series.hide(); // Hide the series if it is currently visible
//         } else {
//           series.show(); // Show the series if it is currently hidden
//         }
//         return false; // Prevent default legend click behavior
//       }
//     },
//     plotOptions: {
//       column: {
//         dataLabels: {
//           enabled: true,
//           formatter: function () {
//             if (this.y > 0) {
//               return `${this.y.toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//               })} kgCO2e`;
//             }
//             return null;
//           }
//         },
//         pointPadding: 0.2,
//         borderWidth: 0
//       }
//     },
//     tooltip: {
//       formatter: function () {
//         if (this.y > 0) {
//           return `<b>${this.series.name}</b>: ${this.y.toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//           })} kgCO2e`;
//         }
//         return false;
//       }
//     },
//     credits: {
//       enabled: false
//     }
//   };

//   return (
//     <WidgetWrapper>
//       <TitleBar title='Test Emissions' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png" />
//       <div style={{ display: "inline-block", width: "96%", padding: "2em 2%" }}>
//         <HighchartsReact highcharts={Highcharts} options={chartCategorywiseOptions} />
//       </div>
//     </WidgetWrapper>
//   );
// };

// export default Test_Emission;
