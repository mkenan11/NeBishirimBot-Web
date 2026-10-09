import Image from "next/image";
import { ImageUp } from "lucide-react";
import { screenshots, type ScreenshotKey } from "@/content/site";
import { findPublicImage } from "@/lib/assets";

type Props = {
  shot: ScreenshotKey;
  /** Ekranda göstərilən təxmini en — `next/image` üçün `sizes`. */
  sizes?: string;
  preload?: boolean;
  className?: string;
};

// Tam telefon ekranında görüntü 340px enində göstərilir (2x çəkilib, kəskin qalır).
const PHONE_SCREEN_WIDTH = 340;

export function Screenshot({ shot, sizes = "(max-width: 640px) 90vw, 340px", preload, className = "" }: Props) {
  const meta = screenshots[shot];
  const image = findPublicImage("screenshots", meta.file);

  if (!image) {
    return (
      <div
        role="img"
        aria-label={`${meta.label} — screenshot tezliklə əlavə olunacaq`}
        className={`flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-sage-300 bg-sage p-4 text-center ${className}`}
      >
        <ImageUp className="size-8 text-forest-600" aria-hidden />
        <span className="text-sm font-semibold text-forest-800">{meta.label}</span>
        <code className="rounded bg-cream px-2 py-1 text-xs break-all text-muted">public/screenshots/{meta.file}.png</code>
      </div>
    );
  }

  const img = (
    <Image
      src={image.src}
      alt={meta.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      preload={preload}
      quality={90}
      className="h-auto w-full"
    />
  );

  // Tam ekran görüntüsü telefon çərçivəsində: səhifənin öz rəngləri ilə qarışmasın.
  if (image.height / image.width > 1.8) {
    return (
      <div
        className={`w-full rounded-[2.75rem] bg-forest-950 p-[9px] shadow-phone ring-1 ring-black/20 ${className}`}
        style={{ maxWidth: PHONE_SCREEN_WIDTH + 18 }}
      >
        <div className="overflow-hidden rounded-[2.2rem] bg-cream">{img}</div>
      </div>
    );
  }

  // Kəsilmiş hissə (məs. «Necə işləyir?» addımları): aydın sərhədli kart.
  return (
    <div
      className={`w-full overflow-hidden rounded-[22px] border border-forest-900/15 bg-cream shadow-shot ${className}`}
      style={{ maxWidth: image.width / 2 }}
    >
      {img}
    </div>
  );
}
