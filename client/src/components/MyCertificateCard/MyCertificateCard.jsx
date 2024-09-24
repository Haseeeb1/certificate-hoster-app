import "./MyCertificateCard.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { server_url } from "../../utils";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyCertificateCard = ({
  id,
  name,
  title,
  message,
  hashtags,
  dateSelected,
  imageData,
  onDelete,
}) => {
  const navigate = useNavigate();
  const formattedHashtags = hashtags
    ?.split(",")
    .map((tag) => `#${tag}`)
    .join(" ");

  const deleteCert = async (certId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete the certificate?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found!");
          return;
        }
        const response = await axios.delete(
          `${server_url}/api/certificate/${certId}`,
          {
            data: { token },
          }
        );

        if (response.status === 200) {
          toast.success("Certificate deleted successfully");
          if (onDelete) {
            onDelete(certId);
          }
        } else {
          toast.error("Failed to delete certificate");
          console.error("Failed to delete certificate");
        }
      } catch (error) {
        console.error("Error deleting certificate:", error);
      }
    }
  };

  const handleEdit = () => {
    const certificateData = {
      id,
      name,
      title,
      message,
      hashtags,
      dateSelected,
      imageData,
    };
    navigate("/edit", { state: { certificateData } });
  };

  const openInNewTab = (id) => {
    window.open(`/cred/${id}`, "_blank");
  };
  return (
    <li>
      <a href="javascript:void(0);" className="card">
        <img
          src={imageData}
          className="card__image"
          alt=""
          onClick={() => openInNewTab(id)}
        />
        <FaExternalLinkAlt className="card__icon" />
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
                  <FaEdit onClick={handleEdit} />
                </span>
                <span className="edit__icon__card">
                  <MdDelete onClick={() => deleteCert(id)} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};

export default MyCertificateCard;
