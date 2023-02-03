import React, { useState, useEffect, useRef } from 'react'
import { sidebarListData } from '../constants/HeaderTypes';
import { Link , useHistory,useLocation} from 'react-router-dom';

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

const Header = () => {
  const [value, setValue] = useState('')
  const [listItemsData, setListItemsData] = useState(sidebarListData);

  const history = useHistory()

  let location = useLocation();
  let path = location.pathname;
  path=path.split('/')[1];
  
  const inputElem = useRef('')
  const liItem = useRef([])
  const profile=useRef('')
  const mainCont=useRef('');

  const setInputValue = (e) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    setListItemsData(searchSidebarListData(value));
  }, [value])
  

  const goToBilling=()=>{
    history.push('/billing');
  }

  const handleToggleOuterView = () => {
    // console.log(mainCont.current.children)
    if (inputElem.current.style.display === "none") {
      inputElem.current.style.display = "block";
      profile.current.children[1].style.display="block";
      profile.current.children[2].style.display="none";
      mainCont.current.style.width="300px";
      mainCont.current.children[2].innerText="Billing";
      mainCont.current.children[4].innerText="Logout";


      liItem.current.forEach(ele => {
        ele.children[0].style.display="block";
        ele.children[1].childNodes.forEach(element => {
          element.children[0].children[1].style.display="block";

        })
      })
    }
    else {
      inputElem.current.style.display = "none"
      profile.current.children[1].style.display="none";
      profile.current.children[2].style.display="block";
      mainCont.current.style.width="100px";
      mainCont.current.children[2].innerText="B";
      mainCont.current.children[4].innerText="L";

      liItem.current.forEach(ele => {
        ele.children[0].style.display="none";
        ele.children[1].childNodes.forEach(element => {
          element.children[0].children[1].style.display="none";
        })
      })
    }
  }
  return (
    <div id='main-box-container' ref={mainCont} style={{display:path==="login"?"none":"block"}}>
      <div className='profileName' ref={profile}>
        <img src="images/hamburger.svg" width={25} height={25} className='hamburger-menu' alt="" onClick={handleToggleOuterView} />
        <h3 className='user-name' >Sachin Rawat</h3>
        <div className='profile-avatar'>S</div>
      </div>

      {/* Search Input */}
      <input type="text" ref={inputElem} name="search" id="search-input" placeholder='Search' value={value} onChange={(e) => setInputValue(e)} />

      {/* Billing Button */}
      <button className="billing" onClick={goToBilling}>Billing</button>
      <nav className="sidebar">
        {
          listItemsData.map((item, index) => {
            const [itemKey, itemValue] = Object.entries(item)[0];
            return (
              <div key={index} className="links-container" ref={(el) => (liItem.current[index] = el)}>
                {/* Main Title */}
                <p className="main-link headers" onClick={() => handleToggle(index)}>{itemKey}</p>

                {/* Link Items */}
                <ul id={`linkContainer${index}`}>
                  {itemValue.map((subItem, index) => {
                    return (
                      <li key={index} >
                        <Link to={`${subItem.url}`} >
                        <img src={`${subItem.icon}`} width={30} height={30} title={`${subItem.name}`} alt={`${subItem.name}`} />
                        <p className='headers-list'>{subItem.name}</p>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        }
      </nav>

      {/* Logout Button */}
      <button className="logout">Logout</button>
    </div >
  )
}

export default Header