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

// S 岗位管理
export interface PostListSearch {
  postCode?: string; //岗位编码
  postName?: string; //岗位名称
  status?: number; // 状态
}
export interface PostRow {
  id?: number;
  postCode?: string; //岗位编码
  postName?: string; //岗位名称
  postSort?: number; // 显示顺序
  status?: number; // 状态
  createTime?: string; // 创建时间
  remark?: string; // 备注
}
// E 岗位管理

// S 用户管理
export interface UserListSearch {
  userName?: string; //登录名称
  phonenumber?: string; // 手机号码
  status?: number; // 用户状态
  createTime?: number; // 创建时间
}
export interface UserRow {
  id?: number; // 用户ID
  userName?: string; //用户名称
  phonenumber?: string; // 手机号码
  status?: number; // 用户状态
  createTime?: number; // 创建时间
  deptId?: string; // 部门
  remark?: string; // 备注
}
// E 用户管理
