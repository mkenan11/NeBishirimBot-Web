import { site } from "@/content/site";
import { GitHubIcon } from "../icons";

const stack = [
  { name: "Python", role: "Bot məntiqi" },
  { name: "Telegram Bot API", role: "İstifadəçi interfeysi" },
  { name: "Gemini API", role: "Şəkil tanıma və reseptlər" },
  { name: "PostgreSQL", role: "Ərzaqlar və seçilmişlər" },
  { name: "FastAPI", role: "Webhook və web API" },
  { name: "Next.js", role: "Website və web app" },
];

export function TechStack() {
  return (
    <section aria-labelledby="tech-title" className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-wide text-orange-ink uppercase">Texnologiya</p>
            <h2 id="tech-title" className="text-3xl font-semibold text-forest-900">
              Necə hazırlanıb?
            </h2>
          </div>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-forest-800 underline decoration-forest-800/30 underline-offset-4 hover:decoration-forest-800"
          >
            <GitHubIcon className="size-5" />
            Mənbə kodu GitHub-da
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap gap-3">
          {stack.map((item) => (
            <li key={item.name} className="rounded-2xl border border-forest-900/12 px-4 py-3">
              <p className="font-semibold text-forest-900">{item.name}</p>
              <p className="text-sm text-muted">{item.role}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted">
          Yeniləmələr QStash növbəsi ilə ardıcıl emal olunur, testlər hər dəyişiklikdə GitHub Actions ilə avtomatik
          işləyir.
        </p>
      </div>
    </section>
  );
}
