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

import React, { useState, useEffect } from 'react'
import '../CSS/Header.css'

let profileData = localStorage.getItem("priyam-store");
profileData = JSON.parse(profileData);
let profileName = profileData.name;
const navbarValuesArray = [
  {
    ITEM: [{ 'Inventory': '/label' }, { 'Shortage Items': '/label' }, { 'Expired Items': '/label' }, { 'Item Labels': '/label' }]
  },
  { BILL: [{ 'All Bills': '/label' }, { 'Day Bills': '/label' }, { 'Reports': '/label' }] },
  { STAFF: [{ 'Open Close': '/label' }, { 'Attendance': '/label' }, { 'Profile (New)': '/label' }] },
  {
    PURCHASE: [
      { 'Purchase Order': '/label' },
      { 'Saved POs': '/label' },
      { 'Drafted POs': '/label' },
      { 'Approved POs': '/label' },
      { 'Rejected POs': '/label' }
    ]
  }
];
// const searchNavbarValues = (navbarValuesArray, searchTerm) => {
//   return navbarValuesArray.filter(obj => {
//     const [key, values] = Object.entries(obj)[0];
//     return values.some(value => {
//   const [name, /label] = Object.entries(value)[0];
//   name.toLowerCase().includes(searchTerm.toLowerCase())
// });
//   });
// };
function Header() {

  const [value, setValue] = useState('');
  // const [searchResult,setSearchResult]=useState([])
  const handleToggle = (id) => {
    let toggledElement = document.getElementById(id);
    if (toggledElement.style.display === "none") {
      toggledElement.style.display = "block";
    } else {
      toggledElement.style.display = "none";
    }
  }
  //   const navbarValues={
  //   item:["Inventory","Shortage Items" ,"Expired Items","Item Labels"],bill:["All Bills","Day Bills","Reports"],
  //   staff:["Open Close","Attendance","Profile (New)"],purchase:["Purchase Order","Saved POs","Drafted POs","Approved POs","Rejected POs"]
  // }



  // const searchResult = searchNavbarValues(navbarValuesArray, 'report');

  // useEffect(() => {

  // const searchResult = searchNavbarValues(navbarValuesArray, '');

  // }, [value])

  // console.log(Object.entries(navbarValues))
  return (
    <div id='main-box-container'>
      <div className='profileName'>
        <img src="images/hamburger.svg" width={20} height={20} className='hamburger-menu' onClick={() => handleToggle("sidebar")} />
        <h3>{profileName}</h3>
      </div>
      <div>
        <nav id="small-sidebar">
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "2rem" }}>
            <div className='img-container'><img src="images/Billing.svg" width={10} height={10} alt="billing" title="Billing" /><span className='img-title'>Billing</span></div>
            <div className='img-container'><img src="images/inventory.svg" width={20} height={20} alt="inventory" title='Inventory' /><span className='img-title'>Inventory</span></div>
            <div className='img-container'><img src="images/shortage.svg" width={20} height={20} alt="shortage" title='Shortage' /><span className='img-title'>Shortage</span></div>
            <div className='img-container'><img src="images/expired.svg" width={20} height={20} alt="expiredItem" /><span className='img-title'>Expired</span></div>
            <div className='img-container'><img src="images/label.svg" width={20} height={20} alt="labelItem" /><span className='img-title'>Label</span></div>
            <div className='img-container'><img src="images/bill.svg" width={20} height={20} alt="allBill" /><span className='img-title'>Bills</span></div>
            <div className='img-container'><img src="images/report.svg" width={20} height={20} alt="report" /><span className='img-title'>Report</span></div>
            <div className='img-container'><img src="images/openclose.svg" width={20} height={20} alt="openclose" /><span className='img-title'>OpenClose</span></div>
            <div className='img-container'><img src="images/attendance.svg" width={20} height={20} alt="attendance" /><span className='img-title'>Attendance</span></div>
            <div className='img-container'><img src="images/profile.svg" width={20} height={20} alt="profile" /><span className='img-title'>Profile</span></div>
            <div className='img-container'><img src="images/purchaseorder.svg" width={20} height={20} alt="purchaseorder" /><span className='img-title'>Order</span></div>
            <div className='img-container'><img src="images/savedpurchaseorder.svg" width={20} height={20} alt="savedpurchaseorder" /><span className='img-title'>SavedOrder</span></div>
            <div className='img-container'><img src="images/draftpurchaseorder.svg" width={20} height={20} alt="draftpurchaseorder" /><span className='img-title'>Draft</span></div>
            <div className='img-container'><img src="images/approvedpurchaseorder.svg" width={20} height={20} alt="approvedpurchaseorder" /><span className='img-title'>Approved</span></div>
            <div className='img-container'><img src="images/rejectpurchaseorder.svg" width={20} height={20} alt="rejectpurchaseorder" /><span className='img-title'>Reject</span></div>
          </div>
        </nav>
        <nav id="sidebar">
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <input placeholder='search' className='search-bar' value={value} />
          </div>
          <ul className='list'>
            <div>
              <li><a className="main-link billing " style={{ color: "white" }}>Billing</a></li>
            </div>
            {/* <li className='itempages' style={{marginTop:"3.5rem"}}>
            <a  className="main-link headers" onClick={() => handleToggle("itemPages")}>ITEM</a>
            <ul class="sub-menu" id="itemPages">
              <li><a href="#Inventory" className='headers-list'>Inventory</a></li>
              <li><a href="#Shortage Items" className='headers-list'>Shortage Items</a></li>
              <li><a href="#Expired Items" className='headers-list'>Expired Items</a></li>
              <li><a href="#Item Labels" className='headers-list'>Item Labels</a></li>
            </ul>
          </li>
          <li>
            <a  className="main-link headers" onClick={() => handleToggle("billPages")}>BILL</a>
            <ul className="sub-menu" id="billPages">
              <li><a href="#All Bills" className='headers-list'>All Bills</a></li>
              <li><a href="#Day Bills" className='headers-list'>Day Bills</a></li>
              <li><a href="#Reports" className='headers-list'>Reports</a></li>
            </ul>
          </li>
          <li>
            <a  className="main-link headers" onClick={() => handleToggle("staffPages")}>STAFF</a>
            <ul class="sub-menu" id="staffPages">
              <li><a href="#Open Close" className='headers-list'>Open Close</a></li>
              <li><a href="#Attendance" className='headers-list'>Attendance</a></li>
              <li><a href="#Profile (New)" className='headers-list'>Profile (New)</a></li>
            </ul>
          </li>
          <li>
            <a  className="main-link headers" onClick={() => handleToggle("purchasePages")}> PURCHASE</a>
            <ul class="sub-menu" id="purchasePages">
              <li><a href="#Purchase Order" className='headers-list'>Purchase Order</a></li>
              <li><a href="#Saved POs" className='headers-list'>Saved POs</a></li>
              <li><a href="#Drafted POs" className='headers-list'>Drafted POs</a></li>
              <li><a href="#Approved POs" className='headers-list'>Approved POs</a></li>
              <li><a href="#Rejected POs" className='headers-list'>Rejected POs</a></li>
            </ul>
          </li> */}
            <div style={{ marginTop: "3.5rem" }}>
              {
                navbarValuesArray.map(obj => {
                  const [key, values] = Object.entries(obj)[0];
                  return (
                    <li >
                      <a className="main-link headers" onClick={() => handleToggle(`${key}`)}>{key}</a>
                      <ul class="sub-menu" id={key}>
                        {
                          values.map(value => {
                            const [name, path] = Object.entries(value)[0];
                            return (
                              <li><a href={`${path}`} className='headers-list'>{name}</a></li>
                            )
                          })
                        }
                      </ul>
                    </li>
                  );
                })
              }
            </div>
            <div>
              <li><a href="#contact" class="main-link logout " style={{ color: "white" }}> LOGOUT</a></li>
            </div>
          </ul>
        </nav>
      </div>
    </div >
  )
}

export default Header