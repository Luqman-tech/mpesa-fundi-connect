
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import ProviderSection from "@/components/ProviderSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ServiceCategories />
      <HowItWorks />
      <Stats />
      <ProviderSection />
      <Footer />
    </div>
  );
};

export default Index;
