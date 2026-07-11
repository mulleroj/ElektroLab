# SKILL: Animovaná výuková dema ElektroLabu

Určeno pro coding agenty (Fable, Cursor, Codex a další), kteří budou do
ElektroLabu přidávat nebo upravovat **pohyblivé výukové ukázky** podle
animačního rámce z MVP-11A.

---

## 1. Účel animačních dem

Animovaná dema ukazují **děj v čase** (kotva se přitáhne, rotor se roztočí,
regulační smyčka reaguje), který statický obrázek nevysvětlí. Cíl je
pedagogický: žák 2. ročníku SOU má pochopit princip — ne obdivovat efekt.
Každá animace je **názorná školní ukázka, ne fyzikálně přesná simulace**
a nikdy nesmí sloužit jako návod na práci na skutečném zařízení.

## 2. Co musíš přečíst před začátkem

V tomto pořadí — nezačínej psát kód dřív:

1. `docs/ANIMATED_DEMO_ARCHITECTURE.md` — architektura a pravidla rámce
2. `src/components/animation/useAnimatedDemo.ts` — stavový model přehrávání
3. `src/components/animation/useMotionPolicy.ts` — Klidný režim + reduced motion
4. `src/components/animation/AnimatedDemoControls.tsx` — jednotné ovládání
5. `src/components/demos/ContactorRelayDemo.tsx` — **referenční vzor**
6. `src/components/InteractiveDemoRenderer.tsx` — jak se dema renderují
7. `src/types.ts` — konfigurační typy dem (`InteractiveDemo` union)
8. `src/index.css` — sekce „MVP-11A: animovaná dema“ + tokeny v `:root`
9. Lekci v `src/data/lessons-*.ts`, do které demo patří (texty, safetyNote)

## 3. Architektura rámce (souhrn)

- `useMotionPolicy(calmMode)` → smí/nesmí běžet autoplay a souvislý pohyb.
- `useAnimatedDemo({ stepCount, autoPlayAllowed })` → `status`
  (`idle | playing | paused | completed`), `stepIndex`, `hasCompletedOnce`,
  akce `play/pause/nextStep/reset`. Jediný časovač (`setTimeout` na krok),
  vždy uklizený.
- `AnimatedDemoControls` → jednotná tlačítka Spustit / Pauza / Další krok /
  Resetovat + textový stav s `role="status"`.
- Demo komponenta drží jen: pole pedagogických kroků (název + vysvětlení),
  čisté odvození vizuálních příznaků ze `stepIndex`, SVG schéma, textový
  výpis stavu a gating `onContinue` přes `hasCompletedOnce`.
- Veřejný kontrakt dem `{ demo, calmMode, onContinue }` se nemění.

## 4. Vizuální konzistence

