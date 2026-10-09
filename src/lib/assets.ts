import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type LocalImage = { src: string; width: number; height: number };

const EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

/**
 * `public/<dir>/<name>.(png|jpg|jpeg|webp)` faylını build zamanı tapır və ölçüsünü oxuyur.
 * Fayl yoxdursa `null` qaytarır ki, komponent yer tutucu göstərə bilsin.
 */
export function findPublicImage(dir: string, name: string): LocalImage | null {
  for (const ext of EXTENSIONS) {
    const path = join(process.cwd(), "public", dir, `${name}.${ext}`);
    if (!existsSync(path)) continue;
    const size = readImageSize(readFileSync(path));
    if (!size) continue;
    return { src: `/${dir}/${name}.${ext}`, ...size };
  }
  return null;
}

function readImageSize(buf: Buffer): { width: number; height: number } | null {
  // PNG: IHDR eni və hündürlüyü 16-cı baytdan başlayır.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG: SOFn markerini tapana qədər seqmentləri keçirik.
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSof) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return null;
  }

  // WebP: VP8X, VP8L və VP8 formatları.
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    }
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    if (chunk === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
  }

  return null;
}
