import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";
import assets from "../../assets";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import secureLocalStorage from "react-secure-storage";

const Navbar = ({ verified }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function clearCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  const logout = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        clearCookie("token");
        navigate("/auth");
        window.location.reload();
      }
    });
  };
  const name = secureLocalStorage.getItem("name");
  const firstLetter = name ? name.charAt(0).toUpperCase() : "";

  return (
    <header className="header" id="header">
      <nav className="nav container__navbar">
        <Link to="/" className="nav__logo">
          <img className="logo__certificate__img" src={assets.logo} />
          &nbsp;&nbsp;Cert-Vault
        </Link>

        <div
          className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <div className="right__links__div">
            <ul className="nav__list">
              <li className="nav__item">
                <Link onClick={toggleMenu} to="/" className="nav__link">
                  Home
                </Link>
              </li>
              {verified && (
                <li className="nav__item">
                  <Link
                    onClick={toggleMenu}
                    to="/my-certificates"
                    className="nav__link"
                  >
                    My-Certificates
                  </Link>
                </li>
              )}
              <li className="nav__item">
                <Link onClick={toggleMenu} to="/about" className="nav__link">
                  About
                </Link>
              </li>
            </ul>
            {verified ? (
              <>
                <div className="avatar-container">
                  <div className="avatar">
                    <div className="avatar__letter">{firstLetter}</div>
                  </div>
                </div>
                <button className="button__login" onClick={logout}>
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/auth">
                <button className="button__login" onClick={toggleMenu}>
                  Log In
                </button>
              </Link>
            )}
          </div>
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <FiX />
          </div>
        </div>

        <div className="nav__actions">
          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <FiMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
