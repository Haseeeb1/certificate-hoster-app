import { useState, useEffect, useRef } from "react";
import "./Auth.css";
import assets from "../../assets";
import { server_url } from "../../utils";
import axios from "axios";

const Auth = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const textSliderRef = useRef(null);
  const imagesRefs = useRef([]);
  const bulletsRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggle = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleInputFocus = (e) => {
    e.target.classList.add("active");
  };

  const handleInputBlur = (e) => {
    if (e.target.value === "") {
      e.target.classList.remove("active");
    }
  };

  const handleBulletClick = (index) => {
    // Ensure index is within bounds
    if (index < 1 || index > 3) return;

    imagesRefs.current.forEach((img, i) => {
      if (img) img.classList.toggle("show", i === index - 1);
    });

    if (textSliderRef.current) {
      textSliderRef.current.style.transform = `translateY(${
        -(index - 1) * 2.2
      }rem)`;
    }

    bulletsRefs.current.forEach((bull, i) => {
      if (bull) bull.classList.toggle("active", i === index - 1);
    });

    setCurrentIndex(index);
  };

  useEffect(() => {
    // Handle bullet click events
    const localBulletsRefs = bulletsRefs.current;
    localBulletsRefs.forEach((bullet, index) => {
      if (bullet) {
        const handleClick = () => handleBulletClick(index + 1);
        bullet.addEventListener("click", handleClick);
        bullet.dataset.index = index + 1;
      }
    });

    return () => {
      localBulletsRefs.forEach((bullet, index) => {
        if (bullet) {
          const handleClick = () => handleBulletClick(index + 1);
          bullet.removeEventListener("click", handleClick);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Auto-change carousel every 2 seconds
    const interval = setInterval(() => {
      const nextIndex = (currentIndex % 3) + 1;
      handleBulletClick(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        `${server_url}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("User signed up successfully", response.data);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);

      setErrorMessage(""); // Clear any error message on success
    } catch (error) {
      console.error("Error signing up", error);
      setErrorMessage(error.response?.data?.message || "Signup failed");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = loginEmailRef.current.value;
    const password = loginPasswordRef.current.value;

    try {
      const response = await axios.post(
        `${server_url}/api/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important to include credentials
        }
      );
      console.log("User logged in successfully", response.data);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);
      setErrorMessage("");
    } catch (error) {
      console.error("Error logging in", error);
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <main
      className={
        isSignUpMode ? "sign-up-mode main__auth__div" : "main__auth__div"
      }
    >
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form
              autoComplete="off"
              className={`auth__form sign-in-form ${
                isSignUpMode ? "hidden" : ""
              }`}
              onSubmit={handleSignIn}
            >
              <div className="logo">
                <img src={assets.logo1} alt="easyclass" />
                <h4>CredShare</h4>
              </div>

              <div className="heading">
                <h2>Welcome Back</h2>
                <h6>Not registered yet?</h6>
                <a href="#" className="toggle" onClick={handleToggle}>
                  Sign up
                </a>
              </div>

              <div className="actual-form">
                <div className="input-wrap">
                  <input
                    ref={loginEmailRef}
                    type="text"
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <label className="auth__label">Name</label>
                </div>

                <div className="input-wrap">
                  <input
                    ref={loginPasswordRef}
                    type="password"
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <label className="auth__label">Password</label>
                </div>

                <input type="submit" value="Sign In" className="sign-btn" />

                <p className="text">
                  Forgotten your password or your login details?
                  <a href="#">Get help</a> signing in
                </p>
              </div>
            </form>

            <form
              autoComplete="off"
              className={`auth__form sign-up-form ${
                isSignUpMode ? "" : "hidden"
              }`}
              onSubmit={handleSignUp}
            >
              <div className="logo">
                <img src={assets.logo1} alt="easyclass" />
                <h4>easyclass</h4>
              </div>

              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <a href="#" className="toggle" onClick={handleToggle}>
                  Sign in
                </a>
              </div>

              <div className="actual-form">
                <div className="input-wrap">
                  <input
                    ref={nameRef}
                    type="text"
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <label className="auth__label">Name</label>
                </div>

                <div className="input-wrap">
                  <input
                    ref={emailRef}
                    type="email"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <label className="auth__label">Email</label>
                </div>

                <div className="input-wrap">
                  <input
                    ref={passwordRef}
                    type="password"
                    minLength="4"
                    className="input-field"
                    autoComplete="off"
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <label className="auth__label">Password</label>
                </div>

                <input type="submit" value="Sign Up" className="sign-btn" />

                <p className="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>

          <div className="carousel">
            <div className="images-wrapper">
              <img
                ref={(el) => (imagesRefs.current[0] = el)}
                src={assets.image1}
                className="image img-1"
                alt=""
              />
              <img
                ref={(el) => (imagesRefs.current[1] = el)}
                src={assets.image2}
                className="image img-2"
                alt=""
              />
              <img
                ref={(el) => (imagesRefs.current[2] = el)}
                src={assets.image3}
                className="image img-3"
                alt=""
              />
            </div>

            <div className="text-slider">
              <div className="text-wrap">
                <div ref={textSliderRef} className="text-group">
                  <h2>Create your own courses</h2>
                  <h2>Customize as you like</h2>
                  <h2>Invite students to your class</h2>
                </div>
              </div>
              <div className="bullets">
                <span
                  ref={(el) => (bulletsRefs.current[0] = el)}
                  className="active"
                  data-value="1"
                ></span>
                <span
                  ref={(el) => (bulletsRefs.current[1] = el)}
                  data-value="2"
                ></span>
                <span
                  ref={(el) => (bulletsRefs.current[2] = el)}
                  data-value="3"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
