import type { ContactorPartId } from './contactorModelConfig';

export type ContactorCoilState = 'off' | 'on';

export const CONTACTOR_MOTION = {
  armatureZ: { off: 1.58, on: 1.22 },
  bridgeZ: { off: 1.46, on: 0.97 },
  springScaleZ: { off: 1, on: 0.72 },
  springZ: { off: 0, on: -0.2 },
  noZ: { off: 0.62, on: 0.35 },
  ncZ: { off: -0.48, on: -0.72 },
} as const;

export function getContactorCoilLabel(coilActive: boolean): string {
  return coilActive ? 'pod napětím' : 'bez napětí';
}

export function getContactorPartState(partId: ContactorPartId, coilActive: boolean): string {
  const coil = getContactorCoilLabel(coilActive);
  if (partId === 'coil') return `Cívka je ${coil}.`;
  if (partId === 'armature_moving') return coilActive ? 'Kotva je přitažená k jádru.' : 'Kotva je v klidové poloze.';
  if (partId === 'return_spring') return coilActive ? 'Pružina je stlačená.' : 'Pružina drží kotvu v klidové poloze.';
  if (partId.startsWith('main_contact_')) return coilActive ? 'Hlavní kontakt je sepnutý.' : 'Hlavní kontakt je rozepnutý.';
  if (partId === 'aux_contact_NO') return coilActive ? 'NO kontakt je sepnutý.' : 'NO kontakt je rozepnutý.';
  if (partId === 'aux_contact_NC') return coilActive ? 'NC kontakt je rozepnutý.' : 'NC kontakt je sepnutý.';
  if (partId.startsWith('power_terminals_')) return 'Svorky patří do výkonového obvodu; nejedná se o návod k připojení.';
  if (partId.startsWith('coil_terminal_')) return 'Svorka patří do ovládacího obvodu; nejedná se o návod k připojení.';
  if (partId === 'magnetic_core_fixed') return 'Jádro vede magnetický tok cívky.';
  if (partId === 'housing') return 'Kostra chrání a drží mechanismus stykače.';
  return 'Část je součástí mechanického mechanismu stykače.';
}
