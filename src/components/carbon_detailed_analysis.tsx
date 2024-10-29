  
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
    props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetClientList", {}, { json: true })
    .then((res: any) => {
        let result = res;
        //debugger
        setClientFilterList(result)
        setClientFilter(result[0].ClientKey)
    })
    .catch((e: string) => {
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
    props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:'0'}, { json: true })
    .then((res: any) => {
        let result = res;
        var filteredArray = result.filter(function(itm:any){
            return itm.ParentKey=='';
          });
        setMainUnitFilterList(filteredArray);
        setMainUnitFilter(filteredArray[0].BusinessUnitKey);
        //debugger
    })
    .catch((e: string) => {
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
    props.uxpContext?.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:MainUnitFilter}, { json: true })
    .then((res: any) => {
        let result = res;
        if(result.length>0){
            setSubUnitFilterList(result);
            setSubUnitFilter(result[0].BusinessUnitKey);
        }else{
            setSubUnitFilterList([]);
            setSubUnitFilter("0");
        } 
    })
    .catch((e: string) => {
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
    if(startYear && startMonth && endYear && endMonth && SubUnitFilter && MainUnitFilter){
        getScopeData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
        getCategorywiseEmissionData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth, scopeKey);
    } 
   
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

    let [Scope1_Data,setScope1_Data] = React.useState<any[]>([]); 
    let [Scope2_Data,setScope2_Data] = React.useState<any[]>([]); 
    let [Scope3_Data,setScope3_Data] = React.useState<any[]>([]); 
 
    
//let [categorywiseEmissionData,setCategorywiseEmissionData] = React.useState<any>([]) 
function getCategorywiseEmissionData (BusinessUnitKey:string,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number, ScopeKey:number) {  
    props.uxpContext.executeAction("OrganizationalDetailedEmissionOverview-Dataprovider","GetCategorywiseEmissionSummary",{
        BusinessUnitKey:BusinessUnitKey,
        StartYear:StartYear,
        StartMonth:StartMonth,
        EndYear:EndYear,
        EndMonth:EndMonth
    },{json:true}).then((res: string | any[])=>{ 
        console.log("data",res);
        if(res.length>0){
            let result :any= res
            let scope1 = result.filter((item: { ScopeKey: string; }) =>item.ScopeKey == '1');
            let scope2 = result.filter((item: { ScopeKey: string; }) =>item.ScopeKey == '2');
            let scope3 = result.filter((item: { ScopeKey: string; }) =>item.ScopeKey == '3');
            //debugger
            setScope1_Data(scope1)
            setScope2_Data(scope2)
            setScope3_Data(scope3)
        }
        
        //setCategorywiseEmissionData(res);
    }).catch((e: any)=>{
        // console.log("hi", e);
    }); 
} 
 
function CalPercentage(CurrEm: number, PrevEm: number): number {
    if (PrevEm === 0) {
        // Prevent division by zero
        throw new Error("Previous number of employees cannot be zero.");
    }

    // Calculate the absolute percentage change
    let change = Math.abs(((CurrEm - PrevEm) / PrevEm) * 100) ? Math.abs(((CurrEm - PrevEm) / PrevEm) * 100) : 0 ;

    return change;
}

function CalRealPercentage(CurrEm: number, PrevEm: number): number {
    if (PrevEm === 0) {
        // Prevent division by zero
        throw new Error("Previous number of employees cannot be zero.");
    }

    // Calculate the absolute percentage change
    let change = Math.abs(((CurrEm - PrevEm) / PrevEm) * 100) ? Math.abs(((CurrEm - PrevEm) / PrevEm) * 100) : 0 ;

    return change;
}

function getbutnclass(CurrEm: number, PrevEm: number):string{
    if (PrevEm === 0) {
        // Prevent division by zero
        throw new Error("Previous number of employees cannot be zero.");
    }
    let cls = 'analysis_graybtn'
    let change = ((CurrEm - PrevEm) / PrevEm) * 100 ? ((CurrEm - PrevEm) / PrevEm) * 100 : 0 ;
    if (change<=0){
        cls='analysis_greenbtn'
    }else if(0<change && change<=5){
        cls='analysis_yellowbtn'
    }else if(5<change){
        cls='analysis_redbtn'
    }
        
    return cls
}

let [FilterOptions,setFilterOptions] = React.useState<any[]>([{label:'All',value:'all'},{label:'Show Only Items',value:'item'}]);
let [DaviationFilters,setDaviationFilters] = React.useState<any[]>([{label:'Increased',value:'increased'},{label:'Decreased',value:'decreased'}]);
let [DaviationOptionFilters,setDaviationOptionFilters] = React.useState<any[]>([{label:'Greater Than',value:'greater_than'},{label:'Less Than',value:'less_than'}]);
let [PercentageFilters,setPercentageFilters] = React.useState<any[]>([{label:'5%',value:'5'},{label:'10%',value:'10'},{label:'25%',value:'25'},{label:'50%',value:'50'}]);

let [SelectedFilterOption,setSelectedFilterOption] = React.useState<string>('all');
let [SelectedDaviationFilter,setSelectedDaviationFilter] = React.useState<string>('increased');
let [SelectedDaviationOptionFilter,setSelectedDaviationOptionFilter] = React.useState<string>('greater_than');
let [SelectedPercentageFilter,setSelectedPercentageFilter] = React.useState<string>('5');

React.useEffect(()=>{
    if(SelectedFilterOption=='all'){
        getCategorywiseEmissionData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth, scopeKey)
    }else{
        FilterEmissionData();
    }
},[SelectedFilterOption,SelectedDaviationFilter,SelectedDaviationOptionFilter,SelectedPercentageFilter])

