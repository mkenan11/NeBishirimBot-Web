"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, ShoppingBasket, Star, UtensilsCrossed } from "lucide-react";
import { Suspense } from "react";

const tabs = [
  { href: "/app", label: "Ərzaqlarım", icon: ShoppingBasket, match: (p: string) => p === "/app" },
  { href: "/app/photo", label: "Şəkil", icon: Camera, match: (p: string) => p.startsWith("/app/photo") },
  { href: "/app/recipes", label: "Nə bişirim?", icon: UtensilsCrossed, match: (p: string) => p.startsWith("/app/recipes") },
  { href: "/app/favorites", label: "Seçilmişlər", icon: Star, match: (p: string) => p.startsWith("/app/favorites") },
];

type Variant = "bottom" | "top";

/** Mobildə ekranın altında, desktopda header-in içində göstərilir. */
export function AppNav({ variant }: { variant: Variant }) {
  // Dinamik route-larda URL yalnız runtime-da məlumdur; o vaxta qədər aktiv tab-sız göstərilir.
  return (
    <Suspense fallback={<NavList variant={variant} pathname="" />}>
      <ActiveNav variant={variant} />
    </Suspense>
  );
}

function ActiveNav({ variant }: { variant: Variant }) {
  return <NavList variant={variant} pathname={usePathname()} />;
}

function NavList({ variant, pathname }: { variant: Variant; pathname: string }) {
  if (variant === "top") {
    return (
      <nav aria-label="Web app menyusu" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {tabs.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${
                    active ? "bg-forest-800 text-cream" : "text-muted hover:bg-forest-900/5 hover:text-forest-900"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Web app menyusu"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/15 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-12px_rgb(15_36_25/0.35)] backdrop-blur-sm md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-forest-900" : "text-muted"
                }`}
              >
                <span className={`grid h-7 w-12 place-items-center rounded-full ${active ? "bg-sage" : ""}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
