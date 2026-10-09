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

// Telegram tünd temasının fonu: screenshot kənarları çərçivə ilə birləşsin.
const frame = "overflow-hidden rounded-2xl bg-[#0e1621] shadow-shot ring-1 ring-forest-900/15 sm:rounded-[20px]";

export function Screenshot({ shot, sizes = "(max-width: 640px) 92vw, 520px", preload, className = "" }: Props) {
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

  // Screenshot öz real enindən böyük göstərilmir ki, mətn bulanıqlaşmasın.
  return (
    <div className={`${frame} w-full ${className}`} style={{ maxWidth: image.width }}>
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
    </div>
  );
}
