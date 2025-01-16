import type { DeptListSearch, DeptRow, RoleListSearch, RoleRow } from "@/apis/interface/system";
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
