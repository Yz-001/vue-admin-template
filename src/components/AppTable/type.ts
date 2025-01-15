import type { ExportExcelProps } from "@/components/AppExportExcel/type";

export interface TableProps {
  elemColumns: TableColumn[];
  data?: any[];
  tableTotal?: number;
  tableConfig?: TableConfig;
  remoteConfig?: RemoteConfig;
  filterParams?: { [key: string]: any }; // 检索参数
  defaultPageSize?: number;
  defaultPageNumber?: number;
  showPagination?: boolean;
  showExportExcel?: boolean;
  exportExcelConfig?: ExportExcelProps;
}

// 表格列类型枚举
export enum TableColTypeEnum {
  DEFAULT = "default",
  SELECTION = "selection",
  INDEX = "index",
  EXPAND = "expand"
}

// 表格值类型枚举
export enum TableTypeEnum {
  TEMPLATE = "TEMPLATE",
  OBJECT = "OBJECT",
  SECTION = "SECTION",
  IMG = "IMG",
  LIST = "LIST",
  DATE = "DATE",
  FILES = "FILES", // 文件类型
  NUMBER = "NUMBER" // 数字类型
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

// 表格本身配置
export interface TableConfig {
  selection?: boolean; // 是否有选择框
  loading?: boolean; // 加载状态
  stripe?: boolean; // 是否为斑马纹表格
  border?: boolean; // 是否带有纵向边框
  showSummary?: boolean; // 是否显示合计行
  summaryMethod?: Function; // 合计行计算方法
  rowClassName?: (row: any, index: number) => string; // 行类名
  headerCellClassName?: (column: any) => string; // 表头单元格类名
  selectionChange?: (row: any) => any; // 选中
}

// 表格列配置
export interface TableColumn {
  label: string;
  prop: string;
  colType?: TableColTypeEnum; // 列类型 选中 序号
  selectableFn?: (index: number) => number; // 是否禁用
  indexFn?: (index: number) => number; // 自定义索引
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
  tagType?: TagTypeEnum; // 标签颜色类型
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

// 标签类型枚举
export enum TagTypeEnum {
  Success = "success",
  Warning = "warning",
  Info = "info",
  Primary = "primary",
  Danger = "danger"
}
