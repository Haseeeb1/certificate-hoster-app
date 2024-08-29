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

function App() {
  const [verified, setVerified] = useState(false);

  const userId = localStorage.getItem("id");
  useEffect(() => {
    axios
      .post(`${server_url}/verify`, {
        token: Cookies.get("token"),
      })
      .then((response) => {
        if (response.data.valid && response.data.user.id == userId) {
          setVerified(true);
        }
      })
      .catch((error) => console.error("Error verifying token", error));
  });

  return (
    <>
      <Router>
        <Navbar verified={verified} />
        <Routes>
          <Route path="/" element={<Home verified={verified} />} />
          <Route path="/auth" element={<Auth verified={verified} />} />
          <Route path="/1" element={<Certificate verified={verified} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
