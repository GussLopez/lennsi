import Footer from "@/features/landing/components/footer";
import FooterCta from "@/features/landing/components/footer-cta";
import Header from "@/features/landing/components/header";
import Hero from "@/features/landing/components/hero";

export default function Home() {
  return (
    <div> 
      <Header />
      <Hero />

      <div className="w-full h-screen">

      </div>
      <FooterCta />
      <Footer />
    </div>
  );
}
