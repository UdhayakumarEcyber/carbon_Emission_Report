

import React, { useEffect, useState, useMemo  } from "react"; 

import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import {  AreaChart, Area, ResponsiveContainer,Scatter, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,PieChart, Pie  } from 'recharts';
import { useToast, DataList, WidgetWrapper, Button, DynamicSelect, SearchBox, Modal, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
import { ResponsivePie } from '@nivo/pie';  


interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}    
interface ScopePopupData {
    MonthString: string;
    Scope1: number;
    Scope2: number;
    Scope3: number;
}  

const Carbon_Trends_Overview: React.FunctionComponent<IWidgetProps> = (props) => { 

let toast = useToast();
 
    let [ClientFilter,setClientFilter] =  React.useState<string>('0');
    let [MainUnitFilter,setMainUnitFilter] =  React.useState<string>('0');
    let [SubUnitFilter,setSubUnitFilter] =  React.useState<string>('0');

let [ClientFilterList,setClientFilterList] =  React.useState<any[]>([]);
    let [MainUnitFilterList,setMainUnitFilterList] =  React.useState<any[]>([]);
    let [SubUnitFilterList,setSubUnitFilterList] =  React.useState<any[]>([]); 


    let [autoClose, setAutoClose] = React.useState(true);

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
    
    useEffect(() => { 
       // getScopeEmissionBreakdownData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter);
       // getScopewisePopUpData(SubUnitFilter !== '0' ? SubUnitFilter : MainUnitFilter, startYear, startMonth, endYear, endMonth); // Correct function call
       // scopewisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
       // getCategorywiseEmissionOverview(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
       // getcategorywisePopUpData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
    },[SubUnitFilter,MainUnitFilter ]) 
  
 
  let [scopeEmissionBreakdowndata, setScopeEmissionBreakdowndata] = useState<any[]>([]); // Initialized as an empty array since the data is an array

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
   
    let [selected, setSelected] = React.useState<string | null>("op-1"); 
    
  
let [categorywisePopUpData,setCategorywisePopUpData] = React.useState<any>([]) 
function getcategorywisePopUpData (BusinessUnitKey:string,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number) {  
    props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider","GetCategorywiseEmissionBreakdown",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
        console.log("data",res);
        setCategorywisePopUpData(res);
    }).catch(e=>{
        // console.log("hi", e);
    }); 
} 
  
 
const consumptionCompositionData = [
    { 
      "years": 2021,
      "Scope 1": 4000,
      "Scope 2": 2400,
      "Scope 3": 2400,
      "Baseline": 587,
      "Carbon Reduction Goals": 758,
      "Trend Forecast": 368
    },
    { 
      "years": 2022,
      "Scope 1": 3000,
      "Scope 2": 1398,
      "Scope 3": 2210,
      "Baseline": 2543,
      "Carbon Reduction Goals": 254,
      "Trend Forecast": 457
    },
    { 
      "years": 2023,
      "Scope 1": 2000,
      "Scope 2": 9800,
      "Scope 3": 2290,
      "Baseline": 1570,
      "Carbon Reduction Goals": 758,
      "Trend Forecast": 498
    },
    { 
      "years": 2024,
      "Scope 1": 2780,
      "Scope 2": 3908,
      "Scope 3": 2000,
      "Baseline": 1690,
      "Carbon Reduction Goals": 657,
      "Trend Forecast": 462
    },
    { 
      "years": 2025,
      "Scope 1": 1890,
      "Scope 2": 4800,
      "Scope 3": 2181,
      "Baseline": 1247,
      "Carbon Reduction Goals": 854,
      "Trend Forecast": 357
    },
    { 
      "years": 2026,
      "Scope 1": 2390,
      "Scope 2": 3800,
      "Scope 3": 2500,
      "Baseline": 1658,
      "Carbon Reduction Goals": 654,
      "Trend Forecast": 124
    },
    { 
      "years": 2027,
      "Scope 1": 3490,
      "Scope 2": 4300,
      "Scope 3": 2100,
      "Baseline": 1520,
      "Carbon Reduction Goals": 365,
      "Trend Forecast": 784
    }
  ]; 
 

    const initialCheckStates = [true, false, false, true, false, true, false, false, true];
    const [checkedCheckStates, setCheckedCheckStates] = React.useState<boolean[]>(initialCheckStates);

    const onChangeCheckbox = (index: number, checked: boolean) => {
        const updatedCheckStates = [...checkedCheckStates];
        updatedCheckStates[index] = checked;
        setCheckedCheckStates(updatedCheckStates);
    };


    return (
        <WidgetWrapper className="carbon-trends-overview">
            <TitleBar title='ORGANIZATIONAL CARBON TRENDS OVERVIEW' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
                            <div className="top-filter">
                                <div className="select-filter">  

                                        <div className="uxp-emi-dropdown">  

                                           <Select
                                                selected={ClientFilter}
                                                options={ClientFilterList}
                                                labelField="ClientID"
                                                valueField="ClientKey"
                                                onChange={(value) => { setClientFilter(value) }}
                                                placeholder=" -- select --"
                                                isValid={selected ? selected?.length > 0 : null}
                                            />  
                                        </div> 
                                    
                                </div>  
                        </div> 

            </TitleBar>   

                    <div className="resource_consumption_overview">  

                    <div className="emi-breakdown">  
                        
                        <WidgetWrapper>

                            <TitleBar title='CURRENT EMISSION DEVIATION'/> 

                            <div className="trends-overall">

                                <div className="trends-box white-box">  

                                    <FormField inline className="showcase-checkbox"> 
                                   
                                        <Checkbox
                                                onChange={(checked) => onChangeCheckbox(7, checked)}  
                                                checked={checkedCheckStates[7]}
                                            label='Use Business As Usual (2024)'
                                                isValid
                                            />
                                        <Checkbox
                                                onChange={(checked) => onChangeCheckbox(5, checked)}   
                                                checked={checkedCheckStates[5]}
                                                label="Baseline (2022)"
                                                isValid
                                            />

                                            <Checkbox
                                                onChange={(checked) => onChangeCheckbox(6, checked)}
                                                checked={checkedCheckStates[6]}
                                                label="Carbon Goals (2030)"
                                                isValid
                                            />  

                                    </FormField>  

                                    <div className="trends-box-cont green-trends-box-cont"> 
                                        <p>CURRENT EMISSION</p>
                                        <span>BASELINE (2022)</span>
                                        <h5>100 tCO<sub>2</sub>e</h5>
                                    </div>

                                </div>


                                <div className="trends-box light-red-box">  

                                <div className="trends-box-cont">
                                    <h5>20 tCO<sub>2</sub>e</h5> 
                                </div>

                                </div>


                                <div className="trends-box white-box">  

                                    <FormField inline className="showcase-checkbox">

                                    <Checkbox
                                            onChange={(checked) => onChangeCheckbox(8, checked)}
                                            checked={checkedCheckStates[8]}
                                            label='Use Business As Usual (2050)'
                                            isValid
                                        />

                                    </FormField>  

                                    <div className="trends-box-cont purple-trends-box-cont">
                                        <p>ACTUAL EMISSION</p>
                                        <span>current</span>
                                        <h5>120  tCO<sub>2</sub>e</h5> 
              
                                    </div>

                                </div>  


                              

                            </div>

                        </WidgetWrapper>
                        
                    </div> 

                    <div className="emi-breakdown">  
                        
                        <WidgetWrapper>

                            <TitleBar title='CURRENT OFFSET REQUIREMENT'/> 

                            <div className="trends-overall">

                                <div className="trends-box white-box">  

                                    <FormField inline className="showcase-checkbox">
                                        

                                    <Checkbox
                                            onChange={(checked) => onChangeCheckbox(7, checked)}  
                                            checked={checkedCheckStates[7]}
                                        label='Use Business As Usual (2050)'
                                            isValid
                                        /> 

                                    </FormField>  

                                    <div className="trends-box-cont green-trends-box-cont">
                                        {/* <p>CURRENT EMISSION</p>
                                       
                                        <h5>100 tCO<sub>2</sub>e</h5>  */}

                                        <p>PLANNED EMISSION</p>
                                        <span>2050</span>
                                        <h5>120  tCO<sub>2</sub>e</h5>

                                    </div>

                                </div>

                                <div className="trends-box light-red-box">  

                                    <div className="trends-box-cont">
                                        <h5>20 tCO<sub>2</sub>e</h5> 
                                    </div>
                                </div>


                                <div className="trends-box white-box">  

                                    <FormField inline className="showcase-checkbox"> 

                                        <Checkbox
                                            onChange={(checked) => onChangeCheckbox(8, checked)}
                                            checked={checkedCheckStates[8]}
                                            label='Use Predicted Emission for the period'
                                            isValid
                                        />


                                    </FormField>  

                                    <div className="trends-box-cont purple-trends-box-cont">
                                        <p>ACTUAL EMISSION</p>
                                        <span>current</span>
                                        <h5>120  tCO<sub>2</sub>e</h5> 
                                    </div>

                                </div> 
                               

                            </div>

                        </WidgetWrapper>
                        
                    </div>  
                    </div>

"           <div className="resource_consumption_overview"> 
                <div  className="consuption_composition" >
                   
                    <WidgetWrapper>
                            <TitleBar title='CARBON TREND'/> 

                            <div className="scopewise-chart">  
                                <ResponsiveContainer width="100%" height={400}> 
 

                                    <ComposedChart 
                                    data={consumptionCompositionData.map((entry) => ({
                                        ...entry,
                                        "Business as usual": (entry["Scope 1"] + entry["Scope 2"] + entry["Scope 3"]) / 3, // Calculating average inline
                                    }))} 
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="years" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    
                                    <Bar barSize={10} dataKey="Scope 1" stackId="a" fill="#4c6a48" />
                                    <Bar barSize={10} dataKey="Scope 2" stackId="a" fill="#466f81" />
                                    <Bar barSize={10} dataKey="Scope 3" stackId="a" fill="#b97244" />

                                    <Line type="monotone" dataKey="Baseline" stroke="#4c6a48" />
                                    <Line type="monotone" dataKey="Carbon Reduction Goals" stroke="#ff7300" />
                                    <Line type="monotone" dataKey="Trend Forecast" stroke="#b97244" />
                                        
                                    <Line type="monotone" dataKey="Business as usual" stroke="#424242" strokeDasharray="3 3" dot={true} name="Business as usual" />

                                    </ComposedChart> 


                                </ResponsiveContainer> 
                            
                            </div>
                         </WidgetWrapper>

                </div> 
            </div>
        </WidgetWrapper>
    )
}; 

export default Carbon_Trends_Overview;


 