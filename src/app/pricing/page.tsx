import Footer from "@/components/ui/footer";
import FooterCta from "@/components/ui/footer-cta";
import Header from "@/components/ui/header";
import PricingContent from "@/features/pricing/components/pricing-content";

export default function PricingPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-20 pb-32 text-charcoal sm:px-6">
        <PricingContent />
      </main>
      <FooterCta />
      <Footer />
    </div>
  );
}
