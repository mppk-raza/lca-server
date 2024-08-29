import React, { useState } from "react";
import "./Header.css";
import MobileHeader from "../MobileHeader/MobileHeader";
import logo from "../../assets/lca-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  let retrievedObject = localStorage.getItem("user");
  const user = JSON.parse(retrievedObject);
  const navigate = useNavigate();
  const search = useLocation().pathname;
  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [activePage, setActivePage] = useState("/");
  const [userDropdown, setUserDropdown] = useState(false);
  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    return {
      width,
    };
  }

  React.useEffect(() => {
    setActivePage(search);
  }, [search]);

  React.useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return (
    <>
      {windowDimensions.width >= 850 ? (
        <>
          <div className="header__top">
            <div className={localStorage.getItem("token")&& localStorage.userType==="User"?"header__top__login__content":"header__top__content"}> 
            {localStorage.getItem("token")&& localStorage.userType==="User"
            ?<>
            <div>Hello, {user.name}</div>
            <div className="header__top__content__divider">|</div>
            <div onClick={()=>navigate("/UserPanel")}  className="header__top__content__btn">Go to Dashboard</div> 
            </>
            : <> <div onClick={()=>navigate("/login")} className="header__top__content__btn"> Log in</div>
            <div className="header__top__content__divider">|</div>
            <div onClick={()=>navigate("/signup")} className="header__top__content__btn"> Register</div></>}
           
            </div>
          </div>
          <div className="header">
            <div className="header__content">
              <div className="header__left">
                <a onClick={()=> navigate("/")} rel="noreferrer">
                  <img className={"header__logo"} src={logo} alt="logo" />
                </a>
              </div>
              <div className="header__right">
                <div className="header__navigation">
                  <div className="navigation__item">
                    <div className="navigation__item__text">
                      <Link to="/">
                        <span
                          className={
                            activePage === "/"
                              ? "navigation__item__text__border__active"
                              : "navigation__item__text__border"
                          }
                        >
                          Home
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="navigation__item">
                    <div className="navigation__item__text">
                      <Link to="/aboutUs">
                        <span
                          className={
                            activePage === "/aboutUs"
                              ? "navigation__item__text__border__active"
                              : "navigation__item__text__border"
                          }
                        >
                          About Us
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="navigation__item">
                    <div className="navigation__item__text">
                      <Link to="/updates">
                        <span
                          className={
                            activePage === "/updates"
                              ? "navigation__item__text__border__active"
                              : "navigation__item__text__border"
                          }
                        >
                          Updates
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="navigation__item">
                    <div className="navigation__item__text">
                      <Link to="/gallery">
                        <span
                          className={
                            activePage === "/gallery"
                              ? "navigation__item__text__border__active"
                              : "navigation__item__text__border"
                          }
                        >
                          Gallery
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* <div className="navigation__item">
                    <div className="navigation__item__text__last">
                      <Link to="login">
                        <span
                          className={
                            activePage === "/login"
                              ? "navigation__item__text__border__active"
                              : "navigation__item__text__border"
                          }
                        >
                          Login
                        </span>
                      </Link>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <MobileHeader/>
        </>
      )}
    </>
  );
};
export default Header;
