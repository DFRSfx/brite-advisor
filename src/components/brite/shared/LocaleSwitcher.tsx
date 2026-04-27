import { Locale } from "@/hooks/useLocale";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];

interface Props {
  locale: Locale;
  onChange: (l: Locale) => void;
}

export function LocaleSwitcher({ locale, onChange }: Props) {
  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            locale === l.code
              ? "bg-foreground text-background cursor-default border border-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer border border-transparent"
          }`}
        >
          <img
            src={`/flags/${l.code}.svg`}
            alt={l.code}
            className="w-4 h-4 rounded-sm object-cover"
          />
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
