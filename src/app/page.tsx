import Analytics from "@/features/landing/components/analytics";
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

      <div className="w-full h-screen">

      </div>
      <Analytics />
      <ScrollSlider />
      <Faq />
      <FooterCta />
      <Footer />
    </div>
  );
}
