import { About } from "@/components/sections/About";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductTour } from "@/components/sections/ProductTour";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  description: site.description,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web, Telegram",
  inLanguage: "az",
  url: site.url,
  sameAs: [site.links.telegram, site.links.github],
  author: { "@type": "Person", name: site.creator, url: site.links.linkedin },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <HowItWorks />
      <ProductTour />
      <About />
      <FinalCta />
    </>
  );
}
