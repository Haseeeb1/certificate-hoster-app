import { useState, useEffect, useRef } from "react";
import "./Auth.css";
import assets from "../../assets";
import { server_url } from "../../utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Auth = ({ verified }) => {
  const navigate = useNavigate();
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
  const [loginEmail, setLoginEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    // Redirect to home page if the user is verified
    if (verified) {
      navigate("/");
    }
  }, [verified, navigate]);

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
    // Ensure the first image and bullet are "active" when the page first loads
    if (imagesRefs.current[0]) {
      imagesRefs.current[0].classList.add("show");
    }
    if (bulletsRefs.current[0]) {
      bulletsRefs.current[0].classList.add("active");
    }
  }, []);

  useEffect(() => {
    // Auto-change carousel every 2 seconds
    const interval = setInterval(() => {
      const nextIndex = (currentIndex % 3) + 1;
      handleBulletClick(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const validateSignUp = (name, email, password) => {
    if (name.length < 4) return "Name must be at least 4 characters long.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format.";
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const validationError = validateSignUp(name, email, password);
    setLoginEmail(email);
    if (validationError) {
      toast.error(validationError);
      return;
    }
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
      toast.dismiss();
      toast.success(
        "Sign up successful. A verification code has been sent to your email."
      );
      setVerificationCodeSent(true);

      // Navigate or prompt user to enter verification code
    } catch (error) {
      toast.error(error.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // const handleSignUp = async (e) => {
  //   e.preventDefault();
  //   const name = nameRef.current.value;
  //   const email = emailRef.current.value;
  //   const password = passwordRef.current.value;

  //   const validationError = validateSignUp(name, email, password);
  //   if (validationError) {
  //     toast.error(validationError);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${server_url}/api/auth/signup`,
  //       {
  //         name,
  //         email,
  //         password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     toast.dismiss();
  //     toast.success("Sign up successfull");
  //     localStorage.setItem("name", response.data.name);
  //     localStorage.setItem("email", response.data.email);
  //     localStorage.setItem("id", response.data.id);
  //     navigate("/");
  //     window.location.reload();
  //   } catch (error) {
  //     // console.error("Error signing up", error);
  //     toast.dismiss();
  //     toast.error(error.response?.data?.msg || "Signup failed");
  //   }
  // };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = loginEmailRef.current.value;
    const password = loginPasswordRef.current.value;
    setLoginEmail(email);
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

      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response?.data?.requireVerification) {
        setVerificationCodeSent(true); // Show verification input if not verified
        toast.dismiss();
        toast.error("Please verify your email before logging in.");
      } else {
        toast.dismiss();
        toast.error(error.response?.data?.msg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const email = loginEmail;

    try {
      const response = await axios.post(
        `${server_url}/api/auth/verify-email`,
        {
          email,
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important to include credentials
        }
      );

      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.msg || "Verification failed");
    }
  };

  const handleResendCode = async () => {
    const email = loginEmail;

    try {
      await axios.post(`${server_url}/api/auth/resend-code`, { email });
      toast.dismiss();
      toast.success("Verification code resent successfully.");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to resend code");
    }
  };

  const handleRefresh = () => {
    setVerificationCodeSent(false); // Hide the verification form
    setIsSignUpMode(false); // Switch to sign-in form if in sign-up mode
    setCode("");
    setLoginEmail("");

    // Reset input fields for login
    if (loginEmailRef.current) loginEmailRef.current.value = "";
    if (loginPasswordRef.current) loginPasswordRef.current.value = "";
  };

  console.log("hh");
  // const handleSignIn = async (e) => {
  //   e.preventDefault();
  //   const email = loginEmailRef.current.value;
  //   const password = loginPasswordRef.current.value;

  //   try {
  //     const response = await axios.post(
  //       `${server_url}/api/auth/login`,
  //       {
  //         email,
  //         password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true, // Important to include credentials
  //       }
  //     );
  //     console.log("User logged in successfully", response.data);
  //     localStorage.setItem("name", response.data.name);
  //     localStorage.setItem("email", response.data.email);
  //     localStorage.setItem("id", response.data.id);
  //     navigate("/");
  //     window.location.reload();
  //   } catch (error) {
  //     // console.error("Error logging in", error);
  //     toast.dismiss();
  //     toast.error(error.response?.data?.msg || "Login failed");
  //   }
  // };

  return (
    <main
      className={
        isSignUpMode ? "sign-up-mode main__auth__div" : "main__auth__div"
      }
    >
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            {verificationCodeSent ? (
              <form
                autoComplete="off"
                className="auth__form verify-form"
                onSubmit={handleVerification}
              >
                <div className="logo">
                  <img src={assets.logo} alt="easyclass" />
                  <h4>Verify Email</h4>
                </div>
                <div className="heading">
                  <h2>Verification</h2>
                  <p>Please check your email for the verification code.</p>
                </div>
                <div className="actual-form">
                  <div className="input-wrap">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="input-field"
                      autoComplete="off"
                      required
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <label className="auth__label">Verification Code</label>
                  </div>
                  <input type="submit" value="Verify" className="sign-btn" />
                  <p
                    className="text resend__tag"
                    style={{ marginTop: "-20px" }}
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={handleResendCode}
                      className="resend__span"
                    >
                      {" "}
                      Resend code
                    </span>
                    <span> or</span>
                    <span
                      className="signin__span"
                      style={{ cursor: "pointer" }}
                      onClick={handleRefresh}
                    >
                      {" "}
                      Sign In
                    </span>
                  </p>
                </div>
              </form>
            ) : (
              <>
                <form
                  autoComplete="off"
                  className={`auth__form sign-in-form ${
                    isSignUpMode ? "hidden" : ""
                  }`}
                  onSubmit={handleSignIn}
                >
                  <div className="logo">
                    <img src={assets.logo} alt="easyclass" />
                    <h4>Cert-Vault</h4>
                  </div>
                  <div className="heading">
                    <h2>Welcome Back</h2>
                    <h6>Not registered yet? </h6>
                    <a href="#" className="toggle" onClick={handleToggle}>
                      Sign up
                    </a>
                  </div>
                  <div className="actual-form">
                    <div className="input-wrap">
                      <input
                        ref={loginEmailRef}
                        type="text"
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
                        ref={loginPasswordRef}
                        type="password"
                        className="input-field"
                        autoComplete="off"
                        required
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <label className="auth__label">Password</label>
                    </div>

                    {loading ? (
                      <>
                        <div className="loader__certificate">
                          <div className="spinner__certificate">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                        <p className="loader__p__tag">
                          Logging you in! Please wait.
                        </p>
                      </>
                    ) : (
                      <input
                        type="submit"
                        value="Sign In"
                        className="sign-btn"
                      />
                    )}
                    {/* <p className="text">
                      Forgotten your password? <a href="#">Get help</a>
                    </p> */}
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
                    <img src={assets.logo} alt="easyclass" />
                    <h4>Cert-Vault</h4>
                  </div>
                  <div className="heading">
                    <h2>Get Started</h2>
                    <h6>Already have an account? </h6>
                    <a href="#" className="toggle" onClick={handleToggle}>
                      Sign in
                    </a>
                  </div>
                  <div className="actual-form">
                    <div className="input-wrap">
                      <input
                        ref={nameRef}
                        type="text"
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
                        className="input-field"
                        autoComplete="off"
                        required
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <label className="auth__label">Password</label>
                    </div>
                    {loading ? (
                      <>
                        <div className="loader__certificate">
                          <div className="spinner__certificate">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </div>
                        <p className="loader__p__tag">
                          Signing you up! Please wait.
                        </p>
                      </>
                    ) : (
                      <input
                        type="submit"
                        value="Sign Up"
                        className="sign-btn"
                      />
                    )}
                    {/* <p className="text">
                      By signing up, I agree to the{" "}
                      <a href="#">Terms of Services</a> and{" "}
                      <a href="#">Privacy Policy</a>
                    </p> */}
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="carousel">
            <div className="images-wrapper">
              <img
                ref={(el) => (imagesRefs.current[0] = el)}
                src={assets.imageauth1}
                className="image img-1"
                alt=""
              />
              <img
                ref={(el) => (imagesRefs.current[1] = el)}
                src={assets.imageauth2}
                className="image img-2"
                alt=""
              />
              <img
                ref={(el) => (imagesRefs.current[2] = el)}
                src={assets.imageauth3}
                className="image img-3"
                alt=""
              />
            </div>
            <div className="text-slider">
              <div className="text-wrap">
                <div ref={textSliderRef} className="text-group">
                  <h2>Share your achievements</h2>
                  <h2>One-click access for viewers</h2>
                  <h2>Easy to use</h2>
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
