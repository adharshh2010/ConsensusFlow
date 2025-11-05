import React from "react";
import CTASection from "./ui/cta";
import Footer from "./ui/footer";
import HeroSection from "./ui/hero";
import HowItWorks from "./ui/hiw";
import Navbar from "./ui/nav";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}
