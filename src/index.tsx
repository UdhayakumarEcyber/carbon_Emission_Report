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

import Emission_Calc_Report from './components/emissions_overview'; 
import Scopewise_Breakdown from './components/scopewise_breakdown'; 
import Categorywise_Breakdown from './components/categorywise_breakdown'; 
import Scope1_Breakdown from './components/scope1_breakdown'; 

import  Carbon_Detailed_Analysis from './components/carbon_detailed_analysis'; 

import Emissions_Category_Breakdown from './components/carbon_emissions_category_breakdown'

 
/**
 * Register as a Widget
 */
registerWidget({
    id: "emission_Calc_Report",
    widget: Emission_Calc_Report,
    configs: {
        layout: {
            w: 12,
            h: 21,
            minH: 21,
            minW: 12
        }
    }
});

registerWidget({
    id: "scopewise_Breakdown",
    widget: Scopewise_Breakdown,
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
    id: "categorywise_Breakdown",
    widget: Categorywise_Breakdown,
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
    id: "scope1_Breakdown",
    widget: Scope1_Breakdown,
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