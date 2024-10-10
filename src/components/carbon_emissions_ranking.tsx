  

import  React, {useState} from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,  } from 'recharts';
import {  useToast, DataList, WidgetWrapper, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { PieChart, Pie, Cell } from 'recharts';
import { ResponsivePie } from '@nivo/pie';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

 const Emissions_Ranking: React.FunctionComponent<IWidgetProps> = (props) => {



    
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
  

    const [toggleFilterValue, setToggleFilterValue] = useState<"Scope 1" | "Scope 2" | "Scope 3">("Scope 1");
    const [isPieChart, setIsPieChart] = useState(false);

    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1");   

    const dataScope1 = [
        { name: 'BU1', scope1: 46, scope2: 24, scope3: 30, label: '100 tCO2e' },
        { name: 'BU2', scope1: 23, scope2: 44, scope3: 33, label: '100 tCO2e' },
        { name: 'BU3', scope1: 15, scope2: 65, scope3: 20, label: '100 tCO2e' },
        { name: 'BU4', scope1: 25, scope2: 35, scope3: 40, label: '100 tCO2e' },
        { name: 'BU5', scope1: 54, scope2: 26, scope3: 20, label: '100 tCO2e' } 
    ];  

  return (
    <WidgetWrapper>

                    <TitleBar title='Organizational Carbon Emissions Ranking' icon="https://static.iviva.com/images/Udhayimages/alert-trends.png">
 
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

            <div className="scopewise-chart" style={{marginTop:"2em"}}>
                <div className="chart">
            
                        <ResponsiveContainer width="100%" height={400}> 

                                <BarChart data={dataScope1} layout="vertical"
                                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={80} />
                                <YAxis type="category" yAxisId="right" orientation="right" dataKey="label" width={100} />
                                <Tooltip />
                                <Legend /> 

                                <Bar dataKey="scope1" stackId="a" fill="#6b9459" barSize={20} /> 
                                <Bar dataKey="scope2" stackId="a" fill="#4c99a2" barSize={20} /> 
                                <Bar dataKey="scope3" stackId="a" fill="#dea76b" barSize={20} />
                                </BarChart> 

                        </ResponsiveContainer> 

                </div>
            </div>
           
          
    </WidgetWrapper>
    
  );
};

export default Emissions_Ranking;
