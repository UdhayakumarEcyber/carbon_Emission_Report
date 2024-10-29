import React, { useState } from "react";  
import { WidgetWrapper, TitleBar, ItemCard, Modal, Input, Checkbox, FormField, Label, Button, Select, useToast } from "uxp/components";  

import { registerWidget, registerLink, registerUI, IContextProvider } from '../uxp';  

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Configuration: React.FunctionComponent<IWidgetProps> = (props:any) => { 
    const [activeItem, setActiveItem] = useState(0);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [editingRow1, setEditingRow1] = useState<number | null>(null);
    const [editingRow2, setEditingRow2] = useState<number | null>(null);
    const [editingRow3, setEditingRow3] = useState<number | null>(null);
    let [selected, setSelected] = React.useState<string | null>("");
    let [selected1, setSelected1] = React.useState<string | null>("");
    let [selected2, setSelected2] = React.useState<string | null>("");

    let [selected3, setSelected3] = React.useState<string | null>("Kamal");


    
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



    const [tableData1, setTableData1] = useState([
        { id: 1, client: 'Pruksha', year: 2025, goal: '2500', long_term: 'No', index: 0 },
        { id: 2, client: 'Pruksha', year: 2030, goal: '2500', long_term: 'No Active', index: 1 },
        { id: 3, client: 'Pruksha', year: 2050, goal: '2500', long_term: 'Yes Active', index: 2 },
    ]);

    const [tableData2, setTableData2] = useState([
        { id: 1, client: 'Pruksha', year: 2025, goal: '2500', long_term: 'No', index: 0 },
        { id: 2, client: 'Pruksha', year: 2030, goal: '2500', long_term: 'No Active', index: 1 },
        { id: 3, client: 'Pruksha', year: 2050, goal: '2500', long_term: 'Yes Active', index: 2 },
    ]); 
    
    const [tableData3, setTableData3] = useState([
        { id: 1, client: 'Pruksha', bu: 'Vimit', user_group: 'CEO User', name: 'Kamal', is_active:'No', index: 0 },
        { id: 2, client: 'Pruksha', bu: 'PSH', user_group: 'BU User', name: 'Namal', is_active:'Yes', index: 1 }, 
    ]);

    const [modalInputValues, setModalInputValues] = useState({ client: "", year: "", goal: "" });
    const [modalCheckboxes, setModalCheckboxes] = useState({ longTerm: false, active: false });

    const [modalInputValues1, setModalInputValues1] = useState({ client: "", bu: "", user_group: "", name:"" });
    const [modalCheckboxes1, setModalCheckboxes1] = useState({ is_active: false});


    const editClick1 = (rowIndex: number) => {
        const row = tableData1[rowIndex];
        setModalInputValues({ client: row.client, year: row.year.toString(), goal: row.goal });
        setModalCheckboxes({
            longTerm: row.long_term.includes("Yes"),
            active: row.long_term.includes("Active"),
        });
        setEditingRow1(rowIndex);
        setShowModal1(true);
    };

    const editClick2 = (rowIndex: number) => {
        const row = tableData2[rowIndex];
        setModalInputValues({ client: row.client, year: row.year.toString(), goal: row.goal });
        setModalCheckboxes({
            longTerm: row.long_term.includes("Yes"),
            active: row.long_term.includes("Active"),
        });
        setEditingRow2(rowIndex);
        setShowModal2(true);
    };


    const addClick = () => {
        setModalInputValues1({ client: "", bu: "", user_group: "", name: "" });
        setModalCheckboxes1({ is_active: false });
        setEditingRow3(null);
        setShowModal3(true);
    };

    const editClick3 = (rowIndex: number) => {
        const row = tableData3[rowIndex];
        setModalInputValues1({ client: row.client, bu: row.bu, user_group: row.user_group, name: row.name });
        setModalCheckboxes1({ is_active: row.is_active === "Yes" });
        setEditingRow3(rowIndex);
        setShowModal3(true);
    };

    const handleSaveModal1 = () => {
        if (editingRow1 !== null) {
            const updatedData = [...tableData1];
            updatedData[editingRow1] = {
                ...updatedData[editingRow1],
                client: modalInputValues.client,
                year: parseInt(modalInputValues.year),
                goal: modalInputValues.goal,
                long_term: `${modalCheckboxes.longTerm ? "Yes" : "No"} ${modalCheckboxes.active ? "Active" : ""}`.trim()
            };
            setTableData1(updatedData);
        }
        setShowModal1(false);
    };

    const handleSaveModal2 = () => {
        if (editingRow2 !== null) {
            const updatedData = [...tableData2];
            updatedData[editingRow2] = {
                ...updatedData[editingRow2],
                client: modalInputValues.client,
                year: parseInt(modalInputValues.year),
                goal: modalInputValues.goal,
                long_term: `${modalCheckboxes.longTerm ? "Yes" : "No"} ${modalCheckboxes.active ? "Active" : ""}`.trim()
            };
            setTableData2(updatedData);
        }
        setShowModal2(false);
    };
 const deleteClick3 = (rowIndex: number) => {
        setTableData3((prevData) => prevData.filter((_, index) => index !== rowIndex));
    };

    // const handleSaveModal3 = () => {
    //     const newData = {
    //         client: modalInputValues1.client,
    //         bu: modalInputValues1.bu,
    //         user_group: modalInputValues1.user_group,
    //         name: modalInputValues1.name,
    //         is_active: modalCheckboxes1.is_active ? "Yes" : "No"
    //     };

    //     if (editingRow3 !== null) {
    //         setTableData3((prevData) => {
    //             const updatedData = [...prevData];
    //             updatedData[editingRow3] = { ...updatedData[editingRow3], ...newData };
    //             return updatedData;
    //         });
    //     } else {
    //         setTableData3((prevData) => [...prevData, { ...newData, id: Date.now(), index: prevData.length }]);
    //     }

    //     setShowModal3(false);
    // };

    const handleSaveModal3 = () => {
        const newData = {
            client: ClientFilterList.find(c => c.ClientKey === ClientFilter)?.ClientID || "",
            bu: MainUnitFilterList.find(b => b.BusinessUnitKey === MainUnitFilter)?.BusinessUnitName || "",
            user_group: SubUnitFilterList.find(s => s.BusinessUnitKey === SubUnitFilter)?.BusinessUnitName || "",
            name: selected3,
            is_active: modalCheckboxes1.is_active ? "Yes" : "No",
            id: editingRow3 !== null ? tableData3[editingRow3].id : Date.now(),
            index: editingRow3 !== null ? tableData3[editingRow3].index : tableData3.length,
        };
    
        if (editingRow3 !== null) {
            // Edit existing row
            setTableData3(prevData => {
                const updatedData = [...prevData];
                updatedData[editingRow3] = newData;
                return updatedData;
            });
        } else {
            // Add new row
            setTableData3(prevData => [...prevData, newData]);
        }
    
        setShowModal3(false); // Close the modal after saving
    };

    
    const handleItemClick = (index: number) => {
        setActiveItem(index);
    };

    const renderTableData = (data: any[], editClick: (rowIndex: number) => void) => {
        return (
            <div className="data-list-container has-footer">
                <div className="data-list">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Year</th>
                                <th>Goal</th>
                                <th>Long Term</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(({ id, client, year, goal, long_term }, index) => (
                                <tr key={id} className="data-list-item">
                                    <td><div className="item-card">{client}</div></td>
                                    <td><div className="item-card">{year}</div></td>
                                    <td><div className="item-card">{goal} kgCO2e</div></td>
                                    <td><div className="item-card">{long_term}</div></td>
                                    <td>
                                        <div className="item-card">
                                            <div className="edit-icon" onClick={() => editClick(index)}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

  {/* { id: 1, client: 'Pruksha', bu: 'Vimit', user_group: 'CEO User', name: 'Kamal', is_active:'No', index: 0 }, */}

  const renderTableData1 = (data: any[], editClick: (rowIndex: number) => void, deleteClick: (rowIndex: number) => void) => {
    return (
        <div className="data-list-container has-footer">
            <div className="data-list">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>BU</th>
                            <th>User Group</th>
                            <th>Name</th>
                            <th>Is Active</th>
                            <th></th> 
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({ id, client, bu, user_group, name, is_active }, index) => (
                            <tr key={id} className="data-list-item">
                                <td><div className="item-card">{client}</div></td>
                                <td><div className="item-card">{bu}</div></td>
                                <td><div className="item-card">{user_group}</div></td>
                                <td><div className="item-card">{name}</div></td>
                                <td><div className="item-card">{is_active}</div></td>
                                <td>
                                    <div className="item-card">
                                        <div className="edit-icon" onClick={() => editClick(index)}></div>
                                        <div className="delete-icon" onClick={() => deleteClick(index)}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

    const renderContent = () => {
        switch (activeItem) {
            case 0: return <div style={{marginTop:"2em"}}>{renderTableData(tableData1, editClick1)}</div>;
            case 1: return (
                <div style={{marginTop:"2em"}}>
                    {renderTableData(tableData2, editClick2)}
                </div>
            );
            case 2: return (
                <div className="baseline-content" style={{marginTop:"2em"}}>
                <FormField className="no-padding mb-only">
                    <div className="baseline-list">
                        <Label>Client</Label>
                        <span>
                            <Input type="text" value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
                        </span>
                    </div>
                    <div className="baseline-list">
                        <Label>Baseline Year</Label>
                        <span>
                            <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
                        </span>
                    </div>
                    <div className="baseline-list" style={{ float: "right", width: "87%" }}>
                        <Button title="Save" onClick={() => alert("clicked")} />
                    </div>
                </FormField>
            </div>
        );
        case 3: return (
            <div className="bu-content">
            <div className="add-icon" onClick={addClick}></div> 
            <div style={{ marginTop: "2.5em" }}>{renderTableData1(tableData3, editClick3, deleteClick3)}</div>
        </div>
    );
        default: return null;


        }
    };

    return (
        <>
            <WidgetWrapper>
                <TitleBar title="Configuration" />
                <div className="configuration-overall">
                    <div className="configuration-sidebar"> 
                        <div className={`sidebar-list ${activeItem === 0 ? 'active' : ''}`} onClick={() => handleItemClick(0)}>Carbon Goals</div>  
                        <div className={`sidebar-list ${activeItem === 1 ? 'active' : ''}`} onClick={() => handleItemClick(1)}>Business as Usual</div>  
                        <div className={`sidebar-list ${activeItem === 2 ? 'active' : ''}`} onClick={() => handleItemClick(2)}>Carbon Baselines</div>  
                        <div className={`sidebar-list ${activeItem === 3 ? 'active' : ''}`} onClick={() => handleItemClick(3)}>BU Users</div>  
                    </div>
                    <div className="content">{renderContent()}</div>
                </div>
            </WidgetWrapper>

            {/* Modal for Editing Table 1 */}
            <Modal title="Edit Carbon Goal" className="congig-popup" show={showModal1} onClose={() => setShowModal1(false)}>
                
            <div className="congig-popup-cont">
                     <ul>
                         <li>
                             <Label>Client</Label>
                             <span>
                                 <Input value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
                             </span>
                         </li>
                         <li>
                             <Label>Year</Label>
                             <span>
                                 <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
                             </span>
                         </li>
                         <li>
                             <Label>Goal</Label>
                             <span>
                                 <Input type="number" value={modalInputValues.goal} onChange={(val) => setModalInputValues({ ...modalInputValues, goal: val })} />
                             </span>
                         </li>
                         <li>
                             <FormField inline className="showcase-checkbox">
                                 <Checkbox checked={modalCheckboxes.longTerm} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, longTerm: checked })} label="Long Term" />
                                 <Checkbox checked={modalCheckboxes.active} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, active: checked })} label="Active" />
                             </FormField>
                         </li>
                         <li className="save-list">
                             <Button title="Save" onClick={handleSaveModal1} />
                         </li>
                     </ul>
                 </div>

            </Modal>

            {/* Modal for Editing Table 2 */}
            <Modal title="Edit Business Goal" className="congig-popup" show={showModal2} onClose={() => setShowModal2(false)}>
            <div className="congig-popup-cont">
                     <ul>
                         <li>
                             <Label>Client</Label>
                             <span>
                                 <Input value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
                             </span>
                         </li>
                         <li>
                             <Label>Year</Label>
                             <span>
                                 <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
                             </span>
                         </li>
                         <li>
                             <Label>Goal</Label>
                             <span>
                                 <Input type="number" value={modalInputValues.goal} onChange={(val) => setModalInputValues({ ...modalInputValues, goal: val })} />
                             </span>
                         </li>
                         <li>
                             <FormField inline className="showcase-checkbox">
                                 <Checkbox checked={modalCheckboxes.longTerm} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, longTerm: checked })} label="Long Term" />
                                 <Checkbox checked={modalCheckboxes.active} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, active: checked })} label="Active" />
                             </FormField>
                         </li>
                         <li className="save-list">
                             <Button title="Save" onClick={handleSaveModal2} />
                         </li>
                     </ul>
                 </div>
            </Modal>



           

            <Modal title={editingRow3 !== null ? "Edit BU Users" : "Add BU Users"} className="congig-popup" show={showModal3} onClose={() => setShowModal3(false)}>
                <div className="congig-popup-cont">
                    <ul>
                        <li>
                            <Label>Client</Label>
                            <span>
                            <Select
                                selected={ClientFilter}
                                options={ClientFilterList}
                                labelField="ClientID"
                                valueField="ClientKey"
                                onChange={(value) => { setClientFilter(value) }}
                                placeholder=" -- select --"
                                isValid={selected ? selected?.length > 0 : null}
                            /> 
                            </span>
                        </li>
                        <li>
                            <Label>Main BU</Label>
                            <span>
                            <Select
                                selected={MainUnitFilter}
                                options={MainUnitFilterList}
                                labelField="BusinessUnitName"
                                valueField="BusinessUnitKey"
                                onChange={(value) => { setMainUnitFilter(value) }}
                                placeholder=" -- select --"
                                isValid={selected1 ? selected1?.length > 0 : null}
                            />    
                            </span>
                        </li>
                        <li> 
                            <Label>Sub BU</Label>
                            <span>
                            <Select
                                selected={SubUnitFilter}
                                options={SubUnitFilterList}
                                    labelField="BusinessUnitName"
                                valueField="BusinessUnitKey"
                                onChange={(value) => { setSubUnitFilter(value) }}
                                placeholder=" -- select --"
                                isValid={selected2 ? selected2?.length > 0 : null}
                            /> 
                            </span>
                        </li> 

                        <li> 
                            <Label>Name</Label>
                            <span>
                            <Select
                                selected={selected3}
                                options={[
                                    { label: "Kamal", value: "Kamal" },
                                    { label: "Namal", value: "Namal" },
                                ]}
                                onChange={(value) => { setSelected3(value) }}
                                placeholder=" -- select --"
                                isValid={selected3 ? selected3?.length > 0 : null}
                            />
                            </span>
                        </li> 
                        <li>
                            <FormField inline className="showcase-checkbox"> 
                                <Checkbox checked={modalCheckboxes1.is_active} onChange={(checked) => setModalCheckboxes1({ ...modalCheckboxes1, is_active: checked })} label="Active" />
                            </FormField>
                        </li>
                        <li className="save-list">
                            <Button title="Save" onClick={handleSaveModal3} />
                        </li>
                    </ul>
                </div>
            </Modal>
        </>
    );
};

