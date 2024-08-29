import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";
import assets from "../../assets";

const Navbar = ({ verified }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header" id="header">
      <nav className="nav container__navbar">
        <Link to="/" className="nav__logo">
          <img className="logo__certificate__img" src={assets.logo} />
          &nbsp;&nbsp;Cred-Share
        </Link>

        <div
          className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <div className="right__links__div">
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/" className="nav__link">
                  Home
                </Link>
              </li>
              {verified && (
                <li className="nav__item">
                  <Link to="/support" className="nav__link">
                    My-Certificates
                  </Link>
                </li>
              )}
              <li className="nav__item">
                <Link to="/about" className="nav__link">
                  About
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/support" className="nav__link">
                  Support Us
                </Link>
              </li>
            </ul>
            {verified ? (
              <p>hello</p>
            ) : (
              <Link to="/auth">
                <button className="button__login">Log In</button>
              </Link>
            )}
          </div>
          {/* Close button */}
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <FiX />
          </div>
        </div>

        <div className="nav__actions">
          {/* Toggle button */}
          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <FiMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
