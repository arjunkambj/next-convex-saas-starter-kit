import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Faqs from "@/components/home/faqs";
import Footer from "@/components/home/Footer";
import Pricing from "@/components/home/Pricing";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Pricing />
      <Faqs />
      <Footer />
    </>
  );
}
