import type { DeptListSearch, DeptRow } from "@/apis/interface/system";
import request from "../request";

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
  return await request.Get("/system/dept/list", id);
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
