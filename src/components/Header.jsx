import React, { useState, useEffect, useRef } from 'react';
import { sidebarListData } from '../constants/HeaderTypes';
import { Link, useHistory } from 'react-router-dom';
import '../CSS/_header.scss';

const handleToggle = (id) => {
  let toggledElement = document.getElementById(`linkContainer${id}`);
  // Closing and opening links on title click
  toggledElement.style.display =
    toggledElement.style.display === 'none' ? 'block' : 'none';
};

function searchSidebarListData(searchTerm) {
  const results = [];

  sidebarListData.forEach((item) => {
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
  const [listItemsData, setListItemsData] = useState(sidebarListData);

  const history = useHistory();

  // to remove sidebar while login page is open
  // let location = useLocation();
  // let path = location.pathname.split("/")[1];

  //useref hooks for sidebar toggles
  const inputElem = useRef('');
  const liItem = useRef([]);
  const profile = useRef('');
  const mainContainer = useRef('');

  const setInputValue = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    setListItemsData(searchSidebarListData(inputText));
  }, [inputText]);

  const goToBilling = () => {
    history.push('/billing');
  };

  const handleToggleOuterView = () => {
    if (inputElem.current.style.display === 'none') {
      inputElem.current.style.display = 'block';
      profile.current.children[1].style.display = 'block';
      profile.current.children[2].style.display = 'none';
      mainContainer.current.style.width = '300px';
      mainContainer.current.children[2].innerText = 'Billing';
      mainContainer.current.children[4].innerText = 'Logout';

      liItem.current.forEach((ele) => {
        ele.children[0].style.display = 'block';
        ele.children[1].childNodes.forEach((element) => {
          element.children[0].children[1].style.display = 'block';
        });
      });
    } else {
      inputElem.current.style.display = 'none';
      profile.current.children[1].style.display = 'none';
      profile.current.children[2].style.display = 'block';
      mainContainer.current.style.width = '100px';
      mainContainer.current.children[2].innerText = 'B';
      mainContainer.current.children[4].innerText = 'L';

      liItem.current.forEach((ele) => {
        ele.children[0].style.display = 'none';
        ele.children[1].childNodes.forEach((element) => {
          element.children[0].children[1].style.display = 'none';
        });
      });
    }
  };
  return (
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
      <input
        type="text"
        ref={inputElem}
        name="search"
        id="search-input"
        placeholder="Search"
        value={inputText}
        onChange={(e) => setInputValue(e)}
      />

      {/* Billing Button */}
      <button className="billing" onClick={goToBilling}>
        Billing
      </button>
      <nav className="sidebar">
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
                            `${subItem.url}`.split('/')[1] === 'approval'
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
  );
};

export default Header;
