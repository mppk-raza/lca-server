import React from "react";
import "./Footer.css";
import logo from "../../assets/mP-logo.png";
import logo2 from "../../assets/lca-logo.png";
const Footer = () => {
  return (
    <div className="footer">
      <div className="copyright__footer">
        <img className="footer__logo" src={logo} alt="IMG_M&P" />
        <div className="footer__text">© 2022 M&P. All Rights Reserved
          <div className="footer__text">Powered by M&P Learning Circles</div>
          <div className="footer__text">Developed & Designed by <a className="link" href="https://www.walzixdigitals.com" target="__blank">Walzix Digitals</a></div>
        </div>
        <div>
        <img src={logo2} alt="IMG_M&P_Learning _Circles" className="footer__logo" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
