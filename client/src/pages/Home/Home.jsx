import Hero from "../../components/Hero/Hero";
import "./Home.css";

const Home = ({ verified }) => {
  return (
    <>
      <Hero verified={verified} />
    </>
  );
};

export default Home;
