import type { Metadata } from "next";
import { AccountSection } from "@/components/app/AccountSection";
import { PantryScreen } from "@/components/app/PantryScreen";

export const metadata: Metadata = { title: "Ərzaqlarım" };

export default function PantryPage() {
  return (
    <>
      <PantryScreen />
      <AccountSection />
    </>
  );
}
