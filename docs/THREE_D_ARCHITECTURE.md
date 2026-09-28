# 3D architektura ElektroLabu

3D vrstvy ElektroLabu jsou volitelné doplňky k 2D lekcím. 2D demo zůstává
zdrojem kroků, autoplayu, pauzy, Calm Mode a gatingu; 3D pouze zrcadlí stejný
didaktický stav. Aktuální GLB-backed doplňky jsou transformátor, stykač,
asynchronní motor a statorový pohled pro `tocive-magneticke-pole`. Procedurální
3D pilot zůstává u `seriove-paralelni`.

## Rozhodnutí technologie

- `three` poskytuje nízkoúrovňový WebGL renderer, geometrii, kameru a lokální
  GLB/GLTF ekosystém.
- `@react-three/fiber` zapouzdřuje scénu v React 19 + TypeScriptu.
- Orbit kamera používá přímo `THREE.OrbitControls`; nepřidáváme další UI nebo
  animační knihovnu.
- 3D chunk se načítá lazy až po přepnutí na „3D model“. Homepage ani 2D lekce
  proto GLB nenačítají.
- Lokální assety jsou v `public/models/*`; rotating-field view reuseuje bez
  kopie `public/models/induction-motor/induction-motor-educational.glb`.
  `ThreeDModelDefinition.assetUrl` tvoří hranici mezi lesson view a GLB loaderem.

## Vrstvy

```text
SeriesParallelDemo
  └─ useAnimatedDemo + useMotionPolicy + AnimatedDemoControls
       ├─ 2D SVG renderer (stávající)
       └─ lazy SeriesParallel3DView
            ├─ ThreeDScene + OrbitControls
            ├─ SeriesParallelModel
            ├─ ThreeDControls
            ├─ ExplodedViewController
            └─ PartInfoPanel

RotatingFieldDemo
  └─ useAnimatedDemo + useMotionPolicy + AnimatedDemoControls
       ├─ 2D SVG renderer (source of truth)
       └─ lazy RotatingField3DView
            ├─ ThreeDScene + OrbitControls
            ├─ stator-only RotatingFieldModel
            └─ PartInfoPanel + U/V/W + field-position controls
```

Modelová konfigurace je v `threeD/*ModelConfig.ts`, oddělená od konkrétní
lekce. Součásti mají stabilní ID, název, textovou funkci a GLB node mapping.
Motorový asset poskytuje společné nodes pro `InductionMotorModel` i
`RotatingFieldModel`; druhý view pouze izoluje stator, fáze U/V/W a
`rotating_field_guide`.

## Přístupnost a fallback

Každá klikací součást má současně tlačítko v klávesnicovém seznamu. Vybraný
díl má textový panel s názvem, funkcí a stavem. Rozložení je diskrétní stav,
nikoli nekontrolovaná animační smyčka, takže funguje v Calm Mode i při
`prefers-reduced-motion`. Chybějící WebGL nebo chyba rendereru zobrazí hlášku
a tlačítko zpět na 2D; dokončení lekce je vždy řízené původním SVG průchodem.
