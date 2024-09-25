import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import Certificate from "./pages/Certificate/Certificate";
import Auth from "./pages/Auth/Auth";
import axios from "axios";
import { server_url } from "./utils";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import NotFound from "./pages/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import CertificateNav from "./components/Navbar/CertificateNav";
import MyCred from "./pages/MyCertificates/MyCred";
import EditHero from "./components/EditHero/EditHero";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";

function App() {
  const [verified, setVerified] = useState(false);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .post(
        `${server_url}/verify`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.valid && response.data.user.id == userId) {
          setVerified(true);
        }
      })
      .catch((error) => {});
  });

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar verified={verified} />
                <Home verified={verified} />
                <Footer verified={verified} />
              </>
            }
          />
          {verified && (
            <Route
              path="/edit"
              element={
                <>
                  <Navbar verified={verified} />
                  <EditHero verified={verified} />
                  <Footer verified={verified} />
                </>
              }
            />
          )}
          <Route
            path="/auth"
            element={
              <>
                <Navbar verified={verified} />
                <Auth verified={verified} />
              </>
            }
          />
          {verified && (
            <Route
              path="/my-certificates"
              element={
                <>
                  <Navbar verified={verified} />
                  <MyCred verified={verified} />
                  <Footer verified={verified} />
                </>
              }
            />
          )}
          <Route
            path="/cred/:id"
            element={
              <>
                <CertificateNav verified={verified} />
                <Certificate />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar verified={verified} />
                <About />
                <Footer verified={verified} />
              </>
            }
          />

          <Route
            path="*"
            element={
              <>
                <Navbar verified={verified} />
                <NotFound />
                <Footer verified={verified} />
              </>
            }
          />
        </Routes>
      </Router>

      <Toaster />
    </>
  );
}

export default App;
