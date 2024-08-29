import { useState } from "react";
import assets from "../../assets";
import "./Hero.css";
import "animate.css";
import axios from "axios";
import { server_url } from "../../utils";

const Hero = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [generate, setGenerate] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setGenerate(false);
    processFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile) {
      if (
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png"
      ) {
        setFileName(selectedFile.name);
        setFile(selectedFile);
      } else {
        alert("Please select a valid JPEG, JPG, or PNG file.");
      }
    } else {
      alert("No file selected");
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    hashtags: "",
    dateSelected: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file before generating the link.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result;

        const response = await axios.post(`${server_url}/upload`, {
          data: base64Data,
          formData,
        });

        if (response.status === 200) {
          console.log(response.data);
          alert("Link generated successfully!");
          setGenerate(true);
        }
      };
    } catch (error) {
      console.error("Error uploading the image or sending data:", error);
      alert("There was an error generating the link. Please try again.");
    }

    // if (!file) {
    //   alert("Please select a file before generating the link.");
    //   return;
    // }

    // try {
    //   // Upload image to Cloudinary
    //   const formDataCloudinary = new FormData();
    //   formDataCloudinary.append("file", file);
    //   formDataCloudinary.append("upload_preset", "certificate_preset"); // Set up an unsigned preset in your Cloudinary account

    //   const uploadResponse = await axios.post(
    //     `https://api.cloudinary.com/v1_1/deqh1zzsy/image/upload`,
    //     formDataCloudinary
    //   );

    //   const imageUrl = uploadResponse.data.secure_url;

    //   // Send data to the backend
    //   const response = await axios.post("http://localhost:3000/generate_link", {
    //     ...formData,
    //     imageUrl,
    //   });

    //   if (response.status === 200) {
    //     console.log(imageUrl);
    //     alert("Link generated successfully!");
    //     setGenerate(true);
    //   }
    // } catch (error) {
    //   console.error("Error uploading the image or sending data:", error);
    //   alert("There was an error generating the link. Please try again.");
    // }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setGenerate(true);
  // };

  const handleBoxClick = () => {
    document.getElementById("file").click(); // Trigger file input click
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
            >
              {fileName ? (
                <img src={assets.file_icon} alt="File Icon" /> // Show file icon if file is selected
              ) : (
                <img src={assets.upload_button} alt="Upload Button" /> // Show upload button if no file is selected
              )}
              <p>{fileName || "Drag & drop file here or browse to upload!"}</p>
            </div>
            <label htmlFor="file" className="footer__file__input">
              <img src={assets.file_icon} alt="File Icon" />
              <p>{fileName || "No selected file"}</p>
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
              <p className="title">Details</p>
              <p className="message">
                Add details of your incredible achievement.
              </p>
              <label>
                <input
                  required
                  type="text"
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
                <span>Tags</span>
              </label>

              <label>
                <input
                  required
                  type="text"
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
              {generate ? (
                <div className="generated_url_div">
                  <button className="submit">Copy Link</button>
                  <img
                    className="edit__icon"
                    src={assets.edit}
                    alt="Edit Icon"
                  />
                  <img
                    className="view__icon"
                    src={assets.view}
                    alt="View Icon"
                  />
                </div>
              ) : (
                <button className="submit" type="submit">
                  Generate Link
                </button>
              )}
              <p className="signin">
                All your certificates in one place? <a href="#">Sign-up now</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
