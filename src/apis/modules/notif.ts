import type { NotifSearch, NotifRow } from "@/apis/interface/notif";
import request from "../request";

/**
 *
 * @param data
 * @returns
 * @description 获取通知列表
 */
export const getNotifListApi = async (parmas: NotifSearch) => {
  return await request.Get("/notification/list", parmas);
};

/**
 *
 * @param data
 * @returns
 * @description 创建通知
 */
export const postNotifCreateApi = async (data: NotifRow) => {
  return await request.Post("/notification/create", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新通知
 */
export const postNotifUpdateApi = async (data: NotifRow) => {
  return await request.Post("/notification/update", data);
};
