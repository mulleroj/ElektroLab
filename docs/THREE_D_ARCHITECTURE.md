# 3D architektura ElektroLabu

Tento checkpoint přidává první 3D renderer jako volitelný doplněk k lekci
`seriove-paralelni`. 3D není nový výukový stav: `SeriesParallelDemo` zůstává
zdrojem kroků, fault scénářů, autoplayu, pauzy, Calm Mode a gatingu.

## Rozhodnutí technologie

- `three` poskytuje nízkoúrovňový WebGL renderer, geometrii, kameru a lokální
  GLB/GLTF ekosystém.
- `@react-three/fiber` zapouzdřuje scénu v React 19 + TypeScriptu.
- Orbit kamera používá přímo `THREE.OrbitControls`; nepřidáváme další UI nebo
  animační knihovnu.
- 3D chunk se načítá lazy až po přepnutí na „3D model“. Homepage ani lekce bez
  3D ho proto nenačítají.
- Pilotní obvod je procedurální nízkopolygonový model bez externích assetů.
  `ThreeDModelDefinition.assetUrl` a `ThreeDModel` už tvoří hranici pro budoucí
  lokální GLB/GLTF modely.

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
```

Modelová konfigurace je v `threeD/seriesParallelModelConfig.ts`, oddělená od
konkrétní lekce. Součásti mají stabilní ID, název, textovou funkci, složenou a
rozloženou polohu a případně lokální segmentovou geometrii. Stejný kontrakt je
připravený pro transformátor (jádro, primární/sekundární vinutí, svorky), motor
(stator, rotor, hřídel) i stykač (cívka, kotva, kontakty).

## Přístupnost a fallback

Každá klikací součást má současně tlačítko v klávesnicovém seznamu. Vybraný
díl má textový panel s názvem, funkcí a stavem. Rozložení je diskrétní stav,
nikoli nekontrolovaná animační smyčka, takže funguje v Calm Mode i při
`prefers-reduced-motion`. Chybějící WebGL nebo chyba rendereru zobrazí hlášku
a tlačítko zpět na 2D; dokončení lekce je vždy řízené původním SVG průchodem.