export default Configuration;




















// import React, { useState } from "react";  
// import { WidgetWrapper, TitleBar, ItemCard, Modal, Input, Checkbox, FormField, Label, Button } from "uxp/components";  

// import { registerWidget, registerLink, registerUI, IContextProvider } from '../uxp';  

// interface IWidgetProps {
//     uxpContext?: IContextProvider,
//     instanceId?: string
// }

// const Configuration: React.FunctionComponent<IWidgetProps> = (props) => { 
//     const [activeItem, setActiveItem] = useState(0);
//     const [showModal1, setShowModal1] = useState(false);
//     const [showModal2, setShowModal2] = useState(false);
//     const [editingRow1, setEditingRow1] = useState<number | null>(null);
//     const [editingRow2, setEditingRow2] = useState<number | null>(null);

//     const [tableData1, setTableData1] = useState([
//         { id: 1, client: 'Pruksha', year: 2025, goal: '2500', long_term: 'No', index: 0 },
//         { id: 2, client: 'Pruksha', year: 2030, goal: '2500', long_term: 'No Active', index: 1 },
//         { id: 3, client: 'Pruksha', year: 2050, goal: '2500', long_term: 'Yes Active', index: 2 },
//     ]);

//     const [tableData2, setTableData2] = useState([
//         { id: 1, client: 'Pruksha', year: 2025, goal: '2500', long_term: 'No', index: 0 },
//         { id: 2, client: 'Pruksha', year: 2030, goal: '2500', long_term: 'No Active', index: 1 },
//         { id: 3, client: 'Pruksha', year: 2050, goal: '2500', long_term: 'Yes Active', index: 2 },
//     ]);

