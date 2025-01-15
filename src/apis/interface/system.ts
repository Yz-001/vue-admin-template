export interface DeptListSearch {
  deptName: string;
  status: number;
}
export interface DeptRow {
  deptName: string;
  status: number;
  orderNum: number;
  createDate: string;
  deptId: number;
  parentId: number;
  children: DeptRow[];
}
