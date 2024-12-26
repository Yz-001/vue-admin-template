import request from "./request";

/**
 *
 * @param data
 * @returns
 * @description 登陆
 */
export const postUserLoginApi = async (data: { password: string; username: string; schZoneCode: string }) => {
  return await request.Post("/user/login", data);
};

/**
 *
 * @param data
 * @returns
 * @description 获取用户信息
 */
export const getUserInfoApi = async parmas => {
  return await request.Get("/user/get_user_info", parmas);
};

/**
 *
 * @param
 * @returns
 * @description 获取字典所有列表
 */
export const getDictListApi = async () => {
  return await request.Get("/property/list");
};
