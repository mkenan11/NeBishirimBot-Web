import { About } from "@/components/sections/About";
import { Favorites } from "@/components/sections/Favorites";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PhotoRecognition } from "@/components/sections/PhotoRecognition";
import { Problem } from "@/components/sections/Problem";
import { RecipeDetail } from "@/components/sections/RecipeDetail";
import { RecipeDiscovery } from "@/components/sections/RecipeDiscovery";
import { TechStack } from "@/components/sections/TechStack";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  description: site.description,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Telegram",
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
      <Problem />
      <HowItWorks />
      <PhotoRecognition />
      <RecipeDiscovery />
      <RecipeDetail />
      <Favorites />
      <Features />
      <TechStack />
      <About />
      <FinalCta />
    </>
  );
}
