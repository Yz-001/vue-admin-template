// 公共interface
export enum layoutModeEnum {
  VERTICAL,
  HORIZONTAL,
  MIXIN
}

export enum layoutDeviceEnum {
  DESKTOP,
  MOBILE
}

export interface CommonOption {
  label: string;
  value: number;
}

export interface CommonOptionString {
  label: string;
  value: string;
}

export interface BaseFromDlgProp {
  visible: boolean;
  row: any;
}