function FilterEmissionData(){
    let sc1,sc2,sc3 = []
    sc1 = Scope1_Data.filter(function(item:any){
        let real = CalRealPercentage(item.CurrentEmission , item.PrevEmission )
        let fl
        let filter = SelectedPercentageFilter =='5' ? 5 : SelectedPercentageFilter =='10' ? 10 : SelectedPercentageFilter=='25' ? 25 : SelectedPercentageFilter=='50' ? 50 : 0
        if(SelectedDaviationFilter=='decreased' && SelectedDaviationOptionFilter=='greater_than' ){
            fl = filter*(-1)
            return fl<=real
        }else if(SelectedDaviationFilter=='decreased' && SelectedDaviationOptionFilter=='less_than'){
            fl = filter*(-1)
            return fl>=real
        }else if(SelectedDaviationFilter=='increased' && SelectedDaviationOptionFilter=='greater_than'){
            fl = filter*(1)
            return fl<=real
        }else if(SelectedDaviationFilter=='increased' && SelectedDaviationOptionFilter=='less_than'){
            fl = filter*(1)
            return fl>=real
        }
      });
    sc2 = Scope2_Data.filter(function(item:any){
        let real = CalRealPercentage(item.CurrentEmission , item.PrevEmission )
        let fl
        let filter = SelectedPercentageFilter =='5' ? 5 : SelectedPercentageFilter =='10' ? 10 : SelectedPercentageFilter=='25' ? 25 : SelectedPercentageFilter=='50' ? 50 : 0
        if(SelectedDaviationFilter=='decreased' && SelectedDaviationOptionFilter=='greater_than' ){
            fl = filter*(-1)
            return fl<=real
        }else if(SelectedDaviationFilter=='decreased' && SelectedDaviationOptionFilter=='less_than'){
            fl = filter*(-1)
            return fl>=real
        }else if(SelectedDaviationFilter=='increased' && SelectedDaviationOptionFilter=='greater_than'){
            fl = filter*(1)
            return fl<=real
        }else if(SelectedDaviationFilter=='increased' && SelectedDaviationOptionFilter=='less_than'){
            fl = filter*(1)
            return fl>=real
        }
      });
    sc3 = Scope3_Data.filter(function(item:any){
        let real = CalRealPercentage(item.CurrentEmission , item.PrevEmission )
        let fl
        let filter = SelectedPercentageFilter =='5' ? 5 : SelectedPercentageFilter =='10' ? 10 : SelectedPercentageFilter=='25' ? 25 : SelectedPercentageFilter=='50' ? 50 : 0
        if(SelectedDaviationFilter=='decreased' && SelectedDaviationOptionFilter=='greater_than' ){
            fl = filter*(-1)
            return fl<=real
        }else if(SelectedDaviationFilter=='decreased' && SelectedDaviationOptionFilter=='less_than'){
            fl = filter*(-1)
            return fl>=real
        }else if(SelectedDaviationFilter=='increased' && SelectedDaviationOptionFilter=='greater_than'){
            fl = filter*(1)
            return fl<=real
        }else if(SelectedDaviationFilter=='increased' && SelectedDaviationOptionFilter=='less_than'){
            fl = filter*(1)
            return fl>=real
        }
      });
    debugger
    setScope1_Data(sc1)
    setScope2_Data(sc2)
    setScope3_Data(sc3)
}

    return (
        <WidgetWrapper>
        <div id="organizational-carbon-detailed-analysis">
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
            </div>  
            <div className="assets-widget-list">
                <div className="list-top-filter"> 
                    <FilterPanel> 
                        <Select
                            selected={SelectedFilterOption}
                            options={FilterOptions}
                            labelField="label"
                            valueField="value"
                            onChange={(value) => { setSelectedFilterOption(value) }}
                            placeholder=" -- select --"
                            isValid={selected ? selected?.length > 0 : null}
                        /> 
                         <br/>
                        {SelectedFilterOption=='item' &&
                            <>
                                <Select
                                    selected={SelectedDaviationFilter}
                                    options={DaviationFilters}
                                    labelField="label"
                                    valueField="value"
                                    onChange={(value) => { setSelectedDaviationFilter(value) }}
                                    placeholder=" -- select --"
                                    isValid={selected ? selected?.length > 0 : null}
                                /> 
                                <br/>
                                <Select
                                    selected={SelectedDaviationOptionFilter}
                                    options={DaviationOptionFilters}
                                    labelField="label"
                                    valueField="value"
                                    onChange={(value) => { setSelectedDaviationOptionFilter(value) }}
                                    placeholder=" -- select --"
                                    isValid={selected ? selected?.length > 0 : null}
                                /> 
                                 <br/>
                                <Select
                                    selected={SelectedPercentageFilter}
                                    options={PercentageFilters}
                                    labelField="label"
                                    valueField="value"
                                    onChange={(value) => { setSelectedPercentageFilter(value) }}
                                    placeholder=" -- select --"
                                    isValid={selected ? selected?.length > 0 : null}
                                /> 
                            </>
                        }
                    </FilterPanel>
                </div>
                <div className="item-list green-item-list">  
                    <ul style={{scrollBehavior:'smooth',height:'550px'}}>
                        {Scope1_Data.map((item:any) => (  
                            <li> 
                                <a className="carbon-emission-item" >
                                    <label>{item.ActivityCategorytableName}</label>
                                    <div className="item-value">
                                        <button className={`uxp-button ${getbutnclass(item.CurrentEmission , item.PrevEmission)}`}>{Number(item.CurrentEmission).toFixed(2)}</button>
                                        <em>kgCO<sub>2</sub>e</em>
                                    </div>
                                    {/* <span>{Number(item.PrevEmission).toFixed(2) ? `${CalPercentage(item.CurrentEmission , item.PrevEmission )} ` : 0} % <em className={`arrow ${Number(item.PrevEmission).toFixed(2)<Number(item.CurrentEmission).toFixed(2) ? 'up-arrow' : 'down-arrow'}`}></em></span>  */}
                                    <span>
                                        {Number(item.PrevEmission).toFixed(2) ? 
                                            `${CalPercentage(item.CurrentEmission, item.PrevEmission).toLocaleString(undefined, { 
                                            minimumFractionDigits: 2, 
                                            maximumFractionDigits: 2 
                                            })} ` 
                                            : 0} % 
                                        <em className={`arrow ${Number(item.PrevEmission) < Number(item.CurrentEmission) ? 'up-arrow' : 'down-arrow'}`}></em>
                                    </span>

                                </a>  
                            </li>
                        ))}
                    </ul> 
                </div> 
                <div className="item-list blue-item-list">  
                    <ul style={{scrollBehavior:'smooth',height:'550px'}}>
                        {Scope2_Data.map((item:any) => (  
                            <li> 
                                <a className="carbon-emission-item" >
                                    <label>{item.ActivityCategorytableName}</label>
                                    <div className="item-value">
                                        <button className={`uxp-button ${getbutnclass(item.CurrentEmission , item.PrevEmission)}`}>{Number(item.CurrentEmission).toFixed(2)}</button>
                                        <em>kgCO<sub>2</sub>e</em>
                                    </div>
                                    <span>
                                        {Number(item.PrevEmission).toFixed(2) ? 
                                            `${CalPercentage(item.CurrentEmission, item.PrevEmission).toLocaleString(undefined, { 
                                            minimumFractionDigits: 2, 
                                            maximumFractionDigits: 2 
                                            })} ` 
                                            : 0} % 
                                        <em className={`arrow ${Number(item.PrevEmission) < Number(item.CurrentEmission) ? 'up-arrow' : 'down-arrow'}`}></em>
                                    </span>

                                </a>  
                            </li>
                        ))}
                    </ul> 
                </div> 
                <div className="item-list orange-item-list">  
                    <ul style={{scrollBehavior:'smooth',height:'550px'}}>
                        {Scope3_Data.map((item:any) => (  
                            <li> 
                                <a className="carbon-emission-item" >
                                    <label>{item.ActivityCategorytableName}</label>
                                    <div className="item-value">
                                        <button className={`uxp-button ${getbutnclass(item.CurrentEmission , item.PrevEmission)}`}>{Number(item.CurrentEmission).toFixed(2)}</button>
                                        <em>kgCO<sub>2</sub>e</em>
                                    </div>
                                    <span>
                                        {Number(item.PrevEmission).toFixed(2) ? 
                                            `${CalPercentage(item.CurrentEmission, item.PrevEmission).toLocaleString(undefined, { 
                                            minimumFractionDigits: 2, 
                                            maximumFractionDigits: 2 
                                            })} ` 
                                            : 0} % 
                                        <em className={`arrow ${Number(item.PrevEmission) < Number(item.CurrentEmission) ? 'up-arrow' : 'down-arrow'}`}></em>
                                    </span>
                                
                                </a>  
                            </li>
                        ))}
                    </ul> 
                </div> 
            </div>
        </div>
        </WidgetWrapper>
    )
}; 

