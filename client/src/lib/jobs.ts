import { EavestroughDetails, CreateEavestrough, CreateWindow, WindowPresetSubType, WindowDetails } from 'types';

enum JOB_TYPE_LABELS {
  WINDOWS = 'Windows',
  EAVESTROUGHS = 'Eavestrough',
  OTHER = 'OTHER',
}

export enum JOB_STATUSES {
  UNCONFIRMED = 1,
  CONFIRMED = 2,
}

export enum WINDOW_EXTRAS {
  BASEMENT = 'basement',
  SILLS = 'sills',
  RAILINGS = 'railings',
  THIRD_FLOOR = 'thirdFloor',
  TRACKS = 'tracks',
  FRAMES = 'frames',
  DOORS = 'doors',
  SOLOR_PANELS = 'solarPanels',
  SKYLIGHTS = 'skylights',
  CRANKS = 'cranks',
  SECOND_BUILDING = 'secondBuilding',
}
export enum EAVES_EXTRAS {
  FLAT_ROOFS = 'flatRoofs',
  VALLEYS = 'valleys',
  SECOND_BUILDING = 'secondBuilding',
}

export const PRESET_TYPE_WINDOW = 1;
export const PRESET_TYPE_EAVESTROUGH = 2;
export const PRESET_TYPE_OTHER = 3;

export const MAX_DESCRIPTION_SIZE = 60;
export const MAX_NOTES_SIZE = 200;

export const PRESET_JOB_TYPES = {
  WINDOW: { id: PRESET_TYPE_WINDOW, type: JOB_TYPE_LABELS.WINDOWS },
  EAVESTROUGH: {
    id: PRESET_TYPE_EAVESTROUGH,
    type: JOB_TYPE_LABELS.EAVESTROUGHS,
  },
  OTHER: { id: PRESET_TYPE_OTHER, type: JOB_TYPE_LABELS.OTHER },
};

export const JOB_TYPES = [PRESET_JOB_TYPES.WINDOW, PRESET_JOB_TYPES.EAVESTROUGH, PRESET_JOB_TYPES.OTHER];

export const WINDOW_PRESET_SUBTYPES: Array<WindowPresetSubType> = [
  { id: 1, type: 'Interior Only' },
  { id: 2, type: 'Exterior Only' },
  { id: 3, type: 'Interior and Exterior' },
  { id: 4, type: 'Exterior inluding Storms' },
  { id: 5, type: 'Interior and Exterior inluding Storms' },
];

export const getWindowExtras = (quote: CreateWindow | WindowDetails) => {
  const extras = [];
  if (quote.basement) extras.push('B');
  if (quote.garage) extras.push('G');
  if (quote.thirdFloor) extras.push('TF');
  if (quote.solarPanels) extras.push('SP');
  if (quote.skylights) extras.push('SL');
  if (quote.railings) extras.push('R');
  if (quote.doors) extras.push('D');
  if (quote.frames) extras.push('F');
  if (quote.sills) extras.push('S');
  if (quote.cranks) extras.push('C');
  if (quote.tracks) extras.push('T');

  return extras.join(', ');
};

export const getEavesExtras = (quote: CreateEavestrough | EavestroughDetails) => {
  const extras = [];
  if (quote.flatRoofs) extras.push('FR');
  if (quote.valleys) extras.push('V');
  if (quote.secondBuilding) extras.push('SB');

  return extras.join(', ');
};
