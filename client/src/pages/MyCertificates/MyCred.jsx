import MyCertificateCard from "../../components/MyCertificateCard/MyCertificateCard";
import "./MyCred.css";

const MyCred = () => {
  return (
    <div className="my-certificate__div__main">
      <div className="certificate__title__div">
        <div className="certificate__title__text">
          <h2>My Certificates</h2>
        </div>
      </div>
      <ul className="cards">
        <MyCertificateCard />
        <MyCertificateCard />
        <MyCertificateCard />
        <MyCertificateCard />
        <MyCertificateCard />
        <MyCertificateCard />
      </ul>
    </div>
  );
};

export default MyCred;
