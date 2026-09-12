import Analytics from "@/features/landing/components/analytics";
import Branches from "@/features/landing/components/branches";
import Faq from "@/features/landing/components/faq";
import Footer from "@/features/landing/components/footer";
import FooterCta from "@/features/landing/components/footer-cta";
import Header from "@/features/landing/components/header";
import Hero from "@/features/landing/components/hero";
import ScrollSlider from "@/features/landing/components/scroll-slider";

export default function Home() {
  return (
    <div> 
      <Header />
      <Hero />
      <Branches />
      <Analytics />
      <ScrollSlider />
      <Faq />
      <FooterCta />
      <Footer />
    </div>
  );
}
