
import React, { useEffect, useState, useMemo  } from "react";
 

import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import {  AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { useToast, DataList, WidgetWrapper, Button, DynamicSelect, SearchBox, Modal, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
import { ResponsivePie } from '@nivo/pie'; 
import { ResponsiveSunburst } from "@nivo/sunburst";  


import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Sunburst from "highcharts/modules/sunburst";

import Accessibility from 'highcharts/modules/accessibility';

Accessibility(Highcharts); // Initialize the accessibility module



interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}   
// interface EmissionData {
//     Year: string;
//     Month: string;
//     MonthString: string;
//     ScopeKey: string;
//     ScopeName: string;
//     CarbonEmission: string;
// } 
interface EmissionData {
    [x: string]: any;
    ScopeKey: string;
    ScopeName: string;
    CarbonEmission: string; // This can also be a number if you always get numbers
 
}
interface ScopePopupData {
    MonthString: string;
    Scope1: number;
    Scope2: number;
    Scope3: number;
} 

interface IDataItem {
    name: string;
    value: number;
    color?: string;  
  }
  interface AggregatedData {
    name: string;
    y: number; // This will hold the aggregated carbon emissions
}


interface SeriesData {
    name: string;
    data: number[];
    color: string;
    visible: boolean; 
}

interface EmissionData1 {  
  ActivityCategoryTableKey: string;  
  ActivityCategorytableName: string;  
  ScopeKey: string;  
  ScopeName: string;  
  CarbonEmission: string;  
}  


const Emission_Overview: React.FunctionComponent<IWidgetProps> = (props) => { 

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

    let [scopedata, setScopeData] = useState<any[]>([]);  


    useEffect(() => {
        getScopeData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
        getScopeEmissionBreakdownData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
        getScopewisePopUpData(SubUnitFilter !== '0' ? SubUnitFilter : MainUnitFilter, startYear, startMonth, endYear, endMonth); // Correct function call
       // scopewisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
        getCategorywiseEmissionOverview(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
       // getcategorywisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);

        getCategorywisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
    },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 
 

    const colorMap: { [key: string]: string } = {
        'Scope 1': '#537453',
        'Scope 2': '#486e76',
        'Scope 3': '#b98056',
      };

  function getScopeData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
    props.uxpContext.executeAction(
      "OrganizationalEmissionOverview-Dataprovider",
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


  let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<EmissionData[]>([]);
  
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
  
// Group data and calculate total CarbonEmission for each Scope with rounding
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

    // Convert grouped data to chart format, round values, and apply colors
    return Object.keys(groupedData).map(scopeKey => ({
        name: `Scope ${scopeKey}`,
        y: parseFloat(groupedData[scopeKey].toFixed(2)),  // Round to 2 decimal places
        color: colorMap[`Scope ${scopeKey}`]            // Apply corresponding color
    }));
}, [scopeEmissionBreakdowndata]); 
const chartData = groupedScopeEmissionBreakdowndata; 
 


const formatCO2e = function () {
    return `${this.point.name}: ${(this.y || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} kgCO2e`;
  };

  

const scope_options = { 
    chart: {
      type: "pie",
      height: "78%",
      margin: [20, 10, 0, 10],
    },
    
    title: {
      text: "",
    },
  
    tooltip: { 
    //   formatter: function () {
    //     return `<b>${this.point.name}</b>: ${(this.y || 0).toLocaleString(undefined, {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2
    //     })} kgCO2e`;   
    //   }
    formatter: formatCO2e,  // Reuse the formatter function
    },
    
    plotOptions: {
      pie: {
        innerSize: '60%',
        depth: 40,
        dataLabels: {
          enabled: true,
        //   formatter: function () {
        //     return `${this.point.name}: ${(this.y || 0).toLocaleString(undefined, {
        //       minimumFractionDigits: 2,
        //       maximumFractionDigits: 2
        //     })} kgCO2e`;   
        //   },
        formatter: formatCO2e,  // Reuse the formatter function 


        },
        showInLegend: true
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

const [scopewisePopUpData, setScopewisePopUpData] = useState<EmissionData[]>([]);
 
const getScopewisePopUpData = (BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) => {
  props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetScopewiseEmissionBreakdownPopup", {
    BusinessUnitKey,
    StartYear,
    StartMonth,
    EndYear,
    EndMonth
  }, { json: true }).then(res => {
    setScopewisePopUpData(processScopeData(res));
  }).catch(e => {
    console.error("Error fetching data", e);
  });
}; 

const processScopeData = (data: EmissionData[]): EmissionData[] => {
    const groupedData: Record<string, { Scope1: number; Scope2: number; Scope3: number }> = {};

    data.forEach(item => {
        const month = item.MonthString;

        if (!groupedData[month]) {
            groupedData[month] = { Scope1: 0, Scope2: 0, Scope3: 0 };
        }

        const emission = parseFloat(item.CarbonEmission);
        if (item.ScopeKey === "1") {
            groupedData[month].Scope1 += emission;
        } else if (item.ScopeKey === "2") {
            groupedData[month].Scope2 += emission;
        } else if (item.ScopeKey === "3") {
            groupedData[month].Scope3 += emission;
        }
    });

    // Convert the grouped data back into an array of EmissionData
    return Object.keys(groupedData).map(month => ({
        Year: "",  // Add appropriate values if necessary
        Month: "", // Add appropriate values if necessary
        MonthString: month,
        ScopeKey: "",  // This can be left blank since we're aggregating
        ScopeName: "", // This can be left blank or set based on your logic
        CarbonEmission: (
            groupedData[month].Scope1 +
            groupedData[month].Scope2 +
            groupedData[month].Scope3
        ).toFixed(2), // Summing the emissions for each scope
        Scope1: groupedData[month].Scope1.toFixed(2),  // Store Scope 1
        Scope2: groupedData[month].Scope2.toFixed(2),  // Store Scope 2
        Scope3: groupedData[month].Scope3.toFixed(2)   // Store Scope 3
    })).filter(item => {
        // Filter out items with total emissions of 0
        return parseFloat(item.CarbonEmission) > 0;
    });
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Prepare categories and scope data, ensuring to filter out zero emissions
const filteredData = scopewisePopUpData.filter(data => parseFloat(data.CarbonEmission) > 0);

const categories = monthNames.filter((_, index) => 
    filteredData.some(data => new Date(Date.parse(data.MonthString + " 1")).getMonth() === index)
); // Get month names for only those months that have data

const scope1Data = monthNames.map((_, index) => {
    const dataForMonth = filteredData.find(data => new Date(Date.parse(data.MonthString + " 1")).getMonth() === index);
    return dataForMonth ? parseFloat(dataForMonth.Scope1) : 0;
}).filter(value => value > 0); // Filter out zero values

const scope2Data = monthNames.map((_, index) => {
    const dataForMonth = filteredData.find(data => new Date(Date.parse(data.MonthString + " 1")).getMonth() === index);
    return dataForMonth ? parseFloat(dataForMonth.Scope2) : 0;
}).filter(value => value > 0); // Filter out zero values

const scope3Data = monthNames.map((_, index) => {
    const dataForMonth = filteredData.find(data => new Date(Date.parse(data.MonthString + " 1")).getMonth() === index);
    return dataForMonth ? parseFloat(dataForMonth.Scope3) : 0;
}).filter(value => value > 0); // Filter out zero values


const chartScopeBarOptions = {
    chart: {
      type: 'column' // Use 'column' for vertical stacked bars
    },
    title: {
      text: 'Carbon Emissions by Scope'
    },
    xAxis: {
      categories: categories.length > 0 ? categories : ['No Data'], // Ensure there are categories to show
      title: {
        text: ""
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    // tooltip: {
    //   pointFormat: "<b>{series.name}</b>: {point.y:.2f} kgCO2e<br/>Total: {point.stackTotal:.2f} kgCO2e"
    // },

    tooltip: {
        formatter: function () {
            return `<b>${this.series.name}</b>: ${(this.y || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} kgCO2e`;  // Formatting tooltip value
        }
    }, 

    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${this.series.name}: ${(this.y || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} kgCO2e`; // Using toLocaleString for data labels
          }
        }
      }
    },
    series: [
      {
        name: 'Scope 1',
        data: scope1Data,
        color: '#4c6a48' // Color for Scope 1
      },
      {
        name: 'Scope 2',
        data: scope2Data,
        color: '#466f81' // Color for Scope 2
      },
      {
        name: 'Scope 3',
        data: scope3Data,
        color: '#b97244' // Color for Scope 3
      }
    ]
  };
  

   
let [selected, setSelected] = React.useState<string | null>("op-1");
let [selected1, setSelected1] = React.useState<string | null>("op-1");
let [selected2, setSelected2] = React.useState<string | null>("op-1");  

// categorywisedata//

let [showModal1, setShowModal1] = React.useState(false);
let [modelData1, setModelData1] = React.useState<any>(null); 
    
function handleClick1() {
    console.log("Button clicked");  
    setShowModal1(true);  
    setModelData1({}); 
}

const handleCloseModal1 = () => {
    setShowModal1(false);  
    setModelData1(null);  
};
 

let [categorywiseEmissionOverviewdata, setCategorywiseEmissionOverviewdata] = useState<any[]>([]);

// Fetch category-wise emission data
function getCategorywiseEmissionOverview(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
  props.uxpContext?.executeAction(
    "OrganizationalEmissionOverview-Dataprovider",
    "GetCategorywiseEmissionBreakdown",
    { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth },
    { json: true }
  )
  .then((res: any) => {
    console.log("response", res);
    setCategorywiseEmissionOverviewdata(res);
  })
  .catch((e: any) => {
    console.error("Error fetching scope data", e);
  });
}
  
  // Function to lighten a given color
  const lightenColor = (hex: string, percent: number): string => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
  
    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));
  
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  // Group data by scope and subcategories
  const groupedData = categorywiseEmissionOverviewdata.reduce((acc: any, item: any) => {
    const scopeIndex = acc.findIndex((scope: any) => scope.name === item.ScopeName);
    const emissionValue = Number(item.CarbonEmission) > 0 ? Number(item.CarbonEmission) : 0;
  
    if (scopeIndex !== -1) {
      // Add to existing scope
      acc[scopeIndex].children.push({
        name: item.ActivityCategorytableName,
        value: emissionValue,
        color: colorMap[item.ScopeName],  // Assign color based on ScopeName
      });
    } else {
      // Create new scope group
      acc.push({
        name: item.ScopeName,
        ScopeKey: item.ScopeKey,
        children: [
          {
            name: item.ActivityCategorytableName,
            value: emissionValue,
            color: lightenColor(colorMap[item.ScopeName], 0.3),  // Call lightenColor function
          },
        ],
      });
    }
  
    return acc;
  }, []);
  
 
  const innerSeriesData = groupedData.map((scope: any) => ({
    name: scope.name,
    y: scope.children.reduce((acc: any, child: any) => acc + child.value, 0),
    color: colorMap[scope.name],  
  }));
  
  const outerSeriesData = groupedData.reduce((acc: any, scope: any) => {
    const childrenCount = scope.children.length; 
  
    return acc.concat(
      scope.children.map((child: any, index: number) => {
        const lighteningFactor = (index / (childrenCount - 1)) * 0.5;  
        const childColor = lightenColor(colorMap[scope.name], lighteningFactor);  
        
        return {
          name: child.name,
          y: child.value,
          color: childColor, 
        };
      })
    );
  }, []);
  
 
  const CategorywiseValueZero = groupedData.every((scope: any) => 
    scope.children.every((child: any) => child.value === 0)
  ); 
 
  

  
  const cateMainOptions = {
    chart: {
      type: "pie",
      height: "50%",
      margin: [10, 10, 0, 10],
    },
    title: {
      text: "",
    },
    plotOptions: {
      pie: {
        innerSize: "40%",
        dataLabels: {
          enabled: true,
          formatter: formatCO2e,  // Reuse the formatter function
          filter: {
            property: 'y',
            operator: '>',
            value: 0,
          },
        },
      },
    },
    series: [
      {
        name: "Scopes",
        colorByPoint: false,
        size: '60%',
        data: innerSeriesData,
        dataLabels: {
          distance: -30,
          formatter: formatCO2e,  // Reuse the formatter function
        },
      },
      {
        name: "Subcategories",
        colorByPoint: false,
        innerSize: '60%',
        size: '95%',
        data: outerSeriesData,
        dataLabels: {
          distance: 10,
          formatter: formatCO2e,  // Reuse the formatter function
          filter: {
            property: 'y',
            operator: '>',
            value: 0,
          },
        },
      },
    ],
    tooltip: {
      formatter: function () {
        return `<b>${this.point.name}</b>: ${(this.y || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} kgCO2e`;
      },
    },
    credits: {
      enabled: false,
    },
  }; 
   
 
const [chartCategorywiseOptions, setChartCategorywiseOptions] = useState({});  
const [categorywisePopUpData, setCategorywisePopUpData] = useState<EmissionData1[]>([]); // State for fetched data 

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
      enabled: true
    },  
    credits: { enabled: false }, 
  });
}



 


    return (
        <WidgetWrapper>
            <TitleBar title='Organizational Carbon Emissions Overview' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
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
        <>
            {scopedata.map((scope, index) => (
                <div key={index} className={`scope-box ${getClassName(scope.ScopeKey)}`}>
                    <h4>{scope.ScopeName}</h4> 
                <h3>{Number(scope.CurrentEmission || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span>tCO<em>2</em>e</span></h3>  

                    <div className="scope-bottom">
                        <em>{scope.PrevEmission ? `${Number(scope.PrevEmission).toFixed(2)} %` : "0%"}</em>
                        <span className={`arrow ${scope.PrevEmission && parseFloat(scope.PrevEmission) > 0 ? 'up-arrow' : 'down-arrow'}`}></span>
                    </div>
                </div>
            ))}
 
            <div className="scope-box green_blue-scope-box">
                <h4>Scope 1 + 2</h4> 
                <h3>
                    {(Number(scopedata[0]?.CurrentEmission || 0) + Number(scopedata[1]?.CurrentEmission || 0))
                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                    <span> tCO<em>2</em>e</span>
                </h3>

                <div className="scope-bottom">
                    <em>{((Number(scopedata[0]?.PrevEmission || 0) + Number(scopedata[1]?.PrevEmission || 0)) || 0).toFixed(2)}%</em>
                        <span className={`arrow ${((Number(scopedata[0]?.PrevEmission || 0) + Number(scopedata[1]?.PrevEmission || 0)) > 0) ? 'up-arrow' : 'down-arrow'}`}></span>
                </div>
            </div>
 
            <div className="scope-box green_blue_orange-scope-box">
                <h4>Scope 1 + 2 + 3</h4> 
                <h3>
                    {(Number(scopedata[0]?.CurrentEmission || 0) + Number(scopedata[1]?.CurrentEmission || 0) + Number(scopedata[2]?.CurrentEmission || 0))
                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  
                        <span> tCO<em>2</em>e</span>
                </h3>

                <div className="scope-bottom">
                    <em>{((Number(scopedata[0]?.PrevEmission || 0) + Number(scopedata[1]?.PrevEmission || 0) + Number(scopedata[2]?.PrevEmission || 0)) || 0).toFixed(2)}%</em>
                    <span className={`arrow ${((Number(scopedata[0]?.PrevEmission || 0) + Number(scopedata[1]?.PrevEmission || 0) + Number(scopedata[2]?.PrevEmission || 0)) > 0) ? 'up-arrow' : 'down-arrow'}`}></span>
                </div>
            </div>
        </>
    ) : (
        <p>Loading data...</p>
    )}
</div>
 


                <div style={{display:"inline-flex", padding:"3em 3em"}}>

                    <div className="emi-breakdown" style={{display:"inline-block", width:"40%", height: "38em", margin:"0 1.5em 0 0"}}>  
                         

                <WidgetWrapper>
                        <TitleBar title='Scope-wise Total Emission Breakdown'>  
                        </TitleBar>

                        <div className="scopewise-chart">

                            <div className="chart">  
                              
                            <>
                                {groupedScopeEmissionBreakdowndata.length === 0 || groupedScopeEmissionBreakdowndata.every(item => item.y === 0) ? (
                                    <div style={{ textAlign: "center", padding: "30% 0" }}>
                                        <h3>No Data Available</h3>
                                    </div>
                                ) : (
                                    <>   
                                        <HighchartsReact highcharts={Highcharts} options={scope_options} />  

                                        <div className="view-more"> 
                                            <Button title="View More" onClick={handleClick} />
                                        </div>
                                    </>
                                )}
                            </>  

                            </div>  

                            
                           
 
                <Modal className="popup" title="Scope-Wise Operational Carbon Emissions Overview" show={showModal} onClose={handleCloseModal}>
                   
                    <div id="my_Popup">  

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

                                    <ResponsiveContainer width="100%" height={400}>  

                                        <HighchartsReact highcharts={Highcharts} options={chartScopeBarOptions} />

                                    </ResponsiveContainer>


                                </div>
                            </Modal>

                        </div>
                    </WidgetWrapper>
                        
                     </div>

                    <div className="emi-breakdown" style={{display:"inline-block", width:"60%", height: "38em", margin:"0 0 0 1.5em"}}>  
                      
                        {/* <Categorywise_Breakdown/> */}  

                   <WidgetWrapper>
                  
                    <TitleBar title='Category-wise Total Emission Breakdown'  /> 

                    <div className="scopewise-chart">
                        <div className="chart">  
 
                        {CategorywiseValueZero ? (
                            <h3 style={{textAlign:"center", padding:"23% 0px"}}>No Data Available</h3>
                        ) : (
                        <>
                            <HighchartsReact highcharts={Highcharts} options={cateMainOptions} />

                            <div className="view-more"> 
                                <Button title="View More" onClick={handleClick1} />
                            </div>
                         </>
                        )}

         
                        </div>  
                        
                      
        
                        <Modal className="popup"  title="Category-wise  operational carbon emissions overview" show={showModal1} onClose={handleCloseModal1}>
                            
                            <div id="my_Popup"> 

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
                                                
                                    <ResponsiveContainer width="100%" > 

                                    <HighchartsReact highcharts={Highcharts} options={chartCategorywiseOptions} />

                                     </ResponsiveContainer> 

                            </div>
                        </Modal> 

                    </div>
                </WidgetWrapper>  
                        
                  </div>  
                </div> 

        </WidgetWrapper>
    )
}; 

export default Emission_Overview;


  
 