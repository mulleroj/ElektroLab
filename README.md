# ElektroLab

**Bezpečná dílna v mobilu pro budoucí elektrikáře.**

ElektroLab je interaktivní mikro-learningová aplikace pro žáky oboru elektrikář. Žáci procházejí krátkými lekcemi (5–10 minut) s interaktivními aktivitami, mini testy, XP a odznaky. Aplikace běží čistě v prohlížeči — bez backendu, bez přihlášení, bez externích CDN.

## Spuštění projektu

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:5173`.

### Další příkazy

```bash
npm run build      # produkční build do dist/
npm run preview    # náhled produkčního buildu
npm run typecheck  # kontrola TypeScript typů
npm run lint       # ESLint
```

## Co obsahuje MVP-0

MVP-0 je vertikální řez (vertical slice) — funkční kostra s jednou kompletní demo mikrolekcí:

| Oblast | Stav |
|---|---|
| Hlavní rozcestník (8 dlaždic předmětů) | ✅ |
| Předmět „Základy elektrotechniky" | ✅ |
| Téma „Stejnosměrný proud" (1. ročník) | ✅ |
| Mikrolekce „Co je elektrický obvod?" | ✅ |
| Bezpečnostní poznámka (povinná, viditelná) | ✅ |
| Interaktivní aktivita (klikací skládání obvodu) | ✅ |
| Mini test (3 otázky) | ✅ |
| XP a odznak „První zapojení" | ✅ |
| Ukládání pokroku do localStorage | ✅ |
| Klidný režim (přepínač) | ✅ |
| Hash routing | ✅ |
| Připraveno pro Netlify (`netlify.toml`) | ✅ |

### Demo cesta žáka

1. Otevři hlavní rozcestník
2. Vyber **Základy elektrotechniky**
3. Filtruj **1. ročník** → otevři **Stejnosměrný proud**
4. Spusť mikrolekci **Co je elektrický obvod?**
5. Přečti bezpečnostní poznámku a úvod
6. Splň aktivitu (klikni prvky ve správném pořadí)
7. Projdi mini test (3 otázky)
8. Získej XP a odznak „První zapojení"

## Co je mimo rozsah MVP-0

- Backend, přihlášení, cloud synchronizace
- Všech 30 mikrolekcí a zbývajících 7 předmětů
- Drag & drop, složité simulace, boss levely
- Denní výzvy, žebříčky, série, úrovně
- Service Worker / PWA (připraveno pro budoucí HTTPS nasazení)
- Učitelský režim, režim opakování
- Externí CDN (fonty, knihovny)

## localStorage pokrok

Klíč: `elektrolab-progress`

```json
{
  "totalXp": 30,
  "earnedBadges": ["prvni-zapojeni"],
  "lessons": {
    "co-je-obvod": {
      "activityCompleted": true,
      "quizCompleted": true,
      "completedAt": "2026-07-09T..."
    }
  },
  "calmMode": false
}
```

- XP se přičítá jednorázově za aktivitu (15 XP) a test (15 XP)
- Odznak se udělí po dokončení celé mikrolekce
- Klidný režim se ukládá a obnoví při příštím spuštění
- Pro reset pokroku smaž klíč v DevTools → Application → Local Storage

## Bezpečnostní omezení

ElektroLab je **školní výuková simulace**. Nesmí působit jako návod k samostatné práci na elektrickém zařízení pod napětím.

- Každá elektro lekce musí mít povinné pole `safetyNote`
- Validace při načtení: lekce bez `safetyNote` se nezobrazí (chyba v konzoli)
- Bezpečnostní poznámka je vždy viditelná nahoře v lekci, ne schovaná za testem
- Footer připomíná: nepracuj pod napětím bez odborného dohledu

## Struktura projektu

```
src/
├── components/     # React komponenty (UI)
├── data/           # Lokální data (předměty, témata, lekce, odznaky)
├── lib/            # Pomocné funkce (progress, validace, routing)
├── types.ts        # TypeScript typy
├── App.tsx         # Hlavní aplikace s hash routingem
└── main.tsx        # Vstupní bod
```

## Doporučené další kroky

1. **Mikrolekce 2–3** v tématu Stejnosměrný proud (Ohmův zákon, sériové/paralelní řazení)
2. **Témata 1. ročníku** — Veličiny a jednotky, El. kreslení
3. **PWA / Service Worker** po nasazení na HTTPS (Netlify)
4. **Onboarding** — výběr ročníku při prvním spuštění
5. **Učitelský režim** — projekce aktivity bez ukládání pokroku
6. **Přístupnost** — rozšířené ARIA, testování čtečkou obrazovky

## Příprava na závěrečnou zkoušku (připraveno, vypnuto)

Závěrečkový režim je **připravený architektonicky, ale vypnutý** — oficiální
zkušební okruhy zatím nebyly dodány a aplikace nesmí nabízet vymyšlené otázky.
Datový kontrakt, prázdný registr, validace a feature flag jsou
v `src/features/finalExam/`. Postup budoucího doplnění obsahu popisuje
skill `skills/electrolab-final-exam-content/SKILL.md`; stav a další kroky
shrnuje `docs/FINAL_EXAM_EXTENSION_STATUS.md`.

## Licence

Školní projekt — ElektroLab MVP-0.
