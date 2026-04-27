import { TERMS, TermsSection } from "@/lib/locales/terms";
import { useLocale } from "@/hooks/useLocale";
import { LocaleSwitcher } from "@/components/brite/shared/LocaleSwitcher";

function Section({ section }: { section: TermsSection }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-2">{section.heading}</h2>
      <p className="text-foreground/85">{section.body}</p>
      {section.items && (
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TermsPage() {
  const { locale, setLocale } = useLocale();
  const t = TERMS[locale];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-foreground">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.updated}</p>
        </div>
        <LocaleSwitcher locale={locale} onChange={setLocale} />
      </div>

      <section className="space-y-8 text-sm leading-relaxed">
        {t.sections.map((section) => (
          <Section key={section.heading} section={section} />
        ))}
      </section>
    </div>
  );
}
