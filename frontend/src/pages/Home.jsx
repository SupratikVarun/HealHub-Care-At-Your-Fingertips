import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchDoctor from "../components/SearchDoctor";
import Specializations from "../components/Specializations";
import HowItWorks from "../components/HowItWorks";
import Statistics from "../components/Statistics";
import HealthTips from "../components/HealthTips";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchDoctor />
      <Specializations />
      <HowItWorks />
      <HealthTips />
      <Footer />
    </>
  );
}

export default Home;