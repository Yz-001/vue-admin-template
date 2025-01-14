import type { DeptListSearch } from "@/apis/interface/system";
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
