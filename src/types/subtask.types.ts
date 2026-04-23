export interface Vertical {
  label: string;
  value: string;
}

export interface CreativeStrategist {
  label: string;
  value: string;
}

export interface IdField {
  key: 'bsid' | 'bvid' | 'hsid' | 'hvid';
  label: string;
}

export interface SubtaskFormData {
  vertical: string;
  strategist: string;
  platform: string;
  subtaskCount: number;
}

export interface GeneratedIds {
  bsid: string;
  bvid: string;
  hsid: string;
  hvid: string;
}

export interface SubtaskOutput extends GeneratedIds {
  vertical: string;
  strategist: string;
  platform: string;
}

export interface FormErrors {
  vertical?: string;
  strategist?: string;
  platform?: string;
  subtaskCount?: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface DropdownOption {
  label: string;
  value: string;
}