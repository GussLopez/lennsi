import Analytics from "@/features/landing/components/analytics";
import Branches from "@/features/landing/components/branches";
import Faq from "@/features/landing/components/faq";
import Footer from "@/components/ui/footer";
import FooterCta from "@/components/ui/footer-cta";
import Header from "@/components/ui/header";
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