//     const [modalInputValues, setModalInputValues] = useState({ client: "", year: "", goal: "" });
//     const [modalCheckboxes, setModalCheckboxes] = useState({ longTerm: false, active: false });

//     const editClick1 = (rowIndex: number) => {
//         const row = tableData1[rowIndex];
//         setModalInputValues({ client: row.client, year: row.year.toString(), goal: row.goal });
//         setModalCheckboxes({
//             longTerm: row.long_term.includes("Yes"),
//             active: row.long_term.includes("Active"),
//         });
//         setEditingRow1(rowIndex);
//         setShowModal1(true);
//     };

//     const editClick2 = (rowIndex: number) => {
//         const row = tableData2[rowIndex];
//         setModalInputValues({ client: row.client, year: row.year.toString(), goal: row.goal });
//         setModalCheckboxes({
//             longTerm: row.long_term.includes("Yes"),
//             active: row.long_term.includes("Active"),
//         });
//         setEditingRow2(rowIndex);
//         setShowModal2(true);
//     };

//     const handleSaveModal1 = () => {
//         if (editingRow1 !== null) {
//             const updatedData = [...tableData1];
//             updatedData[editingRow1] = {
//                 ...updatedData[editingRow1],
//                 client: modalInputValues.client,
//                 year: parseInt(modalInputValues.year),
//                 goal: modalInputValues.goal,
//                 long_term: `${modalCheckboxes.longTerm ? "Yes" : "No"} ${modalCheckboxes.active ? "Active" : ""}`.trim()
//             };
//             setTableData1(updatedData);
//         }
//         setShowModal1(false);
//     };

