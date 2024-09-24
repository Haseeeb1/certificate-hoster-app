import "./About.css";

const About = () => {
  return (
    <div className="about-us">
      <div className="container">
        <h1>About Cert-Vault</h1>
        <br />
        <p>
          This tool provides an easy and efficient way to digitize and share
          your physical certificates. By uploading an image of a certificate,
          users can generate a unique, shareable link that includes both the
          image and key details like the certificate title, date, and
          description. This link can be used to present your accomplishments to
          employers, include on your resume, or share on social media.
        </p>
        <br />
        <p>
          In addition to certificate sharing, the tool offers user profiling,
          allowing you to store and manage multiple certificates in one place.
          Users can organize their certificates, making them easily accessible
          online and ready to share whenever needed. The tool ensures your
          offline achievements are presented in a professional format, helping
          you showcase your accomplishments to the world with ease and impact.
        </p>
      </div>
    </div>
  );
};

export default About;
