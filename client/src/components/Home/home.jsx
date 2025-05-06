import React from "react";
import HeroSection from "./HeroSection";
import WhoWeAre from "./WhoWeAre";
import FeaturesSection from "./FeaturesSection";
import ScenarioSection from "./ScenarioSection";
import ProcessSection from "./ProcessSection";
import StorytellingSection from "./StorytellingSection";
import CallToActionSection from "./CallToActionSection";
import CtaSection from "./CtaSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection /> {/* Bold intro with tagline */}
      <WhoWeAre /> {/* Brief about Tuah & project mission */}
      <FeaturesSection /> {/* Core features like real-time MPSO */}
      <ScenarioSection /> {/* Walkthrough of negotiation steps */}
      <ProcessSection /> {/* Visual flow of MPSO decision-making */}
      <StorytellingSection /> {/* Emotional hook/user/manufacturer stories */}
      <CallToActionSection /> {/* Dual CTA for buyers/manufacturers */}
      <CtaSection /> {/* Additional push to start */}
      <ContactSection /> {/* Inquiry form + info */}
    </div>
  );
};

export default HomePage;
