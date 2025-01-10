import { ElMessageBox } from "element-plus";
import { getStorage, setStorage } from "@/utils/storage";
import type { Action } from "element-plus";
import { messageWarning, messageSuccess } from "@/utils/element-utils/notification-common";

/**
 * 替换图片源地址为本地源，解决本地测试环境下的图片跨域问题
 * @param {String} str
 * @returns String
 */
export const replaceOrigin = (str: string): string => {
  return str ? str.replace(/(?:^https|http):\/\/.*?\//g, window.origin + "/") : "";
};

export const chunk = (arr: any, size: any) => {
  const arr2: any = [];
  for (let i = 0; i < arr.length; i = i + size) {
    arr2.push(arr.slice(i, i + size));
  }
  return arr2;
};

// 是否为全屏
export const isFullscreen = (): boolean => {
  const screen = window.screen;
  const body = document.body.getBoundingClientRect();
  return screen.height === body.height && screen.width === body.width;
};

/**
 * 日期格式化
 * @param {*} date
 * @returns
 */
export function formatDate(date: any, format = "YYYY-MM-DD"): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  switch (format) {
    case "YYYY":
      return `${year}`;
    case "YYYY-MM":
      return `${year}-${month}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return `${year}-${month}-${day} ${h}:${m}:${s}`;
  }
}
/**
 * 轮询判断版本是否需要更新
 * @param {*} versionUrl 远程服务器version.js的地址；interval 轮询时间 300000
 * @returns
 */
export async function checkForUpdate(versionUrl: string, interval: number = 10000) {
  if (!getStorage("appVersion")) {
    const initVersion = await getRemoteVersion();
    setStorage("appVersion", initVersion);
  }

  const time = setInterval(async () => {
    const localVersion = getStorage("appVersion") || "";
    const remoteVersion = await getRemoteVersion();
    if (localVersion !== remoteVersion) {
      clearInterval(time);
      ElMessageBox.alert("检测到新版本，即将自动更新...", "更新提示", {
        confirmButtonText: "确定",
        type: "info",
        showCancelButton: false, // 移除取消按钮
        closeOnPressEscape: false, // 禁止按Esc键关闭
        closeOnClickModal: false, // 禁止点击遮罩层关闭
        showClose: false,
        callback: (_action: Action) => {
          setStorage("appVersion", remoteVersion);
          window.location.reload();
        }
      });
    }
  }, interval);

  async function getRemoteVersion() {
    const response = await fetch(versionUrl);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }
    const versionJson = await response.text();
    return versionJson ? JSON.parse(versionJson)?.version || "" : "";
  }
}

/**
 * 深拷贝
 * @param {*} obj 目标对象
 * @returns 深拷贝后的对象
 */
export function deepCopy(obj: { [key: string]: any }, hash = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (hash.has(obj)) return hash.get(obj);
  const copy = Array.isArray(obj) ? [] : {};
  hash.set(obj, copy);
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], hash);
  });

  return copy;
}

/**
 * 获取html的文字内容
 * @param {*} htmlStr html内容
 * @returns html的文字
 */
export const getHtmlInnerText = (htmlStr: string) => {
  let newElement = document.createElement("div");
  newElement.innerHTML = htmlStr;
  document.body.appendChild(newElement);
  const innerText = newElement.innerText;
  document.body.removeChild(newElement);
  return innerText;
};

/**
 * 选取对象的部分字段
 * @param {*} targetObj 目标对象、selectKeys 挑选字段数组
 * @returns 挑选指定字段后的对象
 */
export function getSelectKeyObj(targetObj: { [key: string]: unknown }, selectKeys: string[]) {
  let resData: { [key: string]: unknown } = {};
  for (let key in targetObj) {
    if (selectKeys.includes(key)) {
      resData[key] = targetObj[key];
    }
  }
  return resData;
}

/**
 * 判断是否包含加减乘除运算符
 * @param {*} expression 目标字符串
 * @returns 函数名列表
 */
export function haveContainsOper(str: string) {
  // 替换方括号内的内容
  const withoutBrackets = str.replace(/\[[^\[\]]*\]/g, "");

  // 检查是否包含运算符
  const operatorRegex = /[-+*/]/;

  return operatorRegex.test(withoutBrackets);
}

/**
 * 下载文件
 * @param {*} url, name
 * @returns
 */
export function openFile(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  // .replace(window.origin)
  const suffix = a.href.substring(a.href.lastIndexOf(".") + 1);
  const blankList = ["pdf", "bmp", "png", "jpg", "jpeg"];
  if (blankList.indexOf(suffix.toLocaleLowerCase()) > -1) {
    a.target = "_blank";
  } else {
    a.download = name;
  }
  a.click();
}

/**
 * 导出excel
 * @param {*} data, name
 * @returns
 */
export function exportExcel(data: any, name: string) {
  const url = window.URL.createObjectURL(
    new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" })
  );
  openFile(url, name);
}

// 下载文件
export function downloadFile(fileUrl: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileUrl.split("/").pop() || "";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  const timer = setTimeout(() => {
    document.body.removeChild(link);
    clearTimeout(timer);
  }, 0);
}

/**
 * 删除url上的query某个字段
 * @param {*} keyToDelete 会被删除的字段
 * @returns
 */
export function updateUrlWithoutQueryKey(keyToDelete: string) {
  // 获取并解析 hash 中的查询字符串
  const [path, queryString] = window.location.hash.slice(1).split("?");
  const searchParams = new URLSearchParams(queryString || "");
  // 删除指定的查询参数
  searchParams.delete(keyToDelete);
  // 构建新的 hash 并更新 URL，不触发页面刷新
  const newHash = `${path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  history.replaceState(null, "", `#${newHash}`);
}

/**
 * 判断一个值是否是合法的数值时间戳
 * @param {*} timestamp 时间错
 * @returns Boolean true合法/false不合法
 */
export function isValidNumericTimestamp(timestamp: number) {
  // 定义合理的时间戳范围（例如：从2000年到2100年）
  const minTimestamp = new Date("2000-01-01T00:00:00Z").getTime(); // 946684800000
  const maxTimestamp = new Date("2100-12-31T23:59:59.999Z").getTime();

  // 确保它是数字并且不是一个NaN
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    return false;
  }

  // 检查它是不是整数
  if (!Number.isInteger(timestamp)) {
    return false;
  }

  // 创建一个新的日期对象并检查它是否有效
  const date = new Date(timestamp);

  // 确认转换回时间戳后的值与原始输入相等，并且不是无效日期
  // 同时检查是否在合理范围内
  return (
    !isNaN(date.getTime()) && date.getTime() === timestamp && timestamp >= minTimestamp && timestamp <= maxTimestamp
  );
}
/**
 * @event maskText
 * @description 脱敏
 */
export function maskText(text: string): string {
  if (text.length <= 5) return text;
  return text.slice(0, 2) + "*".repeat(text.length - 5) + text.slice(-3);
}
/**
 * @event copyText
 * @description 复制
 */
export function copyText(value: string, desensitize = false) {
  let text = "";
  if (desensitize) {
    text = maskText(value);
  } else {
    text = typeof value === "number" ? value : value.replace(/[\t\n]/g, " ");
  }
  // 动态创建 textarea 标签
  const textarea = document.createElement("textarea");
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = true;
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  // 将要 copy 的值赋给 textarea 标签的 value 属性
  textarea.value = text;
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea);
  // 选中值并复制
  textarea.select();
  const result = document.execCommand("Copy");
  if (result) {
    if (text === "") {
      messageWarning("没有可复制数据！");
    } else {
      messageSuccess("复制成功！");
    }
  }
  document.body.removeChild(textarea);
}
