// S 部门管理
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
// E 部门管理

// S 角色管理
export interface RoleListSearch {
  roleName: string; //角色名称
  roleKey: string; //权限字符
  status: number; //角色状态
  createDate: number[]; //创建时间
}
export interface RoleRow {
  id?: number;
  roleName?: string; //角色名称
  roleKey?: string; //权限字符
  dataScope?: string; // 数据权限
  status?: number; // 角色状态
  roleSort?: number; // 显示顺序
  createDate?: string; // 创建时间
  menuIds?: string[]; // 菜单权限
  remark?: string; // 备注
}
// E 角色管理

// S 菜单管理
export interface MenuListSearch {
  menuName?: string; //菜单名称
  visible?: number; // 菜单状态
}
export interface MenuRow {
  id?: number;
  menuName?: string; //菜单名称
  orderNum?: string; //排序
  url?: string; // 请求地址
  menuType?: number; // 类型
  visible?: number; // 菜单状态
  perms?: string; // 权限标识
  icon?: string[]; // 图标
  isRefresh?: number; //是否刷新
}
// E 菜单管理
