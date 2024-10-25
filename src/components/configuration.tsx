import React, { useState } from "react";  
import { WidgetWrapper, TitleBar, ItemCard, Modal, Input, Checkbox, FormField, Label, Button } from "uxp/components";  

import { registerWidget, registerLink, registerUI, IContextProvider } from '../uxp';  

interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
}

const Configuration: React.FunctionComponent<IWidgetProps> = (props) => { 
    const [activeItem, setActiveItem] = useState(0);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [editingRow1, setEditingRow1] = useState<number | null>(null);
    const [editingRow2, setEditingRow2] = useState<number | null>(null);

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

    const [modalInputValues, setModalInputValues] = useState({ client: "", year: "", goal: "" });
    const [modalCheckboxes, setModalCheckboxes] = useState({ longTerm: false, active: false });

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
        </>
    );
};

export default Configuration;
























// import React, { useState } from "react";  
// import { WidgetWrapper, TitleBar, DataTable, ItemCard, Modal, Input, Checkbox, FormField, Label, Button } from "uxp/components";  

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

//     let [inputValue, setInputValue] = React.useState<string | null>("");

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
//             <>
//             <DataTable
//                 data={() => new Promise(resolve => resolve({ items: data, pageToken: "" }))}
//                 pageSize={5}
//                 columns={[
//                     { title: "Client", width: "20%", renderColumn: (item) => <ItemCard item={item} subTitleField="client" /> },
//                     { title: "Year", width: "20%", renderColumn: (item) => <ItemCard item={item} subTitleField="year" /> },
//                     { title: "Goal", width: "30%", renderColumn: (item) => <ItemCard item={{ ...item, goal: `${item.goal} kgCO2e` }} subTitleField="goal" /> },
//                     { title: "Long Term", width: "20%", renderColumn: (item) => <ItemCard item={{ ...item, long_term: `${item.long_term}` }} subTitleField="long_term" /> },
//                     {
//                         title: "",
//                         width: "10%",
//                         renderColumn: (item) => (
//                             <div className="edit-icon" onClick={() => editClick(item.index)}> 
//                             </div>
//                         )
//                     }
//                 ]}
//             />

//             <div className="data-list-container has-footer">
//                 <div className="data-list">
//                         <table className="data-table">
//                 <thead>
//                     <tr>
//                         <th>Client</th>
//                         <th>Year</th>
//                         <th>Goal</th>
//                         <th>Long Term</th>
//                         <th></th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tableData1.map(({ id, client, year, goal, long_term }, index) => (
//                         <tr key={id} className="data-list-item">
//                             <td>
//                                 <div className="item-card">{client}</div>
//                             </td>
//                             <td>
//                                 <div className="item-card">{year}</div>
//                             </td>
//                             <td>
//                                 <div className="item-card">{goal} kgCO2e</div>
//                             </td>
//                             <td>
//                                 <div className="item-card">{long_term}</div>
//                             </td>
//                             <td>
//                                 <div className="item-card">
//                                     <div className="edit-icon"  onClick={() => editClick(index)}></div>
//                                 </div>
//                             </td>
                            
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             </div> 
//             </div>
// </>
//         );
//     };

//     const renderContent = () => {
//         switch (activeItem) {
//             case 0: return <div style={{marginTop:"2em"}}>{renderTableData(tableData1, editClick1)}</div>;
//             case 1: return (
//                 <div  style={{marginTop:"2em"}}>
//                     <div className="business-top-list">
//                         <Label>Business growth % (AVG) p.a.</Label>

//                         <span style={{width:"35%", margin:"0 2% 0 0%"}}>
//                         <Input
//                                     type="number"
//                                     value={inputValue}
//                                     onChange={(value) => { setInputValue(value) }}
//                                     isValid={inputValue ? inputValue.trim().length > 0 : null}
                                    
//                                     placeholder="10%"
//                                 />
//                         </span>
//                         <span style={{width:"30%", marginTop:"0.5em"}}>
//                             <Button className="calculate-btn" title="Calculate Business as usual" onClick={() => alert("clicked")} />
//                         </span>
//                     </div>
//                     {renderTableData(tableData2, editClick2)}
//                 </div>
//             );
//             case 2: return (
//                 <div className="baseline-content" style={{marginTop:"2em"}}>
//                     <FormField className="no-padding mb-only">
//                         <div className="baseline-list">
//                             <Label>Client</Label>
//                             <span>
//                                 <Input type="text" value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
//                             </span>
//                         </div>
//                         <div className="baseline-list">
//                             <Label>Baseline Year</Label>
//                             <span>
//                                 <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
//                             </span>
//                         </div>
//                         <div className="baseline-list" style={{ float: "right", width: "87%" }}>
//                             <Button title="Save" onClick={() => alert("clicked")} />
//                         </div>
//                     </FormField>
//                 </div>
//             );
//             default: return null;
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
//                 <div className="congig-popup-cont">
//                     <ul>
//                         <li>
//                             <Label>Client</Label>
//                             <span>
//                                 <Input value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
//                             </span>
//                         </li>
//                         <li>
//                             <Label>Year</Label>
//                             <span>
//                                 <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
//                             </span>
//                         </li>
//                         <li>
//                             <Label>Goal</Label>
//                             <span>
//                                 <Input type="number" value={modalInputValues.goal} onChange={(val) => setModalInputValues({ ...modalInputValues, goal: val })} />
//                             </span>
//                         </li>
//                         <li>
//                             <FormField inline className="showcase-checkbox">
//                                 <Checkbox checked={modalCheckboxes.longTerm} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, longTerm: checked })} label="Long Term" />
//                                 <Checkbox checked={modalCheckboxes.active} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, active: checked })} label="Active" />
//                             </FormField>
//                         </li>
//                         <li className="save-list">
//                             <Button title="Save" onClick={handleSaveModal1} />
//                         </li>
//                     </ul>
//                 </div>
//             </Modal>

//             {/* Modal for Editing Table 2 */}
//             <Modal title="Edit Business Goal" className="congig-popup" show={showModal2} onClose={() => setShowModal2(false)}>
//                 <div className="congig-popup-cont">
//                     <ul>
//                         <li>
//                             <Label>Client</Label>
//                             <span>
//                                 <Input value={modalInputValues.client} onChange={(val) => setModalInputValues({ ...modalInputValues, client: val })} />
//                             </span>
//                         </li>
//                         <li>
//                             <Label>Year</Label>
//                             <span>
//                                 <Input type="number" value={modalInputValues.year} onChange={(val) => setModalInputValues({ ...modalInputValues, year: val })} />
//                             </span>
//                         </li>
//                         <li>
//                             <Label>Goal</Label>
//                             <span>
//                                 <Input type="number" value={modalInputValues.goal} onChange={(val) => setModalInputValues({ ...modalInputValues, goal: val })} />
//                             </span>
//                         </li>
//                         <li>
//                             <FormField inline className="showcase-checkbox">
//                                 <Checkbox checked={modalCheckboxes.longTerm} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, longTerm: checked })} label="Long Term" />
//                                 <Checkbox checked={modalCheckboxes.active} onChange={(checked) => setModalCheckboxes({ ...modalCheckboxes, active: checked })} label="Active" />
//                             </FormField>
//                         </li>
//                         <li className="save-list">
//                             <Button title="Save" onClick={handleSaveModal2} />
//                         </li>
//                     </ul>
//                 </div>
//             </Modal>
//         </>
//     );
// };

// export default Configuration;



 