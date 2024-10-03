import React, { useState } from "react";
 

import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 

import Scopewise_Breakdown from './scopewise_breakdown'; 
import Categorywise_Breakdown from './categorywise_breakdown'; 
  
interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Emission_Calc_Report: React.FunctionComponent<IWidgetProps> = (props) => {

    const org_overview = {
        "scopeName": "Scope 1" 
      };  
 
    //   let [selectedOption, setSelectedOption] = React.useState<string>(null);
    //   let options = [
    //     {label: "Sri Lanka", value: "SL"},
    //     {label: "India", value: "IN"},
    //     {label: "United State", value: "US"},
    // ] 

    
    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1");
    
    // let [startDate, setStartDate] = React.useState<string | Date>(new Date()); 
    // let [endDate, setEndDate] = React.useState<string | Date>(addDays(90));   
 
    // let date = new Date(); 
    // date.setDate(date.getDate() + 1);
    
    // function addDays(days: number) { 
    //     var result = new Date();
    //     result.setDate(result.getDate() + days);
    //     return result;
    // } 


    const [startYear, setStartYear] = useState(2024);
    const [startMonth, setStartMonth] = useState("January");
    const [endYear, setEndYear] = useState(2024);
    const [endMonth, setEndMonth] = useState("February");

    // const years = Array.from({ length: 100 }, (v, k) => k + 2020); // Generates years from 2020 to 2029
    // const years = Array.from({ length: 2101 - 1980 }, (v, k) => k + 1980);
    const years = Array.from({ length: 2040 - 2024 }, (v, k) => k + 2024);

    // const months = [
    //     "January", "February", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"
    // ];

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];



    

    let [scopedata,setScopeData] = React.useState<any>([]) 
    function getData (BusinessUnitKey:number,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number) {  
        props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider","GetScopewiseOverview",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
            console.log("red",res);
            setScopeData(res);
        }).catch(e=>{
            // console.log("hi", e);
        }); 
    } 

    // let scopedata = [
    //     {
    //         "ScopeKey": "3",
    //         "CurrentEmission": "387526.79681396484",
    //         "PrevEmission": ""
    //     }
    // ]



    return (
        <WidgetWrapper>
            <TitleBar title='Organizational Carbon Emissions Overview' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
                            <div className="top-filter">
                                <div className="select-filter"> 
                                {/* <Select 
                                            options={options}
                                            selected={selectedOption}
                                            onChange={(newValue, option) => {
                                                setSelectedOption(newValue)
                                                
                                            }}
                                        /> */} 
                                        
                                    {/* <FormField className="no-padding mb-only">
                                        
                                        <DateRangePicker title=""
                                            startDate={startDate}
                                            endDate={endDate}
                                            closeOnSelect
                                            onChange={(newStart, newEnd) => { setStartDate(newStart); setEndDate(newEnd)}}
                                        /> 
                                    </FormField> */}


                                        <div className="uxp-emi-dropdown"> 
                                                                                
                                            <div className="uxp-emi-select-sec no-padding mb-only">
                                               
                                                <select className="select-box" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                                                    {years.map(year => <option key={year} value={year} style={{padding: '10px'}} >{year}</option>)}
                                                </select>

                                                <select className="select-box" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                                                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                                                </select>

                                            </div> 

                                            <label>To</label>

                                            <div className="uxp-emi-select-sec no-padding mb-only">
                                              
                                              
                                                <select className="select-box" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
                                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                                </select>

                                                <select className="select-box" value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                                                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                                                </select>

                                           </div>  
                                     
                                        </div>
                                        

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


                {/* <div className="scope-overall"> 

                    <div className="scope-box green-scope-box">  
                        <h4>{scopedata.ScopeKey}</h4> 
                        <h3>{scopedata.CurrentEmission} tCO<em>2</em>e</h3>  
                        <div className="scope-bottom"> 
                              <em>{scopedata.PrevEmission} %</em><span className="arrow up-arrow"></span>
                        </div>
                    </div>

                     <div className="scope-box blue-scope-box">  
                        <h4>{scopedata.ScopeKey}</h4> 
                        <h3>{scopedata.CurrentEmission} tCO<em>2</em>e</h3>  
                        <div className="scope-bottom">
                            <em>{scopedata?.PrevEmission === 0 } %</em><span className="arrow down-arrow"></span>
                        </div>
                    </div>
                    
                    <div className="scope-box orange-scope-box">  
                    <h4>{scopedata.ScopeKey}</h4> 
                    <h3>{scopedata.CurrentEmission} tCO<em>2</em>e</h3> 
                        <div className="scope-bottom">
                            <em>{scopedata?.PrevEmission === 0 } %</em><span className="arrow down-arrow"></span>
                        </div>
                    </div>

                    <div className="scope-box green_blue-scope-box">  
                    <h4>{scopedata.ScopeKey}</h4> 
                    <h3>{scopedata.CurrentEmission} tCO<em>2</em>e</h3> 
                        <div className="scope-bottom">
                            <em>{scopedata?.PrevEmission === 0 } %</em><span className="arrow down-arrow"></span>
                        </div>
                    </div>

                    <div className="scope-box green_blue_orange-scope-box">  
                    <h4>{scopedata.ScopeKey}</h4> 
                    <h3>{scopedata.CurrentEmission} tCO<em>2</em>e</h3> 
                        <div className="scope-bottom">
                            <em>{scopedata?.PrevEmission === 0 } %</em><span className="arrow down-arrow"></span>
                        </div>
                    </div>   

                </div> */}


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

                    <div className="scope-box green_blue-scope-box">  
                        <h4>{org_overview.scopeName} + 2</h4> 
                        <h3>453 tCO<em>2</em> e</h3>  
                        <div className="scope-bottom">
                            <em>23.1 %</em><span className="arrow down-arrow"></span>
                        </div>
                    </div>

                    <div className="scope-box green_blue_orange-scope-box">  
                        <h4>{org_overview.scopeName} + 2 + 3</h4> 
                        <h3>453 tCO<em>2</em> e</h3>  
                        <div className="scope-bottom">
                            <em>23.1 %</em><span className="arrow down-arrow"></span>
                        </div>
                    </div>


                </div>


                <div style={{display:"inline-flex", padding:"3em 3em"}}>

                    <div style={{display:"inline-block", width:"50%", height: "42em", margin:"0 1.5em 0 0"}}> <Scopewise_Breakdown/> </div>

                    <div style={{display:"inline-block", width:"50%", height: "42em", margin:"0 0 0 1.5em"}}> <Categorywise_Breakdown/> </div> 

                </div>

                


        </WidgetWrapper>
    )
};
 

export default Emission_Calc_Report;


 