import { Screenshot } from "../Screenshot";
import { Section, SectionHeading } from "../Section";

export function Favorites() {
  return (
    <Section labelledBy="favorites-title">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="order-2 md:order-1">
          <Screenshot shot="favorites" sizes="(max-width: 768px) 92vw, 478px" className="mx-auto" />
        </div>
        <div className="order-1 md:order-2">
          <SectionHeading
            id="favorites-title"
            eyebrow="Seçilmiş reseptlər"
            title="Bəyəndiyin reseptlər itməsin"
            intro="«Seçilmişlərə əlavə et» ilə saxladığın reseptlər «Seçilmiş reseptlər» bölməsində qalır. Sonra yenidən aça, lazım olmayanı silə bilərsən."
          />
        </div>
      </div>
    </Section>
  );
}
