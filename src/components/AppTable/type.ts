// 表格类型枚举
export enum TableTypeEnum {
  TEMPLATE = "TEMPLATE",
  OBJECT = "OBJECT",
  SECTION = "SECTION",
  IMG = "IMG",
  LIST = "LIST",
  DATE = "DATE",
  FILES = "FILES", // 新增文件类型
  NUMBER = "NUMBER" // 新增数字类型
}

// 表格类型枚举
export enum DateFormatEnum {
  YYYY_MM_DD = "YYYY/MM/DD",
  MM_DD_YYYY = "MM/DD/YYYY",
  DD_MM_YYYY = "DD/MM/YYYY",
  YYYY_MM_DD_HH_MM_SS = "YYYY/MM/DD HH:mm:ss",
  MM_DD_YYYY_HH_MM_SS = "MM/DD/YYYY HH:mm:ss",
  DD_MM_YYYY_HH_MM_SS = "DD/MM/YYYY HH:mm:ss"
}

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
  masked?: boolean; // 脱敏属性
  decimalPlaces?: number; // 小数位精度
  tagType?: string; // 标签颜色类型
  tagSuccess?: { value: any; color?: string }; // 成功标签条件及颜色
  tagError?: { value: any; color?: string }; // 错误标签条件及颜色
}

// 分页配置
export interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
  showPagination: boolean;
}

// 远程api配置
export interface RemoteConfig {
  remoteApi?: (params: object) => Promise<any>;
  defaultParams?: object;
  autoRequest?: boolean;
}
