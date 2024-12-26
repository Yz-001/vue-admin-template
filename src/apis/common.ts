import request from "./request";

// 公共上传接口
export const COMMON_UPLOAD_FILE = "/v1/file-storage/upload";

/**
 *
 * @param data
 * @returns
 * @description 删除上传到服务器的文件
 */
export const delUploadServerFileApi = async data => {
  return await request.Delete("/serverfile/delete", data);
};

/**
 *
 * @param data
 * @returns
 * @description 删除目录，路径拼接参数
 */
export const DeleteDirectoryApi = async (id: string) => {
  return await request.Delete(`/directory/deleteDirectory/${id}`);
};

/**
 *
 * @param data
 * @returns
 * @description 创建目录
 */
export const PostDirectoryCreateApi = async data => {
  return await request.Post("/directory/createDirectory", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新目录排序
 */
export const PostDirectoryOrderApi = async data => {
  return await request.Post("/directory/updateDirectorySequence", data);
};

/**
 *
 * @param data
 * @returns
 * @description 更新目录名称
 */
export const PutDirectoryUpdateApi = async data => {
  return await request.Put("/directory/updateDirectory", data);
};

// 目录管理
/**
 *
 * @param data
 * @returns
 * @description 查询目录列表
 */
export const PostDirectoryListQueryApi = async data => {
  return await request.Post("/directory/queryDirectoryList", data);
};

/**
 *
 * @param data
 * @returns
 * @description 导出
 */
export const getExportApi = async () => {
  return await request.Request({
    url: `/xxx`,
    method: "get",
    responseType: "blob"
  });
};
