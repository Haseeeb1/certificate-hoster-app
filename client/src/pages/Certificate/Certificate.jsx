import "./Certificate.css";
import assets from "../../assets";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { server_url } from "../../utils";
import axios from "axios";

const Certificate = () => {
  const { id } = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        // Attempt to fetch certificate data from the backend
        const response = await axios.get(`${server_url}/api/certificate/${id}`);
        setCertificateData(response.data);
        console.log(response.data);
      } catch (err) {
        // If an error occurs, set the error state
        console.error("Error fetching certificate data:", err);
      } finally {
        // Always set loading to false after the request is completed
        setLoading(false);
      }
    };
    fetchCertificateData();
  }, [id]);

  const formattedHashtags = certificateData?.hashtags
    .split(",")
    .map((tag) => `#${tag}`)
    .join(" ");

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

  if (!certificateData) {
    return (
      <div className="not__found__error-screen">
        <div className="not__found__terminal-loader">
          <div className="not__found__terminal-header">
            <div className="not__found__terminal-title">Status</div>
            <div className="not__found__terminal-controls">
              <div className="not__found__control not__found__close"></div>
              <div className="not__found__control not__found__minimize"></div>
              <div className="not__found__control not__found__maximize"></div>
            </div>
          </div>
          <div className="not__found__content">
            <div className="not__found__text">No certificate data found...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-pattern" />
      <div className="certificate__div__main">
        <div className="certificate__title__div">
          <div className="certificate__title__text">
            <p>Certificate</p>
            <h2>{certificateData.title}</h2>
          </div>
        </div>
        <div className="certificate__details__div">
          <div className="certificate__details__left">
            <div className="logo-header__div">
              <h3>CredShare.io &nbsp; </h3>
              <img className="logo__certificate__img" src={assets.logo} />
            </div>
            <div className="cert__name__div">
              <h1>{certificateData.name}</h1>
            </div>
            <div className="cert__desc__div">
              <h3>{certificateData.message}</h3>
              <h4>{formattedHashtags}</h4>
            </div>
            <div className="cert__date__div">
              <h3>
                <strong>Date:</strong> {certificateData.dateSelected}
              </h3>
            </div>
          </div>
          <div className="certificate__details__right">
            <img
              className="certificate__img"
              loading="lazy"
              src={certificateData.imageData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
