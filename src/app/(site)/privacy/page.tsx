import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";

const title = "Məxfilik siyasəti";
const description = `${site.name} hansı məlumatları saxlayır, hansı xarici xidmətlərdən istifadə edir və məlumatlarını necə silə bilərsən.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  // openGraph obyekt kimi tam əvəz olunur, ona görə əsas sahələr burada da verilir.
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/privacy",
    title: `${title} — ${site.name}`,
    description,
  },
};

const UPDATED = "9 oktyabr 2026";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-forest-900/10 pt-8">
      <h2 id={id} className="text-2xl font-semibold text-forest-900">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-forest-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 pb-20 sm:px-6 md:pt-16">
      <p className="text-sm font-semibold tracking-wide text-orange-ink uppercase">Məxfilik</p>
      <h1 className="mt-3 text-4xl leading-tight font-semibold text-forest-900 sm:text-5xl">Məxfilik siyasəti</h1>
      <p className="mt-4 text-sm text-muted">Son yenilənmə: {UPDATED}</p>

      <p className="mt-8 text-lg leading-relaxed text-muted">
        Bu səhifə {site.name}-un (Telegram botu və web versiyası) hansı məlumatlarla işlədiyini sadə dildə izah edir.
        Məhsul yalnız öz funksiyalarına lazım olan məlumatları saxlayır: Telegram-da onları Telegram istifadəçi ID-nə,
        web versiyasında isə brauzerindəki anonim sessiyaya bağlayır.
      </p>

      <div className="mt-12 space-y-10">
        <Block id="saxlanilanlar" title="Hansı məlumatlar saxlanılır?">
          <p>Bot aşağıdakıları PostgreSQL verilənlər bazasında (Neon) saxlayır:</p>
          <ul>
            <li>
              <strong>Telegram istifadəçi ID-n</strong> — məlumatlarını səninlə əlaqələndirmək üçün.
            </li>
            <li>
              <strong>Ərzaqların</strong> — siyahına əlavə etdiyin və təsdiqlədiyin məhsullar.
            </li>
            <li>
              <strong>Seçilmiş reseptlərin</strong> — «⭐ Seçilmişlərə əlavə et» ilə saxladıqların.
            </li>
            <li>
              <strong>Sessiya və seçimlər</strong> — botun söhbətdə harada qaldığını, son resept siyahısını, vaxt və
              nəfər seçimlərini yadda saxlamaq üçün.
            </li>
            <li>
              <strong>Alış-veriş siyahısı</strong> — bu bölmə menyudan çıxarılıb, amma əvvəl yaradılmış siyahılar
              saxlanılır.
            </li>
            <li>
              <strong>Texniki yeniləmə qeydləri</strong> — eyni Telegram mesajının iki dəfə emal olunmaması üçün yeniləmə
              ID-si, statusu və vaxtı.
            </li>
          </ul>
          <p>Bot səndən ad, telefon nömrəsi və ya e-poçt ünvanı istəmir.</p>
        </Block>

        <Block id="xarici-xidmetler" title="Hansı xarici xidmətlərdən istifadə olunur?">
          <ul>
            <li>
              <strong>Telegram</strong> — botla bütün yazışma Telegram üzərindən gedir. Mesajların və söhbət
              tarixçəsinin Telegram tərəfindən işlənməsinə Telegram-ın öz qaydaları tətbiq olunur.
            </li>
            <li>
              <strong>Google Gemini API</strong> — şəkil göndərəndə ərzaqları tanımaq üçün həmin şəkil, resept
              istəyəndə isə sorğu üçün lazım olan ərzaq siyahısı və seçimlər Google Gemini xidmətinə göndərilə bilər.
              Bu məlumatların Google tərəfindən işlənməsinə Google-un öz qaydaları tətbiq olunur.
            </li>
            <li>
              <strong>Neon</strong> — yuxarıda sadalanan məlumatların saxlandığı PostgreSQL bazası.
            </li>
            <li>
              <strong>Upstash QStash</strong> — Telegram-dan gələn yeniləmələr emal olunmazdan əvvəl bu növbə xidmətindən
              keçir.
            </li>
          </ul>
          <p>
            Botun verilənlər bazasında şəkillər üçün ayrıca cədvəl yoxdur. Buna baxmayaraq, foto və mesajlarda şəxsi və
            ya həssas məlumat paylaşmamağı tövsiyə edirik.
          </p>
        </Block>

        <Block id="silme" title="Məlumatlarını necə silə bilərsən?">
          <p>
            <strong>Bütün hesab məlumatlarını silmək üçün</strong> botla şəxsi söhbətdə{" "}
            <code className="rounded bg-sage px-1.5 py-0.5 text-forest-900">/delete_my_data</code> yaz və ya «ℹ️ Kömək»
            → «🔐 Məxfilik və məlumatlarım» bölməsində «🗑️ Bütün məlumatlarımı sil» düyməsini seç. Təsdiq üçün 5
            dəqiqə vaxtın olur.
          </p>
          <p>Təsdiqdən sonra bunlar birlikdə silinir: ərzaqların, seçilmiş reseptlərin, alış-veriş siyahın, sessiyan və istifadəçi qeydin.</p>
          <p>Bu əməliyyatla silinməyənlər:</p>
          <ul>
            <li>
              İstifadəçi ID-si olmayan texniki yeniləmə qeydləri — eyni mesajın təkrar emalının qarşısını almaq üçün
              qalır.
            </li>
            <li>Telegram söhbət tarixçəsi — onu Telegram-da özün silə bilərsən.</li>
            <li>Xarici xidmətlərin (məsələn, Google) öz qeydləri.</li>
          </ul>
          <p>
            «🧺 Ərzaqlarım» bölməsindəki «🗑️ Hamısını sil» düyməsi isə yalnız ərzaq siyahısını təmizləyir; digər
            məlumatlar qalır.
          </p>
        </Block>

        <Block id="ai" title="AI haqqında qeyd">
          <p>
            Reseptlər və şəkildən tanıma AI ilə hazırlanır və bəzən səhv ola bilər. Məhsulları, miqdarları, allergiya
            risklərini və bişirmə qaydalarını özün də yoxla.
          </p>
        </Block>

        <Block id="website" title="Web versiyası və cookie">
          <p>
            Web versiyasında qeydiyyat yoxdur. İlk girişdə brauzerinə bir <strong>sessiya cookie-si</strong>{" "}
            (<code className="rounded bg-sage px-1.5 py-0.5 text-forest-900">nb_session</code>) yazılır. O, ərzaqlarını
            və seçilmiş reseptlərini bu brauzerlə əlaqələndirmək üçündür; reklam və ya izləmə üçün istifadə olunmur.
            Serverdə cookie-nin özü deyil, yalnız onun hash-i saxlanılır.
          </p>
          <ul>
            <li>Web istifadəçisinin məlumatları Telegram-dakı kimi eyni bazada, ayrıca anonim ID ilə saxlanılır.</li>
            <li>
              Şəkil göndərəndə o, brauzerdə kiçildilir və ərzaqları tanımaq üçün Google Gemini-yə ötürülür; bazada şəkil
              faylı saxlanılmır.
            </li>
            <li>
              Sui-istifadənin qarşısını almaq üçün AI sorğularının sayı hesablanır. Bunun üçün IP ünvanının özü deyil,
              açarla hash-lənmiş forması qısa müddət saxlanılır.
            </li>
            <li>
              Cookie-ni silsən və ya başqa cihazdan girsən, əvvəlki siyahın görünməyəcək. Bütün web məlumatlarını{" "}
              <Link href="/app" className="font-semibold text-forest-800 underline underline-offset-4">
                Ərzaqlarım
              </Link>{" "}
              səhifəsinin altındakı «Bütün məlumatlarımı sil» ilə silə bilərsən.
            </li>
          </ul>
          <p>Saytda analitika alətləri yoxdur. Hostinq provayderi standart texniki server qeydləri saxlaya bilər.</p>
        </Block>

        <Block id="elaqe" title="Dəyişikliklər və əlaqə">
          <p>
            Bot yeniləndikcə bu səhifə də dəyişə bilər; son yenilənmə tarixi yuxarıda göstərilir. Sualın varsa,{" "}
            <a href={site.links.linkedin} {...external} className="font-semibold text-forest-800 underline underline-offset-4">
              LinkedIn
            </a>{" "}
            vasitəsilə {site.creator} ilə əlaqə saxla və ya{" "}
            <a href={site.links.github} {...external} className="font-semibold text-forest-800 underline underline-offset-4">
              GitHub repository-sinə
            </a>{" "}
            bax.
          </p>
        </Block>
      </div>

      <p className="mt-14">
        <Link href="/" className="font-semibold text-forest-800 underline underline-offset-4">
          ← Ana səhifəyə qayıt
        </Link>
      </p>
    </article>
  );
}
