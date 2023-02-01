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

import React, { useState, useEffect,useRef } from 'react'

// let profileData = localStorage.getItem("priyam-store") ?? [];
// profileData = JSON.parse(profileData);
// let profileName = profileData.name ?? 'User name';

const navbarValuesArray = [
  {
    ITEM: [{ name: 'Inventory', url: '/label', icon: 'images/inventory.svg' }, { name: 'Shortage Items', url: '/label', icon: 'images/shortage.svg' },
    { name: 'Expired Items', url: '/label', icon: 'images/expired.svg' }, { name: 'Item Labels', url: '/label', icon: 'images/label.svg' }
    ]
  },
  {
    BILL: [{ name: 'All Bills', url: '/label', icon: 'images/bill.svg' }, { name: 'Day Bills', url: '/label', icon: 'images/dailybills.svg' },
    { name: 'Reports', url: '/label', icon: 'images/report.svg' }
    ]
  },
  {
    STAFF: [{ name: 'Open Close', url: '/label', icon: 'images/openclose.svg' },
    { name: 'Attendance', url: '/label', icon: 'images/attendance.svg' }, { name: 'Profile (New)', url: '/label', icon: 'images/profile.svg' }
    ]
  },
  {
    PURCHASE: [
      { name: 'Purchase Order', url: '/label', icon: 'images/purchaseorder.svg' },
      { name: 'Saved POs', url: '/label', icon: 'images/savedpurchaseorder.svg' },
      { name: 'Drafted POs', url: '/label', icon: 'images/draftpurchaseorder.svg' },
      { name: 'Approved POs', url: '/label', icon: 'images/approvedpurchaseorder.svg' },
      { name: 'Rejected POs', url: '/label', icon: 'images/rejectpurchaseorder.svg' }
    ]
  }
]
// const navbarValuesArray = [
//   {
//     ITEM: [{ 'Inventory': '/label' }, { 'Shortage Items': '/label' }, { 'Expired Items': '/label' }, { 'Item Labels': '/label' }]
//   },
//   { BILL: [{ 'All Bills': '/label' }, { 'Day Bills': '/label' }, { 'Reports': '/label' }] },
//   { STAFF: [{ 'Open Close': '/label' }, { 'Attendance': '/label' }, { 'Profile (New)': '/label' }] },
//   {
//     PURCHASE: [
//       { 'Purchase Order': '/label' },
//       { 'Saved POs': '/label' },
//       { 'Drafted POs': '/label' },
//       { 'Approved POs': '/label' },
//       { 'Rejected POs': '/label' }
//     ]
//   }
// ];
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
        <img src="images/hamburger.svg" width={25} height={25} className='hamburger-menu' onClick={() => handleToggle("sidebar")} />
        {/* <h3>{profileName}</h3> */}
        <h3 className='user-name'>Sachin Rawat</h3>
      </div>
      <input type="text" name="search" id="search-input" placeholder='Search' />
      <button className="billing">Billing</button>
      <div>
        <div>
          {/* <nav id="small-sidebar">
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
        </nav> */}
        </div>
        <nav id="sidebar">
          {/* <div style={{ width: "100%", marginTop: "2rem" }}>
            <input placeholder='search' className='search-bar' value={value} />
          </div> */}
          <ul className='list'>

            <div >
              {
                navbarValuesArray.map(item => {
                  for (const key in item) {
                    const value = item[key];
                    return (
                      <div >
                        <p className="main-link headers" onClick={() => handleToggle(`${key}`)}>{key}</p>

                        <div className="sub-menu">
                          <ul id={key}>
                            {
                              value.map(subItem => {
                                return (

                                  <li>
                                    <img src={`${subItem.icon}`} width={20} height={20} title={`${subItem.name}`} />
                                    <a href={`${subItem.url}`} className='headers-list'>{subItem.name}</a>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>

                      </div>

                    )

                  }
                })
              }
            </div>
            {/* <div>
              <li><a href="#contact" class="main-link logout " style={{ color: "white" }}> LOGOUT</a></li>
            </div> */}
          </ul>
        </nav>
      </div>
      <button className="logout">Logout</button>
    </div >
  )
}

export default Header