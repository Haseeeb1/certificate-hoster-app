import "./Certificate.css";
import assets from "../../assets";

const Certificate = () => {
  return (
    <>
      <div className="bg-pattern" />
      <div className="certificate__div__main">
        <div className="certificate__title__div">
          <div className="certificate__title__text">
            <p>Certificate</p>
            <h2>Internship at XYZ</h2>
          </div>
        </div>
        <div className="certificate__details__div">
          <div className="certificate__details__left">
            <div className="logo-header__div">
              <h3>CredShare.io &nbsp; </h3>
              <img className="logo__certificate__img" src={assets.logo} />
            </div>
            <div className="cert__name__div">
              <h1>Muhammad Haseeb-Ul-Hassan</h1>
            </div>
            <div className="cert__desc__div">
              <h3>
                Completion certificate for internship at the best software house
                Completion certificate for internship at the best software house
              </h3>
              <h4>#react #frontend #python #sql</h4>
            </div>
            <div className="cert__date__div">
              <h3>
                <strong>Date:</strong> 13th August 2024
              </h3>
            </div>
          </div>
          <div className="certificate__details__right">
            <img className="certificate__img" src={assets.certificate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
