import MyCertificateCard from "../../components/MyCertificateCard/MyCertificateCard";
import "./MyCred.css";
import axios from "axios";
import { server_url } from "../../utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const MyCred = ({ verified }) => {
  const userId = secureLocalStorage.getItem("id");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!verified) {
      navigate("/");
    }
  }, [verified, navigate]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.post(
          `${server_url}/api/user/${userId}/certificates`,
          {},
          {
            withCredentials: true,
          }
        );
        const { certificates } = response.data;
        setCertificates(certificates);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  if (certificates.length <= 0) {
    return (
      <div className="not__found__error-screen">
        <div className="not__found__main">
          <p>
            No certificates available yet.
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
  }

  const handleDelete = (certId) => {
    setCertificates(certificates.filter((cert) => cert._id !== certId));
  };

  return (
    <div className="my-certificate__div__main">
      <div className="certificate__title__div">
        <div className="certificate__title__text">
          <h2>My Certificates</h2>
        </div>
      </div>
      <ul className="cards">
        {certificates.map((certificate) => (
          <MyCertificateCard
            key={certificate._id}
            id={certificate._id}
            name={certificate.name}
            title={certificate.title}
            message={certificate.message}
            hashtags={certificate.hashtags}
            dateSelected={certificate.dateSelected}
            imageData={certificate.imageData}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default MyCred;
