export interface ExportExcelProps {
  filename?: string;
  excelColumns?: ExcelColumn[];
  excelData?: any[];
  remoteConfig?: ExportRemoteConfig;
  buttonLabel?: string;
  exportModel?: ExportModeEnum;
  excelStyle?: ExcelStyle;
}

// 定义Excel样式配置的类型
interface ExcelStyle {
  headerStyle?: object;
  cellStyle?: object;
}

// excel格式化类型枚举
export enum ExcelFormatEnum {
  CUSTOMFORMAT = "CUSTOMFORMAT", //自定义传递函数处理
  OBJECT = "OBJECT",
  SECTION = "SECTION",
  // IMG = "IMG",
  LIST = "LIST",
  DATE = "DATE",
  FILES = "FILES",
  NUMBER = "NUMBER"
}

// excel时间类型枚举
export enum ExportDateFormatEnum {
  YYYY_MM_DD = "YYYY/MM/DD",
  MM_DD_YYYY = "MM/DD/YYYY",
  DD_MM_YYYY = "DD/MM/YYYY",
  YYYY_MM_DD_HH_MM_SS = "YYYY/MM/DD HH:mm:ss",
  MM_DD_YYYY_HH_MM_SS = "MM/DD/YYYY HH:mm:ss",
  DD_MM_YYYY_HH_MM_SS = "DD/MM/YYYY HH:mm:ss"
}

// excel列配置
export interface ExcelColumn {
  label: string;
  prop: string;
  type?: ExcelFormatEnum;
  sunValue?: string;
  width?: number;
  formatFn?: Function;
  dateFormat?: ExportDateFormatEnum;
  selectList?: Array<{ [key: string]: any }>;
  labelValue?: string;
  labelName?: string;
  dateStartProp?: string; // 开始日期字段名
  dateEndProp?: string; // 结束日期字段名
  separator?: string; // 日期之间的分隔符，默认为 "-"
  masked?: boolean; // 脱敏属性
  decimalPlaces?: number; // 小数位精度
}

export interface ExportRemoteConfig {
  remoteApi?: (params: object) => Promise<any>;
  defaultParams?: object;
}

// 导出模式 --公共
export enum ExportModeEnum {
  LISTDATA, //当前列表数据导出
  APILISTDATA, //请求接口-获取全部列表数据导出
  BINARYSTREAM //请求接口-二进制
}
