import type { ThreeDModelDefinition, ThreeDPartDefinition, ThreeDVector } from './types';

export const CONTACTOR_MODEL_PATH = '/models/contactor/contactor-educational.glb';

export type ContactorPartId =
  | 'housing'
  | 'coil'
  | 'magnetic_core_fixed'
  | 'armature_moving'
  | 'return_spring'
  | 'main_contact_L1_T1'
  | 'main_contact_L2_T2'
  | 'main_contact_L3_T3'
  | 'aux_contact_NO'
  | 'aux_contact_NC'
  | 'coil_terminal_A1'
  | 'coil_terminal_A2'
  | 'power_terminals_L1_T1'
  | 'power_terminals_L2_T2'
  | 'power_terminals_L3_T3';

export interface ContactorPartGroup {
  id: string;
  label: string;
  parts: ThreeDPartDefinition[];
}

const ZERO: ThreeDVector = [0, 0, 0];

const EXPLODED_OFFSETS: Record<ContactorPartId, ThreeDVector> = {
  housing: [0, 1.4, 0],
  coil: [-2.1, 0, -0.25],
  magnetic_core_fixed: [0, 0.9, -0.2],
  armature_moving: [0, 1.25, 1],
  return_spring: [1.2, 1.15, 1],
  main_contact_L1_T1: [0, -0.4, 0.9],
  main_contact_L2_T2: [0, -0.4, 0.9],
  main_contact_L3_T3: [0, -0.4, 0.9],
  aux_contact_NO: [2.2, -0.35, 0.4],
  aux_contact_NC: [2.2, -0.35, 0.4],
  coil_terminal_A1: [0, -0.65, -0.8],
  coil_terminal_A2: [0, -0.65, -0.8],
  power_terminals_L1_T1: [0, -0.65, 1.1],
  power_terminals_L2_T2: [0, -0.65, 1.1],
  power_terminals_L3_T3: [0, -0.65, 1.1],
};

function assetPart(
  id: ContactorPartId,
  label: string,
  description: string,
  nodeNames: string[],
): ThreeDPartDefinition {
  return {
    id,
    label,
    description,
    kind: 'asset',
    position: ZERO,
    explodedPosition: EXPLODED_OFFSETS[id],
    explodedOffset: EXPLODED_OFFSETS[id],
    nodeNames,
  };
}

export const contactorParts: ThreeDPartDefinition[] = [
  assetPart('housing', 'Kostra stykače', 'Izoluje a mechanicky nese vnitřní části stykače.', ['housing']),
  assetPart('coil', 'Cívka', 'Ovládací cívka vytváří magnetické pole, které přitahuje kotvu.', [
    'coil',
    'coil_former',
    'coil_inner_clearance',
  ]),
  assetPart('magnetic_core_fixed', 'Magnetické jádro', 'Pevná část magnetického obvodu cívky.', ['magnetic_core_fixed']),
  assetPart('armature_moving', 'Pohyblivá kotva', 'Mechanicky přenáší pohyb cívky na kontakty.', ['armature_moving']),
  assetPart('return_spring', 'Vratná pružina', 'Po vypnutí cívky vrací kotvu do klidové polohy.', ['return_spring']),
  assetPart('main_contact_L1_T1', 'Hlavní kontakt L1–T1', 'Výkonový kontakt jedné fáze; při sepnutí propojí vstup L1 s výstupem T1.', [
    'main_contact_L1',
    'main_contact_T1',
    'main_contact_bridge_1',
  ]),
  assetPart('main_contact_L2_T2', 'Hlavní kontakt L2–T2', 'Výkonový kontakt druhé fáze; při sepnutí propojí vstup L2 s výstupem T2.', [
    'main_contact_L2',
    'main_contact_T2',
    'main_contact_bridge_2',
  ]),
  assetPart('main_contact_L3_T3', 'Hlavní kontakt L3–T3', 'Výkonový kontakt třetí fáze; při sepnutí propojí vstup L3 s výstupem T3.', [
    'main_contact_L3',
    'main_contact_T3',
    'main_contact_bridge_3',
  ]),
  assetPart('aux_contact_NO', 'Pomocný kontakt NO', 'Normálně otevřený kontakt; sepne při aktivní cívce.', ['aux_contact_NO', 'aux_NO_fixed']),
  assetPart('aux_contact_NC', 'Pomocný kontakt NC', 'Normálně zavřený kontakt; při aktivní cívce se rozepne.', ['aux_contact_NC', 'aux_NC_fixed']),
  assetPart('coil_terminal_A1', 'Cívková svorka A1', 'Jedna ze svorek ovládací cívky. Model není určen pro skutečné připojení.', [
    'coil_terminal_A1',
    'coil_terminal_A1_mount',
    'coil_terminal_A1_cap',
    'label_A1',
  ]),
  assetPart('coil_terminal_A2', 'Cívková svorka A2', 'Druhá ze svorek ovládací cívky. Model není určen pro skutečné připojení.', [
    'coil_terminal_A2',
    'coil_terminal_A2_mount',
    'coil_terminal_A2_cap',
    'label_A2',
  ]),
  assetPart('power_terminals_L1_T1', 'Výkonové svorky L1 / T1', 'Vstupní a výstupní svorka první výkonové fáze.', [
    'power_terminal_L1',
    'power_terminal_L1_mount',
    'power_terminal_L1_cap',
    'power_terminal_T1',
    'power_terminal_T1_mount',
    'power_terminal_T1_cap',
    'label_L1',
    'label_T1',
  ]),
  assetPart('power_terminals_L2_T2', 'Výkonové svorky L2 / T2', 'Vstupní a výstupní svorka druhé výkonové fáze.', [
    'power_terminal_L2',
    'power_terminal_L2_mount',
    'power_terminal_L2_cap',
    'power_terminal_T2',
    'power_terminal_T2_mount',
    'power_terminal_T2_cap',
    'label_L2',
    'label_T2',
  ]),
  assetPart('power_terminals_L3_T3', 'Výkonové svorky L3 / T3', 'Vstupní a výstupní svorka třetí výkonové fáze.', [
    'power_terminal_L3',
    'power_terminal_L3_mount',
    'power_terminal_L3_cap',
    'power_terminal_T3',
    'power_terminal_T3_mount',
    'power_terminal_T3_cap',
    'label_L3',
    'label_T3',
  ]),
];

export const contactorPartGroups: ContactorPartGroup[] = [
  { id: 'mechanism', label: 'Magnetický mechanismus', parts: contactorParts.slice(0, 5) },
  { id: 'main-contacts', label: 'Hlavní kontakty', parts: contactorParts.slice(5, 8) },
  { id: 'auxiliary-contacts', label: 'Pomocné kontakty', parts: contactorParts.slice(8, 10) },
  { id: 'terminals', label: 'Svorky', parts: contactorParts.slice(10) },
];

export const contactorModel: ThreeDModelDefinition = {
  id: 'contactor-educational',
  title: 'Výukový stykač',
  description: 'Technická školní 3D pomůcka s cívkou, magnetickým mechanismem, kontakty a svorkami.',
  assetUrl: CONTACTOR_MODEL_PATH,
  parts: contactorParts,
};

export const CONTACTOR_CAMERA_POSITION: [number, number, number] = [7, -8, 6];
export const CONTACTOR_CAMERA_TARGET: [number, number, number] = [0, 0, 0];

export function getContactor3DModel(): ThreeDModelDefinition {
  return contactorModel;
}
