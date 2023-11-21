import React, { Fragment, useState, useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [lightmode, setLightmode] = useState(localStorage.getItem("lightmode"));
  let isLoggedIn = localStorage.getItem("isLoggedIn")
  

  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    isLoggedIn = localStorage.getItem("isLoggedIn")
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsInputVisible(false);
      }
    };



    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [inputRef]);

  async function Signout() {
    navigate("/signoutconfirm");
  }

  async function goToProfile() {
    navigate("/userprofile");
  }

  const lightModeSwitch = () => {
    setLightmode((prevLightmode) => !prevLightmode);
    console.log(lightmode);
  };

  useEffect(() => {
    localStorage.setItem("lightmode", lightmode);
    document.documentElement.className = lightmode ? "App-light" :"App-dark"
  }, [lightmode]);

  return (
    <Fragment>
      {isLoggedIn ? (
        <div className='navbar-container'>
          <div className="navbar">
                <Fragment>
                  <Link to={"/main"} id='main'>Főoldal</Link>
                  <Link to={"/userprofile"} id='adatlap'>Adatlap</Link>
                  <div className='login-container' ref={inputRef}>
                    <Link to={"/signoutconfirm"} id='signout'>Kijelentkezés</Link>
                      <label class="switch">
                        <input onClick={lightModeSwitch} type="checkbox" />
                        <span class="slider"></span>
                      </label>
                  </div>
                </Fragment>
          </div>
        </div>
      ) : (
        null
      )}
    </Fragment>
  );
};

export default Navbar;
