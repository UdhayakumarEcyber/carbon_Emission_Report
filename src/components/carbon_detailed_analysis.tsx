import React, { useState } from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
  
interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Organizational_Carbon_Detailed_Analysis: React.FunctionComponent<IWidgetProps> = (props) => {

    const org_overview = {
        "scopeName": "Scope 1" 
      };   

    
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

    let Detailed_Analysis_Green_Data =  [
        {"AnalysisName":"Stationary Combustion", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn", "AnalysisValue":23.1},
        {"AnalysisName":"Fugitive Emission-Refrigerant", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
        {"AnalysisName":"Fugitive Emission-Fire Suppressant", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_greenbtn","AnalysisValue":23.1},
        {"AnalysisName":"Fugitive Emission-Electrical Insulating Gas", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
        {"AnalysisName":"Fugitive Emission-Anesthetic Gas", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_yellowbtn","AnalysisValue":23.1},
        {"AnalysisName":"Fugitive Emission-Waste Water Treatment", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1}
    ];

    let Detailed_Analysis_Blue_Data =  [
        {"AnalysisName":"Electricity Purchased - Location based", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn", "AnalysisValue":23.1},
        {"AnalysisName":"Electricity Purchased - Market based", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
        {"AnalysisName":"Electricity Solid", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_greenbtn","AnalysisValue":23.1} 
    ] 
 
    let Detailed_Analysis_Orange_Data =  [
        {"AnalysisName":"Category 1 - Purchased Goods & Services", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn", "AnalysisValue":23.1},
        {"AnalysisName":"Category 2 - Capital Goods", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
        {"AnalysisName":"Category 3 - Fuel & Energy Related Emissions", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_greenbtn","AnalysisValue":23.1},
        {"AnalysisName":"Category 4 - Upstream Transportation", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
        {"AnalysisName":"Category 5 - Waste Generated in Operations", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_yellowbtn","AnalysisValue":23.1},
        {"AnalysisName":"Category 6 - Business Travels", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1}
    ];

    function parseDate(date:string){ 
        var currentTime = new Date(date);  
        var month = ("0" + (currentTime.getMonth() + 1)).slice(-2); 
        var day = ("0" + currentTime.getDate()).slice(-2);
        var year = currentTime.getFullYear();
        var formatedate = year + '-' + month + '-' + day; 
        return formatedate;
    }



    
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



    return (
        <WidgetWrapper>
            <TitleBar title='Organizational Carbon Detailed Analysis' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
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


                <div className="assets-widget-list">

                    <div className="list-top-filter"> 

                        <FilterPanel> 
                            <Select
                                selected={selected3}
                                options={[
                                    { label: "RE-CD ", value: "op-1" },
                                    { label: "RE-TH", value: "op-2" },
                                    { label: "RE-SDH", value: "op-3" },
                                ]}
                                onChange={(value) => { setSelected2(value) }}
                                placeholder=" -- select --"
                                isValid={selected3 ? selected3?.length > 0 : null}
                            /> 
                        </FilterPanel>

                    </div>



                    <div className="item-list green-item-list">  
                        <ul>
                            {Detailed_Analysis_Green_Data.map((item:any) => (  
                                <li key={item.AssetID}> 
                                <a href={URL + item.AssetKey} target="_blank">
                                        <label>{item.AnalysisName}</label>  

                                        <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

                                        <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                    </a>  
                                </li>
                            ))}
                        </ul> 
                    </div>


                    <div className="item-list blue-item-list">  
                        <ul>
                            {Detailed_Analysis_Blue_Data.map((item:any) => (  
                                <li key={item.AssetID}> 
                                <a href={URL + item.AssetKey} target="_blank">
                                        <label>{item.AnalysisName}</label>  

                                        <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

                                        <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                    </a>  
                                </li>
                            ))}
                        </ul> 
                    </div>


                    <div className="item-list orange-item-list">  
                        <ul>
                            {Detailed_Analysis_Orange_Data.map((item:any) => (  
                                <li key={item.AssetID}> 
                                <a href={URL + item.AssetKey} target="_blank">
                                        <label>{item.AnalysisName}</label>  

                                        <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

                                        <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                        
                                    </a>  
                                </li>
                            ))}
                        </ul> 
                    </div> 
 
                    
                </div>

                


        </WidgetWrapper>
    )
};
 

export default Organizational_Carbon_Detailed_Analysis;


 