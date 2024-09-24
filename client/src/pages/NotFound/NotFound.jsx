import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not__found__error-screen">
      <div className="not__found__main">
        <p>
          This page is not available.
          <span className="create__span" onClick={() => navigate("/")}>
            {" "}
            Back to home?
          </span>
        </p>
      </div>
      <div className="loader__not__found">
        <div className="light__not__found"></div>
        <div className="black_overlay__not__found"></div>
      </div>
    </div>
  );
};

export default NotFound;
