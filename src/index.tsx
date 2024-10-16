import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from './uxp';
// import { TitleBar, FilterPanel, WidgetWrapper } from "uxp/components";
import './styles.scss';  

import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
  
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
   

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

import Emission_Overview from './components/emissions_overview';   
import Carbon_Detailed_Analysis from './components/carbon_detailed_analysis';  
import Emissions_Category_Breakdown from './components/carbon_emissions_category_breakdown'
import Emissions_Ranking from './components/carbon_emissions_ranking' 
import Resource_Consumption_Overview from './components/resource_consumption_overview'

import Carbon_Trends_Overview from './components/carbon_trends_overview'
import Business_Level_Carbon_Trends_Overview from './components/business-level-carbon-trends-overview'
import Business_Level_Carbon_Emissions_Overview from './components/business-level-carbon-emissions-overview'


import Test_Emission from './components/test_emission'

//Test
// import Test from './components/test'


 
/**
 * Register as a Widget
 */
 
 
registerWidget({
    id: "emission_Overview",
    widget: Emission_Overview,
    configs: {
        layout: {
            w: 26,
            h: 18,
            minH: 12,
            minW: 12
        }
    }
});
 

registerWidget({
    id: "carbon_Detailed_Analysis",
    widget: Carbon_Detailed_Analysis,
    configs: {
        layout: {
            // w: 12,
            // h: 12,
            // minH: 12,
            // minW: 12
        }
    }
});

registerWidget({
    id: "emissions_Category_Breakdown",
    widget: Emissions_Category_Breakdown,
    configs: {
        layout: {
            // w: 12,
            // h: 12,
            // minH: 12,
            // minW: 12
        }
    }
});

registerWidget({
    id: "emissions_Ranking",
    widget: Emissions_Ranking,
    configs: {
        layout: {
            // w: 12,
            // h: 12,
            // minH: 12,
            // minW: 12
        }
    }
});



registerWidget({
    id: "resource_Consumption_Overview",
    widget: Resource_Consumption_Overview,
    configs: {
        layout: {
            w: 30,
            h: 18,
            // minH: 12,
            // minW: 12
        }
    }
});


registerWidget({
    id: "carbon_Trends_Overview",
    widget: Carbon_Trends_Overview,
    configs: {
        layout: {
            w: 30,
            h: 18,
            // minH: 12,
            // minW: 12
        }
    }
});



registerWidget({
    id: "business_Level_Carbon_Trends_Overview",
    widget: Business_Level_Carbon_Trends_Overview,
    configs: {
        layout: {
            w: 30,
            h: 18,
            // minH: 12,
            // minW: 12
        }
    }
});



registerWidget({
    id: "test_Emission",
    widget: Test_Emission,
    configs: {
        layout: {
            w: 30,
            h: 18,
            // minH: 12,
            // minW: 12
        }
    }
});



/**
 * Register as a Sidebar Link
 */
/*
registerLink({
    id: "Carbon_Emission_Calc_Report",
    label: "Carbon_Emission_Calc_Report",
    // click: () => alert("Hello"),
    component: Carbon_Emission_Calc_ReportWidget
});
*/

/**
 * Register as a UI
 */

 /*
registerUI({
    id:"Carbon_Emission_Calc_Report",
    component: Carbon_Emission_Calc_ReportWidget
});
*/