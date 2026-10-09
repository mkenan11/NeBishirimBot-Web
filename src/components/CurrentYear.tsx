import { cacheLife } from "next/cache";

// Səhifə statik qalır, il isə keş müddəti bitdikcə (gündə bir dəfə) yenidən hesablanır.
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
