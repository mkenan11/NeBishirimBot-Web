import { site } from "@/content/site";
import { PointList, Section, SectionHeading } from "../Section";
import { LeafShape } from "../icons";
import { Screenshot } from "../Screenshot";

export function PhotoRecognition() {
  return (
    <Section id="sekilden-tanima" tone="sage" labelledBy="photo-title">
      <LeafShape aria-hidden className="absolute -top-6 right-[8%] size-28 text-forest-600/10" />
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="order-2 md:order-1">
          <Screenshot shot="photo" sizes="(max-width: 768px) 92vw, 540px" className="mx-auto" />
        </div>

        <div className="order-1 md:order-2">
          <SectionHeading
            id="photo-title"
            eyebrow="Şəkildən tanıma"
            title="Şəkli göndər, ərzaqları tanısın."
            intro={`Hər şeyi yazmağa ehtiyac yoxdur. Masadakı və ya soyuducudakı məhsulların şəklini göndər — ${site.name} AI ilə şəkildəki ərzaqları müəyyən edir.`}
          />
          <PointList
            items={[
              { title: "Siyahını yoxla", text: "Tanınan ərzaqlardan istədiyini seç, adını düzəlt və ya artığını sil." },
              {
                title: "Sən təsdiqləyirsən",
                text: "Fotodan tanınan ərzaqlar sən təsdiqləməyincə siyahına əlavə olunmur.",
              },
            ]}
          />
        </div>
      </div>
    </Section>
  );
}
