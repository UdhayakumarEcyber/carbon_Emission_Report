import React, { useState } from "react";
import { WidgetWrapper, TitleBar, DataTable, ItemCard } from "uxp/components";
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #111;
  color: white;
  height: 100vh;
  padding: 1em;
`;

const SidebarItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 16px;
`;

// Mock Data for Tables with updated goal and long_term content
const tableData1 = [
  { id: 1, client: 'Pruksha', year: 2025, goal: '2500', long_term: 'No', edit: '2024-01-01' },
  { id: 2, client: 'Pruksha', year: 2030, goal: '2500', long_term: 'No Active', edit: '2024-01-02' },
  { id: 3, client: 'Pruksha', year: 2050, goal: '2500', long_term: 'Yes Active', edit: '2024-01-02' }
];

// Main Component
const Configuration: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0); // Track the selected sidebar item

  const handleItemClick = (index: number) => {
    setActiveItem(index); // Update active item when a sidebar item is clicked
  };

  const renderTableData = (data: any[]) => {
    return (
      <DataTable
        data={() =>
          new Promise(resolve => resolve({ items: data, pageToken: "" }))
        }
        pageSize={5}
        columns={[
          {
            title: "Client",
            width: "20%",
            renderColumn: item => <ItemCard item={item} subTitleField="client" className="data-table-item" />
          },
          {
            title: "Year",
            width: "20%",
            renderColumn: item => <ItemCard item={item} subTitleField="year" className="data-table-item" />
          },
          {
            title: "Goal",
            width: "20%",
            renderColumn: item => (
              <ItemCard
                item={{ ...item, goal: `${item.goal} kgCO2e` }} // Append 'kgCO2e' to the goal value
                subTitleField="goal"
                className="data-table-item"
              />
            )
          },
          {
            title: "Long Term",
            width: "20%",
            renderColumn: item => (
              <ItemCard
                item={{ ...item, long_term: `${item.long_term}` }} // Display long_term as is
                subTitleField="long_term"
                className="data-table-item"
              />
            )
          },
          {
            title: "Edit Date",
            width: "20%",
            renderColumn: item => <ItemCard item={item} subTitleField="edit" className="data-table-item" />
          }
        ]}
      />
    );
  };

  const renderContent = () => {
    switch (activeItem) {
      case 0:
        return (
          <div>
            <h2>Table for Item 1</h2>
            {renderTableData(tableData1)} {/* Table for Item 1 */}
          </div>
        );
      case 1:
        return (
          <div>
            <h2>Content for Item 2</h2>
            <p>This is some descriptive content for Item 2.</p>
            <h2>Table for Item 2</h2>
            {renderTableData(tableData1)} {/* Table + Content for Item 2 */}
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Content for Item 3</h2>
            <p>This is some detailed content for Item 3 without a table.</p> {/* Only Content for Item 3 */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <WidgetWrapper>
      <TitleBar title="Sidebar with Tables and Content" />
      <Container>
        {/* Sidebar */}
        <Sidebar>
          <SidebarItem onClick={() => handleItemClick(0)}>Item 1</SidebarItem>
          <SidebarItem onClick={() => handleItemClick(1)}>Item 2</SidebarItem>
          <SidebarItem onClick={() => handleItemClick(2)}>Item 3</SidebarItem>
        </Sidebar>

        {/* Content */}
        <Content>
          {renderContent()} {/* Render table or content based on the active sidebar item */}
        </Content>
      </Container>
    </WidgetWrapper>
  );
};

export default Configuration;
 






// import React, { useState } from "react";
// import { WidgetWrapper, TitleBar, DataTable } from "uxp/components";
// import styled from 'styled-components';

// const Container = styled.div`
//   display: flex;
// `;

// interface SidebarProps {
//   open: boolean;
// }

// const Sidebar = styled.div<SidebarProps>`
//   width: ${props => (props.open ? '250px' : '0')};
//   transition: 0.3s;
//   overflow: hidden;
//   background-color: #111;
//   color: white;
//   height: 100vh;
// `;

// interface ContentProps {
//   open: boolean;
// }

// const Content = styled.div<ContentProps>`
//   flex-grow: 1;
//   padding: 16px;
//   transition: margin-left 0.3s;
//   margin-left: ${props => (props.open ? '250px' : '0')};
// `;

// interface ToggleButtonProps {
//   open: boolean;
// }

// const ToggleButton = styled.button<ToggleButtonProps>`
//   position: absolute;
//   top: 16px;
//   left: ${props => (props.open ? '250px' : '0')};
//   transition: left 0.3s;
// `;

// const items = [
//   { id: 1, name: 'Item 1', content: 'Content for Item 1' },
//   { id: 2, name: 'Item 2', content: 'Content for Item 2' },
//   { id: 3, name: 'Item 3', content: 'Content for Item 3' },
// ];

// const Configuration: React.FunctionComponent = (props) => {
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   const toggleSidebar = () => {
//     setOpen(!open);
//   };

//   const selectItem = (item:any) => {
//     setSelectedItem(item);
//   };

//   return (
//     <WidgetWrapper>
//       <TitleBar title='Configuration' />
//       <Container className="configuration-overall">
//         <Sidebar open={open}>
//           <h2>Sidebar</h2>
//           <ul>
//             {items.map(item => (
//               <li key={item.id} onClick={() => selectItem(item)}>
//                 {item.name}
//               </li>
//             ))}
//           </ul>
//         </Sidebar>
//         <ToggleButton open={open} onClick={toggleSidebar}>
//           {open ? '<' : '>'}
//         </ToggleButton>
//         <Content open={open}>
//           {selectedItem ? (
//             <div>
//               <h2>{selectedItem.name}</h2>
//               <p>{selectedItem.content}</p>
//             </div>
//           ) : (
//             <p>Please select an item from the sidebar</p>
//           )}
//         </Content>
//       </Container>
//     </WidgetWrapper>
//   );
// };

// export default Configuration;