//     const handleSaveModal2 = () => {
//         if (editingRow2 !== null) {
//             const updatedData = [...tableData2];
//             updatedData[editingRow2] = {
//                 ...updatedData[editingRow2],
//                 client: modalInputValues.client,
//                 year: parseInt(modalInputValues.year),
//                 goal: modalInputValues.goal,
//                 long_term: `${modalCheckboxes.longTerm ? "Yes" : "No"} ${modalCheckboxes.active ? "Active" : ""}`.trim()
//             };
//             setTableData2(updatedData);
//         }
//         setShowModal2(false);
//     };

//     const handleItemClick = (index: number) => {
//         setActiveItem(index);
//     };

//     const renderTableData = (data: any[], editClick: (rowIndex: number) => void) => {
//         return (
//             <div className="data-list-container has-footer">
//                 <div className="data-list">
//                     <table className="data-table">
//                         <thead>
//                             <tr>
//                                 <th>Client</th>
//                                 <th>Year</th>
//                                 <th>Goal</th>
//                                 <th>Long Term</th>
//                                 <th></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data.map(({ id, client, year, goal, long_term }, index) => (
//                                 <tr key={id} className="data-list-item">
//                                     <td><div className="item-card">{client}</div></td>
//                                     <td><div className="item-card">{year}</div></td>
//                                     <td><div className="item-card">{goal} kgCO2e</div></td>
//                                     <td><div className="item-card">{long_term}</div></td>
//                                     <td>
//                                         <div className="item-card">
//                                             <div className="edit-icon" onClick={() => editClick(index)}></div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     };

