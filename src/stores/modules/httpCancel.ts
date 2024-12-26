import { defineStore } from "pinia";
import type { AxiosRequestConfig } from "axios";
import { deepCopy } from "@/utils/common";

export const useHttpCancel = defineStore("httpCancel", {
  state: () => {
    return {
      httpPromiseCancels: new Map() // 接口请求集合  {window.location.hash-url+&+method+params+config.data  : cancel}
    };
  },
  actions: {
    // 获取标识  map的key
    getPromiseTag(config: AxiosRequestConfig) {
      return `${window.location.hash}-${config.url}&${config.method}&${JSON.stringify(config.params)}&${JSON.stringify(config.data)}`;
    },
    // 记录新请求
    pushHttpPromiseCancel(config: AxiosRequestConfig, cancel: any) {
      if (!config || !cancel) {
        return;
      }
      this.httpPromiseCancels.set(this.getPromiseTag(config), cancel);
    },

    // 请求前清除重复请求
    requestClearRepeatQueue(config: AxiosRequestConfig) {
      if (!config) {
        return;
      }
      const curTag = this.getPromiseTag(config);
      if (this.httpPromiseCancels.has(curTag)) {
        const cancel = this.httpPromiseCancels.get(curTag);
        cancel();
        this.httpPromiseCancels.delete(curTag);
      }
    },

    // 响应时移出已请求完毕请求
    responseClearQueue(config: AxiosRequestConfig) {
      if (!config) {
        return;
      }

      const curTag = this.getPromiseTag(config);
      if (this.httpPromiseCancels.has(curTag)) {
        this.httpPromiseCancels.delete(curTag);
      }
    },

    // 清除所有请求 用途: 用户跳转
    clearAllHttpPromiseCancel() {
      const backHttpPromiseCancels = deepCopy(this.httpPromiseCancels);
      if (backHttpPromiseCancels.size) {
        backHttpPromiseCancels.forEach((cancel, key) => {
          cancel();
          this.httpPromiseCancels.delete(key);
        });
        backHttpPromiseCancels.clear();
      }
    }
  }
});
