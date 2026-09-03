import Hero from "@/components/Hero";
import LinksGrid from "@/components/LinksGrid";
import Gallery from "@/components/Gallery";
import PPVCatalog from "@/components/PPVCatalog";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LinksGrid />
      <Gallery />
      <PPVCatalog />
      <ContactForm />
      <Footer />
    </main>
  );
}
