 
import React, { useEffect, useState, useMemo  } from "react";
 

import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import { useToast, DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
  
interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Organizational_Carbon_Detailed_Analysis: React.FunctionComponent<IWidgetProps> = (props) => {

 


    
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
const [scopeKey, setScopeKey] = useState(1);


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
    getCategorywiseEmissionData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth, scopeKey);
   
},[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 


function getScopeData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
props.uxpContext.executeAction(
  "OrganizationalCategorywiseEmissionOverview-Dataprovider",
  "GetScopewiseOverview",
  { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth, scopeKey },
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


  
    
    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1"); 

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

    
let [categorywiseEmissionData,setCategorywiseEmissionData] = React.useState<any>([]) 
function getCategorywiseEmissionData (BusinessUnitKey:string,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number, ScopeKey:number) {  
    props.uxpContext.executeAction("OrganizationalCategorywiseEmissionOverview-Dataprovider","GetCategorywiseEmissionBreakdownByScope",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
        console.log("data",res);
        setCategorywiseEmissionData(res);
    }).catch(e=>{
        // console.log("hi", e);
    }); 
} 




    return (
        <WidgetWrapper>
            <TitleBar title='Organizational Carbon Detailed Analysis' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
  
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
                                scopedata.map((scope, index) => (   
                                     <div key={index} className={`scope-box ${getClassName(scope.ScopeKey)}`}>
                                    <h4> {scope.ScopeName} </h4>
                                    {/* <h3>{scope.CurrentEmission} tCO<em>2</em>e</h3> */}
                                    <h3>{Number(scope.CurrentEmission).toFixed(2)} tCO<em>2</em>e</h3>
                                    <div className="scope-bottom">
                                    <em>{Number(scope.PrevEmission).toFixed(2) ? `${Number(scope.PrevEmission).toFixed(2)} %` : 0}</em>
                                    <span className={`arrow ${scope.PrevEmission && parseFloat(scope.PrevEmission) > 0 ? 'up-arrow' : 'down-arrow'}`}></span>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p>Loading data...</p> 
                            )}  
                    </div>    

                {/* <div className="scope-overall"> 

                    <div className="scope-box green-scope-box">  
                        <h4>{org_overview.scopeName}</h4> 
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


                </div> */} 

                <div className="assets-widget-list">

                    <div className="list-top-filter"> 

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
                        </FilterPanel>

                    </div>



 



                    <div className="item-list green-item-list">  
                        <ul>
                            {Detailed_Analysis_Green_Data.map((item:any) => (  
                                <li key={item.AssetID}> 
                                <div className="list_category">
                                        <label>{item.AnalysisName}</label>  

                                        <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

                                        <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                    </div>  
                                </li>
                            ))}
                        </ul> 
                    </div>  


                    <div className="item-list blue-item-list">  
                        <ul>
                            {Detailed_Analysis_Blue_Data.map((item:any) => (  
                                <li key={item.AssetID}> 
                                <div className="list_category">
                                        <label>{item.AnalysisName}</label>  

                                        <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

                                        <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                    </div>  
                                </li>
                            ))}
                        </ul> 
                    </div>


                    <div className="item-list orange-item-list">  
                        <ul>
                            {Detailed_Analysis_Orange_Data.map((item:any) => (  
                                <li key={item.AssetID}> 
                               <div className="list_category">
                                        <label>{item.AnalysisName}</label>  

                                        <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

                                        <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                        
                                    </div>  
                                </li>
                            ))}
                        </ul> 
                    </div> 
 
                    
                </div>

                


        </WidgetWrapper>
    )
};
 

export default Organizational_Carbon_Detailed_Analysis;


 