- Pouze React + TypeScript + **SVG + CSS**. Žádné externí obrázky.
- Barvy výhradně z tokenů v `:root` (`--color-primary`, `--color-border`…)
  nebo z už používaných odstínů (#94a3b8, #cbd5e1, #e8f0f8, #f8fafc).
- Tlačítka jen přes třídy `.btn .btn--primary/.btn--secondary`.
- Boxy a panely: stávající třídy (`.interactive-demo`,
  `.animated-demo__stage`, `.animated-demo__state`, `.logic-gate__explain`,
  `.calm-step-hint`).
- CSS třídy nového dema prefixuj názvem dema (`transformer-…`), přidej je do
  sekce MVP-11A v `index.css`, včetně bloku
  `@media (prefers-reduced-motion: reduce)`.

## 5. Fyzikální a pedagogická správnost

- Každý krok musí být **věcně správně** na úrovni učiva SOU; nejednoznačná
  tvrzení ověř v lekci, případně se zeptej učitele.
- Terminologie shodná s lekcí (cívka, kotva, kontakt, ovládací vs. výkonový
  obvod…). Nezaváděj nové pojmy, které lekce nezná.
- Zjednodušení jsou v pořádku (viz kap. 6), ale nesmí učit chybu
  (např. že kontakt spíná bez cívky, že se obvody vodivě propojí).
- `safetyNote` lekce se nemění a demo nesmí vypadat jako montážní návod.

## 6. Simulace vs. názorná animace

- **Fyzikálně vypočítaná simulace**: hodnoty se počítají z fyzikálních
  vztahů (např. Ohmův zákon v číslech). Použij jen, když lekce s čísly
  skutečně pracuje — a výpočet musí být ověřitelně správně.
- **Zjednodušená názorná animace**: ukazuje posloupnost a příčinnost, ne
  přesné hodnoty a časy (stykač: přítah kotvy trvá ms, v demu ~1 s).
  To je výchozí druh dem v ElektroLabu.
- Nikdy je nemíchej mlčky: pokud demo něco zjednodušuje, text u dema nebo
  komentář v kódu to musí říct („názorná ukázka, ne přesná simulace“).

## 7. Povinné ovládací prvky

Výhradně přes `AnimatedDemoControls`:

- **Spustit** — zahájí/obnoví automatické přehrávání (jen mimo Klidný režim
  a reduced motion),
- **Pauza** — zastaví pohyb na aktuálním stavu,
- **Další krok** — o jeden pedagogicky smysluplný stav; funguje z idle,
  paused i za běhu,
- **Resetovat** — návrat na krok 0; neodebírá už dosažené povolení
  pokračovat (`hasCompletedOnce` zůstává).

Ovládání rychlosti se v MVP-11A nepřidává. Ovládání nikdy nezapisuje
progress, XP, localStorage ani sessionStorage.

## 8. Klidný režim (calmMode)

- Žádný automatický souvislý pohyb — `useMotionPolicy` vypne autoplay,
  ovládání nabízí jen „Další krok“ a „Resetovat“.
- Přechody mezi stavy okamžité (globální `.calm-mode *` pravidlo).
- Všechny informace zůstávají dostupné (texty kroků, výpis stavu).
- Přidej klidový hint (`.calm-step-hint`), který řekne, jak demo procházet.

## 9. prefers-reduced-motion

- Zacházej s ním **minimálně stejně opatrně jako s Klidným režimem** —
  `useMotionPolicy` ho sleduje včetně změny za běhu.
- Žádné rotace, pulzování ani opakované pohyby; přechody vypni v bloku
  `@media (prefers-reduced-motion: reduce)`.
- Krokování a textová vysvětlení zůstávají beze změny.
- Klidný režim + reduced motion současně: pohyb se nikdy nevynucuje.

## 10. Projektorový režim

- Nic se v něm nesmí ukládat — splněno tím, že demo nikdy nezapisuje žádné
  úložiště (viz kap. 7).
- Texty a tlačítka musí zůstat čitelné po zvětšení třídou `projector-mode`;
  klíčové stavové texty drž mimo SVG (SVG texty se nezvětšují s remy).

## 11. Mobilní zobrazení

- SVG má `viewBox` a šířku 100 % (`.animated-demo__stage svg`) — schéma se
  zmenšuje celé; texty v SVG jsou jen doplňkové popisky, nikdy jediný
  nositel informace.
- Tlačítka ovládání mají min. výšku 2,75 rem (dotyková plocha) a wrapují.
- Zkontroluj šířku ~375 px: nic nepřetéká, stavový výpis se přeskládá.

## 12. Přístupnost

- Tlačítka mají jasné accessible names (text, ikony `aria-hidden`).
- Vše ovladatelné klávesnicí, `:focus-visible` funguje.
- Jediná aria-live oblast (`role="status"` v ovládání) oznamuje krok a stav.
- SVG: `aria-hidden="true"` pokud je vše souběžně v textu; jinak `role="img"`
  s výstižným popisem.
- Stav nikdy jen barvou (měň i tloušťku/polohu/text), animace nikdy jediný
  nositel informace, žádné blikání ani vysokofrekvenční změny.

## 13. Výkon a cleanup

- Jeden `setTimeout` na krok (dává `useAnimatedDemo`) — žádné vlastní
  `setInterval` pro plynulý pohyb, žádné vlastní timery v demu.
- Plynulý pohyb = CSS transition/animation; `requestAnimationFrame` jen
  když je nutné počítat každý snímek, a pak: ulož id, zruš při pause,
  reset i unmount, ošetři návrat záložky z pozadí, žádná nekontrolovaná
  nekonečná smyčka.
- Při schování záložky se přehrávání pozastaví (řeší hook) — nikdy nesmí
  po návratu přeskočit kroky ani vzniknout druhý časovač.
- Při unmountu nesmí zůstat žádný timeout, frame ani listener.

## 14. Postup vytvoření nového animačního dema

1. Ověř zadání: která lekce, jaký princip, co má žák pochopit.
2. Navrhni pedagogické kroky (5–7; krok 0 = klidový výchozí stav) a jejich
   texty — **nech schválit učitelem** před kreslením.
3. Zkopíruj strukturu `ContactorRelayDemo.tsx` (kroky → příznaky → SVG →
   výpis stavu → ovládání → gating `onContinue`).
4. Pokud demo potřebuje nový `demo.type`: přidej config do `types.ts`,
   větev do `InteractiveDemoRenderer` **a** do `contentValidation.ts`
   (exhaustive switch s `assertNever` musí zůstat).
5. Nakresli SVG, přidej CSS (kap. 4), napoj motion policy (kap. 8–9).
6. Projdi QA checklist (kap. 15), spusť `npm run check`.
7. Commit → PR podle kap. 16.

## 15. QA checklist

- [ ] Demo se po otevření samo nespustí (žádný autoplay)
- [ ] Spustit zahájí animaci, Pauza ji skutečně zastaví
- [ ] Další krok funguje z idle i paused; Reset vrátí krok 0
- [ ] Všechny pedagogické kroky dosažitelné krokováním i autoplayem
- [ ] `onContinue` až po projití všech kroků; Reset povolení neodebere
- [ ] Pohyb je viditelný i bez barvy (poloha/tvar/text)
- [ ] Text popisuje každý krok; výpis stavu souhlasí se schématem
- [ ] Klidný režim: žádný souvislý pohyb, krokování funguje
- [ ] prefers-reduced-motion: žádná rotace/pulzování, krokování funguje
- [ ] Projektorový režim nic neukládá a je čitelný
- [ ] Přepnutí záložky: pauza, žádné přeskočení kroků, žádné duplicitní timery
- [ ] Odchod z lekce: žádný běžící timer/listener (unmount cleanup)
- [ ] Mobil ~375 px: nic nepřetéká, tlačítka ≥ 2,75 rem
- [ ] Ostatní dema, lekce, XP, odznaky, localStorage beze změny
- [ ] `npm run check` (validate:content + typecheck + lint + build): PASS,
      Errors: 0, Warnings: 0
- [ ] Konzole prohlížeče bez chyb

## 16. Git workflow

- Jedno demo = jedna větev `feat/electrolab-…` = jeden PR do `main`.
- Před začátkem: čistý pracovní strom, `main` aktuální, předchozí demo
  sloučené.
- Žádný commit bez proběhlého `npm run check` a QA checklistu.
- **Žádný commit ani push bez potvrzení uživatele.** Nikdy force-push.

## 17. Handoff pro dalšího agenta

Na konci práce zapiš do PR (a do závěrečného reportu):

- které demo vzniklo/změnilo se a podle jakého vzoru,
- seznam pedagogických kroků a kdo je schválil,
- co je zjednodušené oproti fyzikální realitě,
- výsledky `npm run check` a QA checklistu,
- známá omezení a přesný další krok.

## 18. STOP podmínky — kdy NESMÍŠ pokračovat

Zastav a zeptej se uživatele, pokud:

- není jasné, co přesně má žák z animace pochopit,
- pedagogické kroky nejsou schválené a musel by sis je domyslet,
- fyzikální tvrzení nedokážeš ověřit z lekce nebo od učitele,
- demo by vyžadovalo změnu obsahu lekce, otázek, XP nebo odznaků,
- demo by vyžadovalo novou závislost (animační knihovnu, Canvas, WebGL…),
- referenční vzor (`ContactorRelayDemo`) v repu chybí nebo je rozbitý,
- pracovní strom není čistý nebo `npm run check` neprochází už před změnou.

## Výslovné zákazy

- ❌ nový paralelní vizuální systém (vlastní tokeny, vlastní panely),
- ❌ vlastní ovládací tlačítka mimo `AnimatedDemoControls`,
- ❌ animace pochopitelná jen podle barvy,
- ❌ autoplay bez zásahu uživatele (i po resetu),
- ❌ pohyb, který nelze zastavit,
- ❌ neuklizené intervaly, timeouty nebo requestAnimationFrame,
- ❌ fyzikální tvrzení, která nejsou ověřená,
- ❌ změny obsahu lekce bez potvrzení učitele,
- ❌ přidání knihovny bez souhlasu (Framer Motion, GSAP, Three.js…),
- ❌ implementace více animací v jednom batchi, dokud referenční vzor
  není ověřený a sloučený.
