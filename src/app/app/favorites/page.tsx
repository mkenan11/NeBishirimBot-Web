import type { Metadata } from "next";
import { FavoritesScreen } from "@/components/app/FavoritesScreen";

export const metadata: Metadata = { title: "Seçilmiş reseptlər" };

export default function FavoritesPage() {
  return <FavoritesScreen />;
}