export default Organizational_Carbon_Detailed_Analysis;


























// import React, { useEffect, useState, useMemo  } from "react"; 
// import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
// import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
// import { useToast, DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
  
// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }

// const Organizational_Carbon_Detailed_Analysis: React.FunctionComponent<IWidgetProps> = (props) => {  
// let toast = useToast();
 
// let [ClientFilter,setClientFilter] =  React.useState<string>('0');
// let [MainUnitFilter,setMainUnitFilter] =  React.useState<string>('0');
// let [SubUnitFilter,setSubUnitFilter] =  React.useState<string>('0');

// let [ClientFilterList,setClientFilterList] =  React.useState<any[]>([]);
// let [MainUnitFilterList,setMainUnitFilterList] =  React.useState<any[]>([]);
// let [SubUnitFilterList,setSubUnitFilterList] =  React.useState<any[]>([]); 

// React.useEffect(()=>{
//     getClientListFilter();
// },[])

// function getClientListFilter(){
//     props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetClientList", {}, { json: true })
//     .then(res => {
//         let result = res;
//         //debugger
//         setClientFilterList(result)
//         setClientFilter(result[0].ClientKey)
//     })
//     .catch(e => {
//         console.log("except: ", e);
//         toast.error("Something went wrong" + e);
//     });
// }

