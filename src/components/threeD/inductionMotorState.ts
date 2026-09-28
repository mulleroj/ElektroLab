import type { InductionMotorPartId } from './inductionMotorModelConfig';

export type InductionMotorViewMode = 'complete' | 'cutaway';
export type InductionMotorIsolation = 'all' | 'stator' | 'rotor';
export type InductionMotorRunState = 'stopped' | 'running';

export const INDUCTION_MOTOR_MOTION = {
  fieldRadiansPerSecond: 0.92,
  rotorRadiansPerSecond: 0.62,
} as const;

export function getInductionMotorPartState(
  partId: InductionMotorPartId,
  stepIndex: number,
  viewMode: InductionMotorViewMode,
  isolation: InductionMotorIsolation,
): string {
  const stepState = `2D krok ${stepIndex + 1} z 6 zůstává zdrojem pravdy. `;
  const viewState =
    viewMode === 'cutaway'
      ? 'Je zapnutý výukový řez. '
      : isolation === 'stator'
        ? 'Je zobrazena izolovaná skupina statoru. '
        : isolation === 'rotor'
          ? 'Je zobrazena izolovaná skupina rotoru. '
          : '';

  const partState: Record<InductionMotorPartId, string> = {
    housing: 'Skříň je pevná část motoru a chrání vnitřní konstrukci.',
    stator_core: 'Stator stojí; jeho železo obklopuje prostor, ve kterém vzniká točivé pole.',
    winding_u: 'Fáze U je pevná část statorového vinutí.',
    winding_v: 'Fáze V je pevná část statorového vinutí.',
    winding_w: 'Fáze W je pevná část statorového vinutí.',
    rotor_core: 'Rotorové železo se otáčí uvnitř statoru.',
    cage_bars:
      stepIndex >= 3
        ? 'V klecových tyčích se při relativním pohybu pole a rotoru indukují proudy.'
        : 'Klecové tyče jsou vodivé části rotoru.',
    end_ring_front: 'Přední zkratovací kruh uzavírá vodivé cesty rotorové klece.',
    end_ring_rear: 'Zadní zkratovací kruh uzavírá vodivé cesty rotorové klece.',
    shaft: 'Hřídel přenáší mechanický výkon; otáčí se spolu s rotorovou sestavou.',
    bearing_front: 'Přední ložisko zůstává statické a umožňuje hřídeli otáčet se.',
    bearing_rear: 'Zadní ložisko zůstává statické a umožňuje hřídeli otáčet se.',
    end_shield_front: 'Přední čelní štít nese ložisko a uzavírá motor.',
    end_shield_rear: 'Zadní čelní štít nese ložisko a uzavírá motor.',
    fan: 'Ventilátor je mechanicky spojený s hřídelí a v názorném chodu sleduje rotor.',
    fan_cover: 'Kryt ventilátoru je ochranná mechanická část.',
    terminal_box: 'Svorkovnicová skříň chrání svorkovnici; v této lekci se nepřepojuje.',
    terminal_block: 'Svorkovnice slouží k identifikaci svorek U1, V1, W1, U2, V2, W2.',
    air_gap:
      'Názorná vrstva ukazuje vzduchovou mezeru mezi statorem a rotorem; není to další fyzický materiál.',
    rotating_field:
      'Názorný helper ukazuje směr rotujícího magnetického pole; nejde o fyzikální simulaci.',
  };

  return `${stepState}${viewState}${partState[partId]}`;
}
