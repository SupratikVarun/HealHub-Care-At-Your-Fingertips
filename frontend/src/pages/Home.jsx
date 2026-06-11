import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchDoctor from "../components/SearchDoctor";
import Specializations from "../components/Specializations";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchDoctor />
      <Specializations />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;