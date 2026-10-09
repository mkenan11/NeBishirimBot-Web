# NeBishirimBot — website və web app

NeBishirimBot-un rəsmi saytı. Burada iki hissə var:

- `/`: məhsul səhifəsi (landing).
- `/app`: işlək web versiya. Telegram-a keçmədən istifadə olunur: ərzaqlar, şəkildən tanıma, «Nə bişirim?», tam resept və seçilmişlər.

Web app və Telegram bot **eyni backend-i və eyni core məntiqi** istifadə edir: <https://github.com/mkenan11/NeBishirimBot>. Bu repository-də business logic yoxdur, burada yalnız UI və server-side proxy var.

## Arxitektura

```
Brauzer ── httpOnly cookie ──▶ Next.js /api/* (proxy, bu repo) ── Bearer secret ──▶ Bot FastAPI /web/v1 ──▶ Neon + Gemini
```

- `src/app/api/[...path]/route.ts` sorğunu bot backend-inə ötürür. O, `INTERNAL_WEB_API_SECRET` əlavə edir və `nb_session` cookie-sini idarə edir.
- Gemini açarı, `DATABASE_URL` və Telegram token-i bu layihədə **yoxdur**.
- Qeydiyyat yoxdur. İlk girişdə anonim sessiya yaranır: `httpOnly`, `Secure`, `SameSite=Lax`, 1 il müddətinə. Backend-də yalnız token-in hash-i saxlanılır.
- Başqa saytdan göndərilən POST/PATCH/DELETE sorğuları rədd edilir (Origin / `Sec-Fetch-Site` yoxlaması).
- Şəkil göndərilməzdən əvvəl brauzerdə ~1600px JPEG-ə kiçildilir (Vercel-in 4.5 MB limiti).

## Texnologiya

- Next.js 16 (App Router, Cache Components) + TypeScript
- Tailwind CSS 4, `lucide-react`
- Fontlar: Fraunces və Onest (`next/font`). OG şəkli üçün TTF-lər `src/assets/fonts/` qovluğundadır (SIL Open Font License).

## İşə salmaq

```bash
npm install
cp .env.example .env.local   # BOT_API_URL və INTERNAL_WEB_API_SECRET doldur
npm run dev                   # http://localhost:3000
```

Landing env dəyişənləri olmadan da işləyir. `/app` isə backend olmadan «Web versiyası hələ qoşulmayıb» mesajını göstərir.

| Skript              | Nə edir                                 |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Development server                      |
| `npm run build`     | Production build                        |
| `npm run start`     | Build-dən sonra production server       |
| `npm run lint`      | ESLint                                  |
| `npm run typecheck` | Route tiplərini generasiya edir + `tsc` |

## Environment variables

| Dəyişən                   | Harada   | Təsvir                                                       |
| ------------------------- | -------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`    | public   | Saytın domeni (canonical, OG, sitemap)                       |
| `BOT_API_URL`             | server   | Bot FastAPI deployment-inin URL-i (`/web/v1` olmadan)        |
| `INTERNAL_WEB_API_SECRET` | server   | Bot backend-dəki eyni adlı dəyişənlə eyni, ən azı 32 simvol  |

## Struktur

```text
src/
  app/
    layout.tsx               # şriftlər, metadata
    (site)/                  # landing və /privacy (header + footer)
    app/                     # web app: /app, /app/photo, /app/recipes, /app/recipes/[slug], /app/favorites
    api/[...path]/route.ts   # bot backend-inə server-side proxy
    opengraph-image.tsx, robots.ts, sitemap.ts, icon.png, apple-icon.png
  components/
    app/                     # web app ekranları (client komponentlər)
    sections/                # landing bölmələri
  content/site.ts            # linklər, menyu, screenshot siyahısı
  lib/api.ts                 # brauzer tərəfi tipli API
  lib/bot-api.ts             # server tərəfi: backend çağırışı, cookie parametrləri
  lib/assets.ts              # public/ şəkillərini tapır və ölçüsünü oxuyur
```

## Loqo və screenshot-lar

- Loqo: `public/brand/logo.png`. Favicon: `src/app/icon.png` və `src/app/apple-icon.png`.
- Telegram screenshot-ları: `public/screenshots/`. Fayl adları, alt mətnlər və etiketlər `src/content/site.ts` faylındadır. Ölçülər build zamanı fayldan oxunur, fayl yoxdursa yer tutucu görünür.

## Deploy (Vercel)

1. **Əvvəl bot backend-i:** bot repo-sundakı `web-api` dəyişiklikləri deploy olunmalı, `migrations/003_web_access.sql` tətbiq edilməli və orada `INTERNAL_WEB_API_SECRET` təyin olunmalıdır (bot README-sinə bax).
2. Bu repository-ni Vercel-ə qoş. Framework avtomatik tanınır.
3. Environment variables: `NEXT_PUBLIC_SITE_URL`, `BOT_API_URL`, `INTERNAL_WEB_API_SECRET`.
4. Function region-u bot backend-i və Neon-a yaxın seç (məs. `fra1`). `/api` route-unun `maxDuration` dəyəri 60 saniyədir.

## Müəllif

Kanan Mammadov — [LinkedIn](https://www.linkedin.com/in/kanan-mammadov1/)