// React.useEffect(()=>{
//     if(ClientFilter!='0'){
//         getBusinessUnitsFilter()
//     }
// },[ClientFilter])


// function getBusinessUnitsFilter(){
//     props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:'0'}, { json: true })
//     .then(res => {
//         let result = res;
//         var filteredArray = result.filter(function(itm:any){
//             return itm.ParentKey=='';
//           });
//         setMainUnitFilterList(filteredArray);
//         setMainUnitFilter(filteredArray[0].BusinessUnitKey);
//         //debugger
//     })
//     .catch(e => {
//         console.log("except: ", e);
//         toast.error("Something went wrong" + e);
//     });
// }

// React.useEffect(()=>{
//     if(MainUnitFilter!='0'){
//         getSubBusinessUnitsFilter();
//     }
// },[MainUnitFilter])

// function getSubBusinessUnitsFilter(){
//     props.uxpContext?.executeAction("OrganizationalEmissionOverview-Dataprovider", "GetBusinessUnits", {ClientKey:ClientFilter,ParentKey:MainUnitFilter}, { json: true })
//     .then(res => {
//         let result = res;
//         if(result.length>0){
//             setSubUnitFilterList(result);
//             setSubUnitFilter(result[0].BusinessUnitKey);
//         }else{
//             setSubUnitFilterList([]);
//             setSubUnitFilter("0");
//         } 
//     })
//     .catch(e => {
//         console.log("except: ", e);
//         toast.error("Something went wrong" + e);
//     });
// }  

