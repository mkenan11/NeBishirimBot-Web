import type { Metadata } from "next";
import { PhotoScreen } from "@/components/app/PhotoScreen";

export const metadata: Metadata = { title: "Şəkildən tanıma" };

export default function PhotoPage() {
  return <PhotoScreen />;
}
