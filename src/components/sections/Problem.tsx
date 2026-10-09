import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";

// Botun özünün /start mesajındakı nümunə ərzaqlar.
const example = ["Kartof", "yumurta", "soğan"];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="border-y border-forest-900/8 bg-beige">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <h2 id="problem-title" className="text-[1.9rem] leading-[1.15] font-semibold text-forest-900 sm:text-4xl">
            Ərzaq var. Sual həmişə eynidir: bunlarla nə bişirim?
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Soyuducuda bir neçə məhsul olur, amma onlardan nə hazırlamaq barədə qərar vermək vaxt aparır.{" "}
            {site.name} evdə olanlardan başlayır və uyğun reseptləri bir yerdə göstərir.
          </p>
        </div>

        <figure className="rounded-3xl bg-cream p-6 ring-1 ring-forest-900/8 sm:p-8">
          <figcaption className="text-sm font-medium text-muted">Məsələn, botu belə başladırsan:</figcaption>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {example.map((item) => (
              <span key={item} className="rounded-full bg-sage px-4 py-2 font-medium text-forest-800">
                {item}
              </span>
            ))}
            <ArrowRight className="mx-1 size-5 text-orange-500" aria-hidden />
            <span className="rounded-full bg-forest-800 px-4 py-2 font-medium text-cream">Nə bişirim?</span>
          </div>
          <p className="mt-5 leading-relaxed text-muted">
            Bot bu ərzaqlara uyğun reseptləri tapır və hansılarının yalnız evdəkilərlə hazırlandığını, hansı üçün
            1–2 əlavə məhsul lazım olduğunu ayrıca göstərir.
          </p>
        </figure>
      </div>
    </section>
  );
}