//     const renderContent = () => {
//         switch (activeItem) {
//             case 0: return <div style={{marginTop:"2em"}}>{renderTableData(tableData1, editClick1)}</div>;
//             case 1: return (
//                 <div style={{marginTop:"2em"}}>
//                     {renderTableData(tableData2, editClick2)}
//                 </div>
//             );
//             case 2: return (
//                 <div className="baseline-content" style={{marginTop:"2em"}}>
//                 <FormField className="no-padding mb-only">
//                     <div className="baseline-list">
//                         <Label>Client</Label>
//                         <span>
//                             <Input type="text" value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
//                         </span>
//                     </div>
//                     <div className="baseline-list">
//                         <Label>Baseline Year</Label>
//                         <span>
//                             <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
//                         </span>
//                     </div>
//                     <div className="baseline-list" style={{ float: "right", width: "87%" }}>
//                         <Button title="Save" onClick={() => alert("clicked")} />
//                     </div>
//                 </FormField>
//             </div>
//         );
//         default: return null;


//         }
//     };

//     return (
//         <>
//             <WidgetWrapper>
//                 <TitleBar title="Configuration" />
//                 <div className="configuration-overall">
//                     <div className="configuration-sidebar"> 
//                         <div className={`sidebar-list ${activeItem === 0 ? 'active' : ''}`} onClick={() => handleItemClick(0)}>Carbon Goals</div>  
//                         <div className={`sidebar-list ${activeItem === 1 ? 'active' : ''}`} onClick={() => handleItemClick(1)}>Business as Usual</div>  
//                         <div className={`sidebar-list ${activeItem === 2 ? 'active' : ''}`} onClick={() => handleItemClick(2)}>Carbon Baselines</div>  
//                     </div>
//                     <div className="content">{renderContent()}</div>
//                 </div>
//             </WidgetWrapper>

