import MyCertificateCard from "../../components/MyCertificateCard/MyCertificateCard";
import "./MyCred.css";
import Cookies from "js-cookie";
import axios from "axios";
import { server_url } from "../../utils";
import { useEffect, useState } from "react";

const MyCred = () => {
  const userId = localStorage.getItem("id");
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.post(
          `${server_url}/api/user/${userId}/certificates`,
          { token } // Send the token in the request body
        );
        const { certificates } = response.data; // Assuming the certificates are inside response.data.certificates
        setCertificates(certificates);
        console.log(certificates);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

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
            key={certificate._id} // Use a unique key for each card
            id={certificate._id}
            name={certificate.name}
            title={certificate.title}
            message={certificate.message}
            hashtags={certificate.hashtags}
            dateSelected={certificate.dateSelected}
            imageData={certificate.imageData}
          />
        ))}
      </ul>
    </div>
  );
};

export default MyCred;
