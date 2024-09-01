import { useState } from "react";
import assets from "../../assets";
import "./Hero.css";
import "animate.css";
import axios from "axios";
import { frontend_url, server_url } from "../../utils";
import toast from "react-hot-toast";

const Hero = ({ verified }) => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [generate, setGenerate] = useState(false);
  const userId = localStorage.getItem("id") || null;
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [certificateUrl, setCertificateUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    hashtags: "",
    dateSelected: "",
    message: "",
    userId: userId,
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    processFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files[0];

    processFile(droppedFile);
  };

  const processFile = (selectedFile) => {
    setCertificateUrl(null);
    setGenerate(false);

    if (selectedFile) {
      if (selectedFile.size <= 3 * 1024 * 1024) {
        // Check if file size is <= 3 MB
        if (
          selectedFile.type === "image/jpeg" ||
          selectedFile.type === "image/png"
        ) {
          setFileName(selectedFile.name);
          setFile(selectedFile);

          const imageUrl = URL.createObjectURL(selectedFile);
          setBackgroundImage(imageUrl);
        } else {
          toast.dismiss();
          toast.error("Please select a valid JPEG, JPG, or PNG file.");
        }
      } else {
        toast.dismiss();
        toast.error("File size exceeds 3 MB.");
      }
    } else {
      toast.dismiss();
      toast.error("No file selected");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.dismiss();
      toast.error("Please select a file before generating the link.");
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result;

        const response = await axios.post(
          `${server_url}/api/generate/certificate`,
          {
            data: base64Data,
            formData,
          }
        );

        if (response.status === 201) {
          const certificateId = response.data;
          setCertificateUrl(`${frontend_url}/cred/${certificateId}`);
          toast.dismiss();
          toast.success("Link generated successfully!");
          setGenerate(true);
          setFormData({
            name: "",
            title: "",
            hashtags: "",
            dateSelected: "",
            message: "",
            userId: userId,
          });

          setLoading(false);
        }
      };
    } catch (error) {
      console.error("Error uploading the image or sending data:", error);
      setLoading(false);
      toast.dismiss();
      toast.error("There was an error generating the link. Please try again.");
    }
  };

  const handleBoxClick = () => {
    document.getElementById("file").click(); // Trigger file input click
  };

  const truncateFileName = (name) => {
    if (name.length > 20) {
      return name.slice(0, 20) + "...";
    }
    return name;
  };

  const copyUrl = (event) => {
    event.preventDefault(); // Prevent form submission

    navigator.clipboard
      .writeText(certificateUrl)
      .then(() => {
        toast.dismiss();
        toast.success("Text copied to clipboard!");
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="hero__div__main">
      <img src={assets.Home_image} alt="Hero Image" className="hero-image" />
      <div className="hero__text__div">
        <p className="hero__main__text">Digitize Your Achievements</p>
        <p className="hero__sub__text">Share Certificates Instantly</p>
      </div>
      <div className="hero__input__div">
        <div className="file__input__dropbox">
          <div className="container__file__input">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleBoxClick}
              className="header__file__input"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {fileName ? (
                <img src={assets.file_icon} alt="File Icon" /> // Show file icon if file is selected
              ) : (
                <img src={assets.upload_button} alt="Upload Button" /> // Show upload button if no file is selected
              )}
              {backgroundImage ? (
                <></>
              ) : (
                <p>
                  {fileName
                    ? truncateFileName(fileName)
                    : "Drag & drop file here or browse to upload!"}
                </p>
              )}
            </div>
            <label htmlFor="file" className="footer__file__input">
              <img src={assets.file_icon} alt="File Icon" />
              <p>
                {fileName ? truncateFileName(fileName) : "No selected file"}
              </p>
            </label>
            <input
              id="file"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        {fileName && (
          <div className="animate__animated animate__fadeInRight animate__faster cert__details__form__div">
            <form className="form" onSubmit={handleSubmit}>
              {!generate && (
                <>
                  <p className="title">Details</p>
                  <p className="message">
                    Add details of your incredible achievement.
                  </p>
                  <label>
                    <input
                      required
                      type="text"
                      minLength="3"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder=""
                    />
                    <span>Name</span>
                  </label>
                  <label>
                    <input
                      required
                      minLength="5"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                      placeholder=""
                    />
                    <span>Title of certificate</span>
                  </label>

                  <label>
                    <input
                      // required
                      type="text"
                      name="hashtags"
                      value={formData.hashtags}
                      onChange={handleChange}
                      className="input"
                      placeholder=""
                    />
                    <span>Tags (Comma separated) </span>
                  </label>

                  <label>
                    <input
                      required
                      type="date"
                      name="dateSelected"
                      value={formData.dateSelected}
                      onChange={handleChange}
                      className="input"
                      placeholder=""
                    />
                    <span>Date completed</span>
                  </label>
                  <label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter description of your achievement."
                      style={{ height: "120px", resize: "none" }} // Static height for textarea
                    />
                  </label>
                </>
              )}
              {certificateUrl && (
                <div className="success">
                  <div className="success__title">{certificateUrl}</div>
                </div>
              )}
              {generate ? (
                <div className="generated_url_div">
                  <button className="submit" onClick={copyUrl}>
                    Copy Link
                  </button>
                  <img
                    onClick={() => window.open(certificateUrl, "_blank")}
                    className="view__icon"
                    src={assets.view}
                    alt="View Icon"
                  />
                </div>
              ) : (
                //  : loading ? ( // Show loader if loading is true
                //   <div className="loader">
                //     <p>hello</p>
                //   </div>
                // )
                <button disabled={loading} className="submit" type="submit">
                  Generate Link
                </button>
              )}
              {!verified && (
                <p className="signin">
                  All your certificates in one place?{" "}
                  <a href="#">Sign-up now</a>
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
