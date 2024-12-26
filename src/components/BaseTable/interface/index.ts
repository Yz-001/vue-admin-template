// 表头对象
export interface TableHead {
  prop: string; // 对应tableData的相应key值
  label: string; // 表头名称
  align?: "left" | "right" | "center"; //对齐方式
  width?: number | string; //宽度
  minWidth?: number | string; //最小宽度
  hUnit?: string; // 头部增加单位
  cUnit?: string; //数据增加单位
  isFixed?: "left" | "right"; // 是否滚动时固定（默认：left，选填：left | right | 不传）
  columnClass?: string; //当前列的自定义样式
  isTool?: boolean; // 是否为工具操作栏，与toolConfig配套使用(选填：true | 不传)
  toolConfig?: TableToolItem[]; // 工具栏配置
  diySlot?: string; //传入自定义列样式的slot name
  [key: string]: any;
}
export interface IArr {
  [index: number]: string;
}
// 工具栏配置
export interface TableToolItem {
  icon: string;
  permission?: string | IArr[]; //权限
  tipTxt: (row: TableData) => string; //说明文案回调
  clickFunc: (row: TableData) => void; //点击事件回调
}
// 表格数据
export interface TableData {
  [key: string]: any;
}
export interface TableCbRowConfig {
  row: TableData;
  rowIndex: number;
}
export interface TableCbColumnConfig {
  column: TableData;
  columnIndex: number;
}
export interface TableCbConfig extends TableCbRowConfig, TableCbColumnConfig {}
export interface TableSort {
  prop: string;
  order: "ascending" | "descending" | null;
}
export interface TableSortCbConfig extends TableSort {
  column: TableHead;
}
