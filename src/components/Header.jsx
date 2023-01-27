// import React from "react";
// import { Menu, Button, Text } from '@mantine/core';
// // import { SegmentedControl, Badge, Avatar, Text } from "@mantine/core";
// import { PAGES } from "../constants/HeaderTypes";

// const Header = ({
//   staffName,
//   staffUserName,
//   showBill,
//   value,
//   logoutUser,
//   setValue,
// }) => {
//   const handleValue=(e)=>{
//     console.log(e.target.value)
//   }
//   return (
//     <div>
//       {staffName && staffUserName && !showBill && (
//         <div className="nav-btn">
//           {/* <SegmentedControl
//             value={value}
//             onChange={setValue}
//             color="blue"
//             radius="md"
//             size="md"
//             data={Object.keys(PAGES).map((page) => ({
//               label: PAGES[page],
//               value: page,
//             }))}
//           /> */}
//           <Menu shadow="md" width={200}>
//             <Menu.Target>
//               <Button>More menu</Button>
//             </Menu.Target>

//             <Menu.Dropdown>
//               <Menu.Label >Application</Menu.Label>
//               <Menu.Item >Attendance</Menu.Item>
//               <Menu.Item >Approval</Menu.Item>
//               <Menu.Item >Expired Items</Menu.Item>
//               <Menu.Item value={`label`} onClick={(e)=>handleValue(e)}>Label</Menu.Item>

//             </Menu.Dropdown>
//           </Menu>
//           {/* <Badge
//             sx={{ paddingLeft: 0 }}
//             size="xl"
//             radius="lg"
//             color="dark"
//             className="logout-btn"
//             leftSection={
//               <Avatar
//                 alt="Avatar for badge"
//                 size={34}
//                 mr={5}
//                 src="image-link"
//               />
//             }
//           >
//             <Text fz="xl" style={{ margin: "10px 0px -10px 0px" }}>
//               {staffUserName}
//             </Text>
//             <Text fz="sm" style={{ marginBottom: "10px" }} onClick={logoutUser}>
//               Logout
//             </Text>
//           </Badge> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;

import React from 'react'
import '../CSS/Header.css'
function Header() {
  const handleToggle = (id) => {
    console.log(id);
    let toggledElement = document.getElementById(id);
    if (toggledElement.style.display === "none") {
      toggledElement.style.display = "block";
    } else {
      toggledElement.style.display = "none";
    }
  }
  return (
    <div id='main-box-container'>
      <div class="hamburger" onClick={() => handleToggle("sidebar")}>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <nav id="sidebar">
        <div className='box'></div>
        <ul className='list'>
          <li><a href="#Billing" class="main-link">Billing</a></li>
          <li>
            <a href="#ITEM Pages" class="main-link" onClick={() => handleToggle("itemPages")}>ITEM Pages</a>
            <ul class="sub-menu" id="itemPages">
              <li><a href="#Inventory">Inventory</a></li>
              <li><a href="#Shortage Items">Shortage Items</a></li>
              <li><a href="#Expired Items">Expired Items</a></li>
              <li><a href="#Item Labels">Item Labels</a></li>
            </ul>
          </li>
          <li>
            <a href="#BILL Pages" class="main-link" onClick={() => handleToggle("billPages")}>BILL Pages</a>
            <ul class="sub-menu" id="billPages">
              <li><a href="#All Bills">All Bills</a></li>
              <li><a href="#Day Bills">Day Bills</a></li>
              <li><a href="#Reports">Reports</a></li>
            </ul>
          </li>
          <li>
            <a href="#STAFF Pages" class="main-link" onClick={() => handleToggle("staffPages")}>STAFF Pages</a>
            <ul class="sub-menu" id="staffPages">
              <li><a href="#Open Close">Open Close</a></li>
              <li><a href="#Attendance">Attendance</a></li>
              <li><a href="#Profile (New)">Profile (New)</a></li>
            </ul>
          </li>
          <li>
            <a href="# PURCHASE Pages" class="main-link" onClick={() => handleToggle("purchasePages")}> PURCHASE Pages</a>
            <ul class="sub-menu" id="purchasePages">
              <li><a href="#Purchase Order">Purchase Order</a></li>
              <li><a href="#Saved POs">Saved POs</a></li>
              <li><a href="#Drafted POs">Drafted POs</a></li>
              <li><a href="#Approved POs">Approved POs</a></li>
              <li><a href="#Rejected POs">Rejected POs</a></li>
            </ul>
          </li>
          <li><a href="#contact" class="main-link"> LOGOUT</a></li>
        </ul>
      </nav>

    </div>
  )
}

export default Header