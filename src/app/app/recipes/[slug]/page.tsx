import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeDetailScreen } from "@/components/app/RecipeDetailScreen";

export const metadata: Metadata = { title: "Resept" };

export default function RecipeDetailPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-forest-900/5" aria-hidden />}>
      <RecipeDetailScreen />
    </Suspense>
  );
}