// const [startYear, setStartYear] = useState(2024);
// const [startMonth, setStartMonth] = useState(7);
// const [endYear, setEndYear] = useState(2024);
// const [endMonth, setEndMonth] = useState(12);
// const [scopeKey, setScopeKey] = useState(1); 

// const Years = GetYears();

// function GetYears(){
//     const currentYear = new Date().getFullYear();
//     const yearList = [];
 
//     for (let year = currentYear - 5; year <= currentYear + 5; year++) {
//         yearList.push({ Label: year, Value: year });
//     }
    
//     return yearList;
//  }; 

// const months=[
//     {Value:'1',Label:'January'},
//     {Value:'2',Label:'February'},
//     {Value:'3',Label:'March'},
//     {Value:'4',Label:'April'},
//     {Value:'5',Label:'May'},
//     {Value:'6',Label:'June'},
//     {Value:'7',Label:'July'},
//     {Value:'8',Label:'August'},
//     {Value:'9',Label:'September'},
//     {Value:'10',Label:'October'},
//     {Value:'11',Label:'November'},
//     {Value:'12',Label:'December'}
//  ]

// let [scopedata, setScopeData] = useState<any[]>([]);  


// useEffect(() => {
//     getScopeData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth);
//     getCategorywiseEmissionData(SubUnitFilter!='0'?SubUnitFilter:MainUnitFilter,startYear,startMonth,endYear,endMonth, scopeKey);
   
// },[startYear,startMonth,endYear,endMonth,SubUnitFilter,MainUnitFilter ]) 


// function getScopeData(BusinessUnitKey: string, StartYear: number, StartMonth: number, EndYear: number, EndMonth: number) {
// props.uxpContext.executeAction(
//   "OrganizationalCategorywiseEmissionOverview-Dataprovider",
//   "GetScopewiseOverview",
//   { BusinessUnitKey, StartYear, StartMonth, EndYear, EndMonth, scopeKey },
//   { json: true }
// )
// .then((res: any) => {
//   console.log("response", res);
//   setScopeData(res);  
// })
// .catch((e: any) => {
//   console.error("Error fetching scope data", e);
// });
// } 

// const getClassName = (scopeKey: string) => {
// switch (scopeKey) {
//   case "1":
//     return "green-scope-box";
//   case "2":
//     return "blue-scope-box";
//   case "3":
//     return "orange-scope-box";
//  case "4":
//     return "green_blue-scope-box";
//  case "5":
//     return "green_blue_orange-scope-box";
//   default:
//     return "scope-box"; 
// }
// }; 
 
    
//     let [selected, setSelected] = React.useState<string | null>("op-1");
//     let [selected1, setSelected1] = React.useState<string | null>("op-1");
//     let [selected2, setSelected2] = React.useState<string | null>("op-1"); 

//     let Detailed_Analysis_Green_Data =  [
//         {"AnalysisName":"Stationary Combustion", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn", "AnalysisValue":23.1},
//         {"AnalysisName":"Fugitive Emission-Refrigerant", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Fugitive Emission-Fire Suppressant", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_greenbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Fugitive Emission-Electrical Insulating Gas", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Fugitive Emission-Anesthetic Gas", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_yellowbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Fugitive Emission-Waste Water Treatment", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1}
//     ];

