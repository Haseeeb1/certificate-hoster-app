import "./Footer.css";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = ({ verified }) => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <ul className="social-icon">
        <li className="social-icon__item">
          <a
            className="social-icon__link"
            href="https://linkedin.com/in/haseeb-ul-hassan"
            target="_blank"
          >
            <FaLinkedin />
          </a>
        </li>
        <li className="social-icon__item">
          <a
            className="social-icon__link"
            href="https://github.com/haseeeb1"
            target="_blank"
          >
            <FaGithub />
          </a>
        </li>
      </ul>

      <ul className="menu">
        <li className="menu__item">
          <a
            className="menu__link"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Home
          </a>
        </li>

        {verified && (
          <li className="menu__item">
            <a
              className="menu__link"
              onClick={() => navigate("/my-certificates")}
              style={{ cursor: "pointer" }}
            >
              My-certificates
            </a>
          </li>
        )}
        <li className="menu__item">
          <a
            className="menu__link"
            onClick={() => navigate("/about")}
            style={{ cursor: "pointer" }}
          >
            About
          </a>
        </li>
      </ul>

      <p>&copy;2024 Haseeb Ul Hassan | Cert-Vault </p>
    </footer>
  );
};

export default Footer;
