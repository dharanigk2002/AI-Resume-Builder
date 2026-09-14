import Banner from "../components/Home/Banner";
import CallToAction from "../components/Home/CallToAction";
import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import HeroSection from "../components/Home/HeroSection";
import Testimonial from "../components/Home/Testimonial";

export default function Home() {
  return (
    <div>
      <Banner />
      <HeroSection />
      <Features />
      <Testimonial />
      <CallToAction />
      <Footer />
    </div>
  );
}
