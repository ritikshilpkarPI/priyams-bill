import React from 'react'
import { sidebarListData } from '../constants/HeaderTypes';
import { Link } from 'react-router-dom';

function Header() {
   const handleToggle = (id) => {
      let toggledElement = document.getElementById(`linkContainer${id}`);

      // Closing and opening links on title click
      toggledElement.style.display = toggledElement.style.display === "none" ? "block" : "none";
   }

   return (
      <div id='main-box-container'>
         <div className='profileName'>
            <img src="images/hamburger.svg" width={25} height={25} className='hamburger-menu' />
            <h3 className='user-name'>Sachin Rawat</h3>
         </div>

         {/* Search Input */}
         <input type="text" name="search" id="search-input" placeholder='Search' />

         {/* Billing Button */}
         <button className="billing">Billing</button>

         <nav className="sidebar">
            {sidebarListData.map((item, index) => {
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
                                 <img src={`${subItem.icon}`} width={20} height={20} title={`${subItem.name}`} />
                                 <Link to={`${subItem.url}`} className='headers-list'>{subItem.name}</Link>
                              </li>
                           )
                        })}
                     </ul>
                  </div>
               )
            })}
         </nav>

         {/* Logout Button */}
         <button className="logout">Logout</button>
      </div >
   )
}

export default Header