import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name} — Evdə bunlar var, nə bişirim?`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "src/assets/fonts");

export default async function Image() {
  const [fraunces, onest] = await Promise.all([
    readFile(join(fonts, "Fraunces-SemiBold.ttf")),
    readFile(join(fonts, "Onest-Medium.ttf")),
  ]);

  const logoData = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const logo = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fbf7ef",
          fontFamily: "Onest",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "#e6eee3",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={88} height={88} alt="" />
          <span style={{ fontSize: 40, color: "#163223" }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 92, lineHeight: 1.05, color: "#163223", display: "flex", flexDirection: "column" }}>
            <span>Evdə bunlar var,</span>
            <span style={{ color: "#d4651c" }}>nə bişirim?</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#4d5d54" }}>
            Evdəki ərzaqlara uyğun reseptlər — Telegram-da, Azərbaycan dilində.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Onest", data: onest, style: "normal", weight: 500 },
      ],
    },
  );
}
