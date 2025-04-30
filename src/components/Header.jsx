import React, { useState, useEffect, useRef } from 'react';
import { sidebarListData } from '../constants/HeaderTypes';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/_header.scss';
import { toggleSidebar } from 'src/utils/toggleSidebar';
import { useSelector } from 'react-redux';
import { parseJwtToken } from 'src/utils/cookie';
import { getAllowedRouteUrlList } from 'src/utils/getAllowedRouteUrls';

const handleToggle = (id) => {
  let toggledElement = document.getElementById(`linkContainer${id}`);
  // Closing and opening links on title click
  toggledElement.style.display =
    toggledElement.style.display === 'none' ? 'block' : 'none';
};

const authorizedSidebarListData = (() => {
  const {role} = parseJwtToken();

  if (role === 'admin') {
    return sidebarListData;
  }

  const allowedUrls = new Set(getAllowedRouteUrlList() || []);
  return sidebarListData
    .map((section) => {
      const key = Object.keys(section)[0];
      const links = section[key];

      const filteredLinks = links.filter((item) =>
        allowedUrls.has(item.url)
      );

      return filteredLinks.length ? { [key]: filteredLinks } : null;
    })
    .filter(Boolean);
})()

function searchSidebarListData(searchTerm) {
  const results = [];
  authorizedSidebarListData.forEach((item) => {
    const subItems = [];
    Object.values(item)[0].forEach((subItem) => {
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

const Header = ({
  staffName,
  staffUserName,
  showBill,
  setValue,
  value,
  logoutUser,
}) => {
  const [inputText, setInputText] = useState('');
  const [listItemsData, setListItemsData] = useState(authorizedSidebarListData);

  const navigate = useNavigate();

  // to remove sidebar while login page is open
  // let location = useLocation();
  // let path = location.pathname.split("/")[1];

  //useref hooks for sidebar toggles
  const inputElem = useRef('');
  const liItem = useRef([]);
  const profile = useRef('');
  const mainContainer = useRef('');
  const sidebarElem = useRef('');

  const setInputValue = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    setListItemsData(searchSidebarListData(inputText));
  }, [inputText]);

  const goToBilling = () => {
    navigate('/billing');
  };
  
  const handleToggleOuterView = () => {
    if (inputElem.current?.style.display === "none") {
      toggleSidebar(true, { inputElem, profile, mainContainer, sidebarElem, liItem });
    } else {
      toggleSidebar(false, { inputElem, profile, mainContainer, sidebarElem, liItem });
    }
  };

  useEffect(() => {
    toggleSidebar(false, { inputElem, profile, mainContainer, sidebarElem, liItem }); 
  }, []);
  const storeData = useSelector((state) => state.user.storeData);
  const { pincode, name, number } = storeData || {};

  
  return (
    <>
    <div
      className="main-box-container"
      ref={mainContainer}
      // style={{ display: path === "login" ? "none" : "block" }}
    >
      <div className="profileName" ref={profile}>
        <img
          src="images/hamburger.svg"
          width={25}
          height={25}
          className="hamburger-menu"
          alt=""
          onClick={handleToggleOuterView}
        />
        <h3 className="user-name">{staffName}</h3>
        <div className="profile-avatar">{staffName[0].toUpperCase()}</div>
      </div>

      {/* Search Input */}
      <div className="store-info" ref={inputElem}>
       <p>{name}</p>
       <p>{number}</p>
       <p>{pincode}</p>
      </div>
     


      {/* Billing Button */}
      <button className="billing" onClick={goToBilling}>
        Billing
      </button>
      <nav className="sidebar" ref={sidebarElem}>
        {listItemsData.map((item, index) => {
          const [itemKey, itemValue] = Object.entries(item)[0];
          return (
            <div
              key={index}
              className="links-container"
              ref={(el) => (liItem.current[index] = el)}
            >
              {/* Main Title */}
              <p
                className="main-link headers"
                onClick={() => handleToggle(index)}
              >
                {itemKey}
              </p>

              {/* Link Items */}
              <ul id={`linkContainer${index}`}>
                {itemValue.map((subItem, index) => {
                  return (
                    <li key={index}>
                      <Link
                        // to={`${subItem.url}`}
                        to={{
                          pathname: `${subItem.url}`,
                          search:
                            `${subItem.url}`?.split('/')[1] === 'approval'
                              ? `?option=${subItem.name}`
                              : '',
                        }}
                      >
                        <img
                          src={`${subItem.icon}`}
                          width={30}
                          height={30}
                          title={`${subItem.name}`}
                          alt={`${subItem.name}`}
                        />
                        <p className="headers-list">{subItem.name}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button className="logout" onClick={logoutUser}>
        Logout
      </button>
    </div>
   
    <div className="bottom-nav-container">
        <button className="bottom-nav-billing" onClick={goToBilling}>
          Billing
        </button>
        <div className='bottom-nav-profile-container'>
          <p className="bottom-nav-profile-avatar">{staffName[0].toUpperCase()}</p>
          <p className="bottom-nav-profile-name">{staffName}</p>
        </div>
        {listItemsData.map((item, index) => {
          const [itemKey, itemValue] = Object.entries(item)[0];
          return (
              <div className="bottom-nav-cart">
                {itemValue.map((subItem, subIndex) => (
                  <div className='bottom-nav-link-container' key={subIndex}>
                    <Link
                    className='bottom-nav-link'
                      to={{
                        pathname: subItem.url,
                        search:
                          subItem.url.split('/')[1] === 'approval'
                            ? `?option=${subItem.name}`
                            : '',
                      }}
                    >
                      <img
                        className='bottom-nav-link-img'
                        src={subItem.icon}
                        width={35}
                        height={35}
                        title={subItem.name}
                        alt={subItem.name}
                      />
                      <div className="bottom-nav-link-p">{subItem.name}</div>
                    </Link>
                  </div>
                ))}
              </div>
          );
        })}
        <button className="bottom-nav-logout" onClick={logoutUser}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Header;
