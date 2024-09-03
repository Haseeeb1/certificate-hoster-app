// import assets from "../../assets";
import assets from "../../assets";
import "./MyCertificateCard.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const MyCertificateCard = ({
  id,
  name,
  title,
  message,
  hashtags,
  dateSelected,
  imageData,
}) => {
  const formattedHashtags = hashtags
    ?.split(",")
    .map((tag) => `#${tag}`)
    .join(" ");

  const alertedit = () => {
    alert("hello");
  };

  const deleteCert = () => {
    alert("hello");
  };

  return (
    <li>
      <a href="javascript:void(0);" className="card">
        <img src={imageData} className="card__image" alt="" />
        <div className="card__overlay">
          <div className="card__header">
            <svg className="card__arc" xmlns="http://www.w3.org/2000/svg">
              <path />
            </svg>

            <div className="viewing__div__card">
              <div className="card__header-text">
                <h3 className="card__title">{title}</h3>
                <span className="card__tagline">{message} </span>
                <span className="card__tagline">Tags: {formattedHashtags}</span>
                <span className="card__status">
                  Date Completed: <strong>{dateSelected}</strong>
                </span>
              </div>
              <div className="icons__div">
                <span className="edit__icon__card">
                  <FaEdit onClick={alertedit} />
                </span>
                <span className="edit__icon__card">
                  <MdDelete onClick={deleteCert} />
                </span>
              </div>
            </div>
          </div>
          {/* <p className="card__description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores,
            blanditiis?
          </p> */}
        </div>
      </a>
    </li>
  );
};

export default MyCertificateCard;
