import type {
  DeptListSearch,
  DeptRow,
  MenuListSearch,
  MenuRow,
  PostListSearch,
  PostRow,
  RoleListSearch,
  RoleRow,
  UserListSearch,
  UserRow
} from "@/apis/interface/system";
import request from "../request";

// S 部门管理
/**
 *
 * @param data
 * @returns
 * @description 获取部门列表
 */
export const getDeptListApi = async (parmas: DeptListSearch) => {
  return await request.Get("/system/dept/list", parmas);
};

/**
 *
 * @param data
 * @returns
 * @description 获取部门详情
 */
export const getDeptDetailApi = async ({ id }: { id: string }) => {
  return await request.Get("/system/dept/info", id);
};
/**
 *
 * @param data
 * @returns
 * @description 创建部门
 */
export const postDeptCreateApi = async (data: DeptRow) => {
  return await request.Post("/system/dept/create", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新部门
 */
export const postDeptUpdateApi = async (data: DeptRow) => {
  return await request.Post("/system/dept/update", data);
};

/**
 *
 * @param data
 * @returns
 * @description 删除部门
 */
export const deleteDeptApi = async (data: DeptRow) => {
  return await request.Delete("/system/dept/del", data);
};
// E 部门管理

// S 角色管理
/**
 *
 * @param data
 * @returns
 * @description 获取角色列表
 */
export const getSystemRoleListApi = async (parmas: RoleListSearch) => {
  return await request.Get("/system/role/list", parmas);
};

/**
 *
 * @param data
 * @returns
 * @description 获取角色详情
 */
export const getSystemRoleDetailApi = async ({ id }: { id: string }) => {
  return await request.Get("/system/role/info", id);
};
/**
 *
 * @param data
 * @returns
 * @description 创建角色
 */
export const postSystemRoleCreateApi = async (data: RoleRow) => {
  return await request.Post("/system/role/create", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新角色
 */
export const postSystemRoleUpdateApi = async (data: RoleRow) => {
  return await request.Post("/system/role/update", data);
};

/**
 *
 * @param data
 * @returns
 * @description 删除角色
 */
export const deleteSystemRoleApi = async (data: RoleRow) => {
  return await request.Delete("/system/role/del", data);
};
// E 角色管理

// S 菜单管理
/**
 *
 * @param data
 * @returns
 * @description 获取菜单列表
 */
export const getMenuListApi = async (parmas: MenuListSearch) => {
  return await request.Get("/system/menu/list", parmas);
};

/**
 *
 * @param data
 * @returns
 * @description 获取菜单详情
 */
export const getMenuDetailApi = async ({ id }: { id: string }) => {
  return await request.Get("/system/menu/info", id);
};
/**
 *
 * @param data
 * @returns
 * @description 创建菜单
 */
export const postMenuCreateApi = async (data: MenuRow) => {
  return await request.Post("/system/menu/create", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新菜单
 */
export const postMenuUpdateApi = async (data: MenuRow) => {
  return await request.Post("/system/menu/update", data);
};

/**
 *
 * @param data
 * @returns
 * @description 删除菜单
 */
export const deleteMenuApi = async (data: MenuRow) => {
  return await request.Delete("/system/menu/del", data);
};
// E 菜单管理

// S 岗位管理
/**
 *
 * @param data
 * @returns
 * @description 获取岗位列表
 */
export const getSystemPostListApi = async (parmas: PostListSearch) => {
  return await request.Get("/system/post/list", parmas);
};

/**
 *
 * @param data
 * @returns
 * @description 获取岗位详情
 */
export const getSystemPostDetailApi = async ({ id }: { id: string }) => {
  return await request.Get("/system/post/info", id);
};
/**
 *
 * @param data
 * @returns
 * @description 创建岗位
 */
export const postSystemPostCreateApi = async (data: PostRow) => {
  return await request.Post("/system/post/create", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新岗位
 */
export const postSystemPostUpdateApi = async (data: PostRow) => {
  return await request.Post("/system/post/update", data);
};

/**
 *
 * @param data
 * @returns
 * @description 删除岗位
 */
export const deleteSystemPostApi = async (data: PostRow) => {
  return await request.Delete("/system/post/del", data);
};
// E 岗位管理

// S 用户管理
/**
 *
 * @param data
 * @returns
 * @description 获取用户列表
 */
export const getSystemUserListApi = async (parmas: UserListSearch) => {
  return await request.Get("/system/user/list", parmas);
};

/**
 *
 * @param data
 * @returns
 * @description 获取用户详情
 */
export const getSystemUserDetailApi = async ({ id }: { id: string }) => {
  return await request.Get("/system/user/info", id);
};
/**
 *
 * @param data
 * @returns
 * @description 创建用户
 */
export const postSystemUserCreateApi = async (data: UserRow) => {
  return await request.Post("/system/user/create", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新用户
 */
export const postSystemUserUpdateApi = async (data: UserRow) => {
  return await request.Post("/system/user/update", data);
};

/**
 *
 * @param data
 * @returns
 * @description 删除用户
 */
export const deleteSystemUserApi = async (data: UserRow) => {
  return await request.Delete("/system/user/del", data);
};
// E 用户管理