//     let Detailed_Analysis_Blue_Data =  [
//         {"AnalysisName":"Electricity Purchased - Location based", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn", "AnalysisValue":23.1},
//         {"AnalysisName":"Electricity Purchased - Market based", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Electricity Solid", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_greenbtn","AnalysisValue":23.1} 
//     ] 
 
//     let Detailed_Analysis_Orange_Data =  [
//         {"AnalysisName":"Category 1 - Purchased Goods & Services", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn", "AnalysisValue":23.1},
//         {"AnalysisName":"Category 2 - Capital Goods", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Category 3 - Fuel & Energy Related Emissions", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_greenbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Category 4 - Upstream Transportation", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Category 5 - Waste Generated in Operations", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_yellowbtn","AnalysisValue":23.1},
//         {"AnalysisName":"Category 6 - Business Travels", "AnalysisScope":"25 tCO2e", "AnalysisBtnClass":"analysis_redbtn","AnalysisValue":23.1}
//     ];  

    
// let [categorywiseEmissionData,setCategorywiseEmissionData] = React.useState<any>([]) 
// function getCategorywiseEmissionData (BusinessUnitKey:string,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number, ScopeKey:number) {  
//     props.uxpContext.executeAction("OrganizationalCategorywiseEmissionOverview-Dataprovider","GetCategorywiseEmissionBreakdownByScope",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
//         console.log("data",res);
//         setCategorywiseEmissionData(res);
//     }).catch(e=>{
//         // console.log("hi", e);
//     }); 
// }  

//     return (
//         <WidgetWrapper>
//             <TitleBar title='Organizational Carbon Detailed Analysisss' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
  
//                         <div className="top-filter">
//                                 <div className="select-filter">  

//                                         <div className="uxp-emi-dropdown"> 
                                                                                
//                                             <div className="uxp-emi-select-sec no-padding mb-only">

//                                                     <Select
//                                                         selected={startYear.toString()}
//                                                         options={Years}
//                                                         labelField="Label"
//                                                         valueField="Value"
//                                                         onChange={(value) => { setStartYear(Number(value)) }}
//                                                         placeholder=" -- select --"
//                                                         isValid={selected ? selected?.length > 0 : null}
//                                                     /> 
//                                                     <Select
//                                                         selected={startMonth.toString()}
//                                                         options={months}
//                                                         labelField="Label"
//                                                         valueField="Value"
//                                                         onChange={(value) => { setStartMonth(Number(value)) }}
//                                                         placeholder=" -- select --"
//                                                         isValid={selected ? selected?.length > 0 : null}
//                                                     />  

//                                             </div> 

//                                             <label>To</label>

//                                             <div className="uxp-emi-select-sec no-padding mb-only">  

//                                                 <Select
//                                                     selected={endYear.toString()}
//                                                     options={Years}
//                                                     labelField="Label"
//                                                     valueField="Value"
//                                                     onChange={(value) => { setEndYear(Number(value)) }}
//                                                     placeholder=" -- select --"
//                                                     isValid={selected ? selected?.length > 0 : null}
//                                                 /> 
//                                                 <Select
//                                                     selected={endMonth.toString()}
//                                                     options={months}
//                                                     labelField="Label"
//                                                     valueField="Value"
//                                                     onChange={(value) => { setEndMonth(Number(value)) }}
//                                                     placeholder=" -- select --"
//                                                     isValid={selected ? selected?.length > 0 : null}
//                                                 />    
//                                            </div>   
//                                         </div>  
//                                 </div> 

//                             <FilterPanel>

