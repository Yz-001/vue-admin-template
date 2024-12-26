import type { App } from "vue";

/**
 * 没有值返回空
 * @param {String} value 被检测值
 * @param {String} nullValue 为空返回值
 * @returns string
 */
export function isNull(value: string, nullValue = "-"): string {
  return value || nullValue;
}

export const commonEvent = (app: App) => {
  app.config.globalProperties.$isNull = isNull;
};
