import type { Vertical, CreativeStrategist, IdField, DropdownOption } from '../types/subtask.types';

export const VERTICALS: Vertical[] = [
  { label: 'Auto', value: 'AU' },
  { label: 'VSL', value: 'VSL' },
  { label: 'Vellura', value: 'VL' },
  { label: 'Blood Sugar', value: 'BS' },
  { label: 'Weight Loss', value: 'WL' },
  { label: 'TH', value: 'TH' },
  { label: 'Medicare', value: 'MC' }
];

export const CREATIVE_STRATEGISTS: CreativeStrategist[] = [
  { label: 'Kaz', value: 'KZ' },
  { label: 'Yass', value: 'YT' },
  { label: 'Sam', value: 'SM' },
  { label: 'Cam', value: 'CD' }
];

export const PLATFORMS: DropdownOption[] = [
  { label: 'YouTube', value: 'YT' },
  { label: 'Facebook', value: 'FB' },
  { label: 'TikTok', value: 'TIKTOK' },
  { label: 'Twitter', value: 'TT' }
];

export const ID_FIELDS: IdField[] = [
  { key: 'bsid', label: 'Body Script ID' },
  { key: 'bvid', label: 'Body Visual ID' },
  { key: 'hsid', label: 'Hook Script ID' },
  { key: 'hvid', label: 'Hook Visual ID' }
];