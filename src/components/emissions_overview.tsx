import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 


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



        </WidgetWrapper>
    )
};
 

export default Emission_Calc_Report;