// 表格列配置
export interface TableColumn {
  label: string;
  prop: string;
  type?: TableTypeEnum;
  sunValue?: string;
  slotName?: string;
  width?: number;
  maxHeight?: number;
  dateFormat?: DateFormatEnum;
  selectList?: Array<{ [key: string]: any }>;
  labelValue?: string;
  labelName?: string;
  dateStartProp?: string; // 开始日期字段名
  dateEndProp?: string; // 结束日期字段名
  separator?: string; // 日期之间的分隔符，默认为 "-"
}

// 表格类型枚举
export enum TableTypeEnum {
  TEMPLATE = "TEMPLATE",
  OBJECT = "OBJECT",
  SECTION = "SECTION",
  IMG = "IMG",
  LIST = "LIST",
  DATE = "DATE"
}

// 日期枚举
export enum DateFormatEnum {
  YYYY_MM_DD = "YYYY/MM/DD",
  MM_DD_YYYY = "MM/DD/YYYY",
  DD_MM_YYYY = "DD/MM/YYYY",
  YYYY_MM_DD_HH_MM_SS = "YYYY/MM/DD HH:mm:ss",
  MM_DD_YYYY_HH_MM_SS = "MM/DD/YYYY HH:mm:ss",
  DD_MM_YYYY_HH_MM_SS = "DD/MM/YYYY HH:mm:ss"
}

// 分页配置
export interface Pagination {
  currentPage: number;
  pageSize: number;
  // total: number;
  showPagination: boolean;
}

// 远程api配置
export interface RemoteConfig {
  remoteApi?: (params: object) => Promise<any[]>;
  defaultParams?: object;
  autoRequest?: boolean;
}