//                                     <Select
//                                         selected={ClientFilter}
//                                         options={ClientFilterList}
//                                         labelField="ClientID"
//                                         valueField="ClientKey"
//                                         onChange={(value) => { setClientFilter(value) }}
//                                         placeholder=" -- select --"
//                                         isValid={selected ? selected?.length > 0 : null}
//                                     /> 
//                                     <br/>
//                                     <Select
//                                         selected={MainUnitFilter}
//                                         options={MainUnitFilterList}
//                                         labelField="BusinessUnitName"
//                                         valueField="BusinessUnitKey"
//                                         onChange={(value) => { setMainUnitFilter(value) }}
//                                         placeholder=" -- select --"
//                                         isValid={selected1 ? selected1?.length > 0 : null}
//                                     />    
//                                     <br/>
//                                     <Select
//                                             selected={SubUnitFilter}
//                                             options={SubUnitFilterList}
//                                              labelField="BusinessUnitName"
//                                             valueField="BusinessUnitKey"
//                                             onChange={(value) => { setSubUnitFilter(value) }}
//                                             placeholder=" -- select --"
//                                             isValid={selected2 ? selected2?.length > 0 : null}
//                                         /> 
//                             </FilterPanel>
//                         </div>
//             </TitleBar> 

//                     <div className="scope-overall">
//                         {scopedata.length > 0 ? (
//                             <>
//                                 {scopedata.map((scope, index) => (
//                                     <div key={index} className={`scope-box ${getClassName(scope.ScopeKey)}`}>
//                                         <h4>{scope.ScopeName}</h4>
//                                         {/* <h3>{Number(scope.CurrentEmission || 0).toFixed(2)} <span>tCO<em>2</em>e</span></h3> */}
//                                     <h3>{Number(scope.CurrentEmission || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span>tCO<em>2</em>e</span></h3>  

//                                         <div className="scope-bottom">
//                                             <em>{scope.PrevEmission ? `${Number(scope.PrevEmission).toFixed(2)} %` : "0%"}</em>
//                                             <span className={`arrow ${scope.PrevEmission && parseFloat(scope.PrevEmission) > 0 ? 'up-arrow' : 'down-arrow'}`}></span>
//                                         </div>
//                                     </div>
//                                 ))} 
//                             </>
//                         ) : (
//                             <p>Loading data...</p>
//                         )}
//                     </div> 
 

//                 <div className="assets-widget-list">

//                     <div className="list-top-filter"> 

//                         <FilterPanel> 
//                             <Select
//                                 selected={ClientFilter}
//                                 options={ClientFilterList}
//                                 labelField="ClientID"
//                                 valueField="ClientKey"
//                                 onChange={(value) => { setClientFilter(value) }}
//                                 placeholder=" -- select --"
//                                 isValid={selected ? selected?.length > 0 : null}
//                             /> 
//                         </FilterPanel>

//                     </div> 


//                     <div className="item-list green-item-list">  
//                         <ul>
//                             {Detailed_Analysis_Green_Data.map((item:any) => (  
//                                 <li key={item.AssetID}> 
//                                 <div className="list_category">
//                                         <label>{item.AnalysisName}</label>  

//                                         <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

//                                         <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
//                                     </div>  
//                                 </li>
//                             ))}
//                         </ul> 
//                     </div>  


//                     <div className="item-list blue-item-list">  
//                         <ul>
//                             {Detailed_Analysis_Blue_Data.map((item:any) => (  
//                                 <li key={item.AssetID}> 
//                                 <div className="list_category">
//                                         <label>{item.AnalysisName}</label>  

//                                         <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

//                                         <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
//                                     </div>  
//                                 </li>
//                             ))}
//                         </ul> 
//                     </div>


//                     <div className="item-list orange-item-list">  
//                         <ul>
//                             {Detailed_Analysis_Orange_Data.map((item:any) => (  
//                                 <li key={item.AssetID}> 
//                                <div className="list_category">
//                                         <label>{item.AnalysisName}</label>  

//                                         <button className={`uxp-button ${item.AnalysisBtnClass}`}>{item.AnalysisScope}</button>

//                                         <span>{item.AnalysisValue} % <em className="arrow up-arrow"></em></span> 
                                        
//                                     </div>  
//                                 </li>
//                             ))}
//                         </ul> 
//                     </div>  
                    
//                 </div> 


//         </WidgetWrapper>
//     )
// }; 

// export default Organizational_Carbon_Detailed_Analysis;


 