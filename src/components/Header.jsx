import React, { useState, useEffect } from 'react'
import { sidebarListData } from '../constants/HeaderTypes';
import { Link } from 'react-router-dom';

const handleToggle = (id) => {
  let toggledElement = document.getElementById(`linkContainer${id}`);

  // Closing and opening links on title click
  toggledElement.style.display = toggledElement.style.display === "none" ? "block" : "none";
}
function searchSidebarListData(searchTerm) {
  const results = [];

  sidebarListData.forEach(item => {
    const subItems = [];
    Object.values(item)[0].forEach(subItem => {
      if (subItem.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        subItems.push(subItem);
      }
    });
    if (subItems.length > 0) {
      results.push({ [Object.keys(item)[0]]: subItems });
    }
  });

  return results;
}
function Header() {

  const [value, setValue] = useState('')
  const [filterData, setFilterData] = useState([]);
  const setInputValue = (e) => {
    setValue(e.target.value);
  }
  let searchSidebarFilterListData
  useEffect(() => {
    searchSidebarFilterListData = searchSidebarListData(value);
    setFilterData(searchSidebarFilterListData);
    console.log('chal rha he')
    //   searchSidebarFilterListData.forEach(item => {
    //     console.log(Object.keys(item)[0]);
    //     console.log(Object.values(item)[0]);
    // })
  }, [value])

  return (
    <div id='main-box-container'>
      <div className='profileName'>
        <img src="images/hamburger.svg" width={25} height={25} className='hamburger-menu' alt="" />
        <h3 className='user-name'>Sachin Rawat</h3>
      </div>

      {/* Search Input */}
      <input type="text" name="search" id="search-input" placeholder='Search' value={value} onChange={(e) => setInputValue(e)} />

      {/* Billing Button */}
      <button className="billing">Billing</button>

      <nav className="sidebar">
        {
          value === '' ? (sidebarListData.map((item, index) => {
            const [itemKey, itemValue] = Object.entries(item)[0];
            return (
              <div key={index} className="links-container">
                {/* Main Title */}
                <p className="main-link headers" onClick={() => handleToggle(index)}>{itemKey}</p>

                {/* Link Items */}
                <ul id={`linkContainer${index}`}>
                  {itemValue.map((subItem, index) => {
                    return (
                      <li key={index}>
                        <img src={`${subItem.icon}`} width={20} height={20} title={`${subItem.name}`} alt="" />
                        <Link to={`${subItem.url}`} className='headers-list'>{subItem.name}</Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })) : (

            filterData.forEach(item => {
              console.log('chal rha')
              console.log(Object.keys(item)[0]);
              Object.values(item)[0].map((subItem, index) => {
                return (
                  <ul>
                    <li key={index}>
                      <img src={`${subItem.icon}`} width={20} height={20} title={`${subItem.name}`} alt="" />
                      <Link to={`${subItem.url}`} className='headers-list'>{subItem.name}</Link>
                    </li>
                  </ul>
                )
              })
            })
          )
        }
      </nav>

      {/* Logout Button */}
      <button className="logout">Logout</button>
    </div >
  )
}

export default Header