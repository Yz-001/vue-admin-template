export interface DeptListSearch {
  deptName: string;
  status: number;
}
export interface DeptRow {
  id?: number;
  deptName?: string;
  status?: number;
  orderNum?: number;
  createDate?: string;
  deptId?: number;
  parentId?: number;
  leader?: string;
  children?: DeptRow[];
}