//             {/* Modal for Editing Table 1 */}
//             <Modal title="Edit Carbon Goal" className="congig-popup" show={showModal1} onClose={() => setShowModal1(false)}>
                
// <div className="congig-popup-cont">
//                      <ul>
//                          <li>
//                              <Label>Client</Label>
//                              <span>
//                                  <Input value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
//                              </span>
//                          </li>
//                          <li>
//                              <Label>Year</Label>
//                              <span>
//                                  <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
//                              </span>
//                          </li>
//                          <li>
//                              <Label>Goal</Label>
//                              <span>
//                                  <Input type="number" value={modalInputValues.goal} onChange={(val) => setModalInputValues({ ...modalInputValues, goal: val })} />
//                              </span>
//                          </li>
//                          <li>
//                              <FormField inline className="showcase-checkbox">
//                                  <Checkbox checked={modalCheckboxes.longTerm} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, longTerm: checked })} label="Long Term" />
//                                  <Checkbox checked={modalCheckboxes.active} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, active: checked })} label="Active" />
//                              </FormField>
//                          </li>
//                          <li className="save-list">
//                              <Button title="Save" onClick={handleSaveModal1} />
//                          </li>
//                      </ul>
//                  </div>

//             </Modal>

//             {/* Modal for Editing Table 2 */}
//             <Modal title="Edit Business Goal" className="congig-popup" show={showModal2} onClose={() => setShowModal2(false)}>
//             <div className="congig-popup-cont">
//                      <ul>
//                          <li>
//                              <Label>Client</Label>
//                              <span>
//                                  <Input value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
//                              </span>
//                          </li>
//                          <li>
//                              <Label>Year</Label>
//                              <span>
//                                  <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
//                              </span>
//                          </li>
//                          <li>
//                              <Label>Goal</Label>
//                              <span>
//                                  <Input type="number" value={modalInputValues.goal} onChange={(val) => setModalInputValues({ ...modalInputValues, goal: val })} />
//                              </span>
//                          </li>
//                          <li>
//                              <FormField inline className="showcase-checkbox">
//                                  <Checkbox checked={modalCheckboxes.longTerm} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, longTerm: checked })} label="Long Term" />
//                                  <Checkbox checked={modalCheckboxes.active} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, active: checked })} label="Active" />
//                              </FormField>
//                          </li>
//                          <li className="save-list">
//                              <Button title="Save" onClick={handleSaveModal2} />
//                          </li>
//                      </ul>
//                  </div>
//             </Modal>
//         </>
//     );
// };

// export default Configuration;
