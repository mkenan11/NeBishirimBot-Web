import type { Metadata } from "next";
import { Suspense } from "react";
import { FavoriteDetailScreen } from "@/components/app/FavoriteDetailScreen";

export const metadata: Metadata = { title: "Seçilmiş resept" };

export default function FavoriteDetailPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-forest-900/5" aria-hidden />}>
      <FavoriteDetailScreen />
    </Suspense>
  );
}
