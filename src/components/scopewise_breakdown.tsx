import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, } from '../uxp';  
import { AreaChart, Area, ResponsiveContainer,  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,Cell  } from 'recharts';
import { DataList, Modal, WidgetWrapper, Button, DynamicSelect, SearchBox, DataTable, MapComponent, TitleBar, ItemListCard, FilterPanel, DataGrid, ItemCard, FormField, Label, Select, Input, DateRangePicker, DatePicker, Checkbox, ProfileImage, Popover, TrendChartComponent, ToggleFilter } from "uxp/components";
 
import { ResponsivePie } from '@nivo/pie';

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Scopewise_Breakdown: React.FunctionComponent<IWidgetProps> = (props) => {  

    // Scope-wise data array
    let scopewiseData = [
        { "ScopeWiseKey": "1", "ScopewiseName": "Scope 1", "ScopewiseCount": "30" },
        { "ScopeWiseKey": "2", "ScopewiseName": "Scope 2", "ScopewiseCount": "20" },
        { "ScopeWiseKey": "3", "ScopewiseName": "Scope 3", "ScopewiseCount": "50" }
    ]; 

    

    // let [scopedata,setScopeData] = React.useState<any>([]) 
    // function getData (BusinessUnitKey:number,StartYear:number,StartMonth:number,EndYear:number,EndMonth:number) {  
    //     props.uxpContext.executeAction("OrganizationalEmissionOverview-Dataprovider","GetScopewiseOverview",{BusinessUnitKey:BusinessUnitKey,StartYear:StartYear,StartMonth:StartMonth,EndYear:EndYear,EndMonth:EndMonth},{json:true}).then(res=>{ 
    //         console.log("red",res);
    //         setScopeData(res);
    //     }).catch(e=>{
    //         // console.log("hi", e);
    //     }); 
    // } 




    // State variables to handle modal and data
    let [showModal, setShowModal] = React.useState(false);
    let [modelData, setModelData] = React.useState<any>(null);

    // Handle button click to show the modal
    function handleClick() {
        console.log("Button clicked"); // Console log to confirm click
        setShowModal(true); // Set modal to visible
        setModelData({}); // Assuming you want to load some data here
    }

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);  // Set modal to invisible
        setModelData(null);    // Clear model data
    };

    // Bar chart data for the modal
    const data1 = [
        { month: 'JAN', Scope1: 150, Scope2: 100, Scope3: 50 },
        { month: 'FEB', Scope1: 160, Scope2: 120, Scope3: 70 },
        { month: 'MAR', Scope1: 180, Scope2: 140, Scope3: 80 },
        { month: 'APR', Scope1: 100, Scope2: 60, Scope3: 40 },
        { month: 'MAY', Scope1: 170, Scope2: 130, Scope3: 60 },
        { month: 'JUN', Scope1: 200, Scope2: 150, Scope3: 80 },
        { month: 'JUL', Scope1: 190, Scope2: 140, Scope3: 90 },
        { month: 'AUG', Scope1: 200, Scope2: 160, Scope3: 100 },
        { month: 'SEP', Scope1: 180, Scope2: 130, Scope3: 70 },
        { month: 'OCT', Scope1: 170, Scope2: 120, Scope3: 60 },
        { month: 'NOV', Scope1: 140, Scope2: 100, Scope3: 50 },
        { month: 'DEC', Scope1: 180, Scope2: 130, Scope3: 70 }
    ];

        
    let [selected, setSelected] = React.useState<string | null>("op-1");
    let [selected1, setSelected1] = React.useState<string | null>("op-1");
    let [selected2, setSelected2] = React.useState<string | null>("op-1");
    

    let [startDate, setStartDate] = React.useState<string | Date>(new Date()); 
    let [endDate, setEndDate] = React.useState<string | Date>(addDays(90));  


    function parseDate(date:string){ 
        var currentTime = new Date(date);  
        var month = ("0" + (currentTime.getMonth() + 1)).slice(-2); 
        var day = ("0" + currentTime.getDate()).slice(-2);
        var year = currentTime.getFullYear();
        var formatedate = year + '-' + month + '-' + day; 
        return formatedate;
    }
 
    let date = new Date(); 
    date.setDate(date.getDate() + 1);
    
    function addDays(days: number) { 
        var result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }  
    

    return (
        <WidgetWrapper>
            <TitleBar title='Scope-wise Total Emission Breakdown'/> 

            <div className="scopewise-chart">

                <div className="chart">  
                    <ResponsiveContainer>   
                        <ResponsivePie  
                             data={scopewiseData}
                            //data={scopedata.CurrentEmission}
                            id="ScopewiseName" 
                            margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
                            innerRadius={0.75}
                            padAngle={0}
                            cornerRadius={3}
                            colors={["#466f81", "#b97244", "#4c6a48"]}
                            borderWidth={1}
                            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }} 
                            animate={true}   
                            value="ScopewiseCount"
                            activeOuterRadiusOffset={8}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={1}
                            arcLabelsTextColor="#ffffff" 
                            arcLabelsRadiusOffset={0.5}
                            arcLabel={d => `${d.value}%`}  // Format labels with name and percentage
                        />    
                    </ResponsiveContainer>      
                </div>  

                 
                <div className="view-more"> 
                    <Button title="View More" onClick={handleClick} />
                </div>

                {/* Modal for Bar Chart */}
                <Modal className="popup" title="Scope-Wise Operational Carbon Emissions Overview" show={showModal} onClose={handleCloseModal}>
                    <div id="my_Popup"> 

                                <div className="top-filter"> 

                                    <div className="select-filter">  
 
                                        <FormField className="no-padding mb-only">
                                        
                                            <DateRangePicker title=""
                                                startDate={startDate}
                                                endDate={endDate}
                                                closeOnSelect
                                                onChange={(newStart, newEnd) => { setStartDate(newStart); setEndDate(newEnd)}}
                                            /> 
                                        </FormField>
                                         

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
                                                { label: "PS", value: "op-2" },
                                                { label: "Vimut", value: "op-3" },
                                            ]}
                                            onChange={(value) => { setSelected1(value) }}
                                            placeholder=" -- select --"
                                            isValid={selected1 ? selected1?.length > 0 : null}
                                        />   

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
                                    </div>  
                                </div>




                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data1} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar barSize={10} dataKey="Scope1" stackId="a" fill="#4c6a48" />
                                <Bar barSize={10} dataKey="Scope2" stackId="a" fill="#466f81" />
                                <Bar barSize={10} dataKey="Scope3" stackId="a" fill="#b97244" />
                            </BarChart>
                        </ResponsiveContainer> 
                    </div>
                </Modal>

            </div>
        </WidgetWrapper>
    )
};

export default Scopewise_Breakdown;