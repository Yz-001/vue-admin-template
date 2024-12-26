import Cookies from "js-cookie";
export const TOKEN_KEY = "v-token";
// export const EXPIRES = new Date().getTime() + 604800000; // 7天
const defaultStorageMode: string = "sessionStorage"; // 常规存哪个缓存上

export const setToken = (token: string, expires: number = null) => {
  setStorage(TOKEN_KEY, token, "Cookies", expires);
};

export const getToken = () => {
  return getStorage(TOKEN_KEY, "Cookies");
};

export const removeToken = () => {
  removeStorage(TOKEN_KEY, "Cookies");
};

export const setStorage = (key, val, mode = defaultStorageMode, cookieExpires = null) => {
  switch (mode) {
    case "localStorage":
      return localStorage.setItem(key, val);
    case "sessionStorage":
      return sessionStorage.setItem(key, val);
    case "Cookies":
      return Cookies.set(key, val, cookieExpires != null ? { expires: cookieExpires } : {});
  }
};

export const getStorage = (key, mode = defaultStorageMode) => {
  switch (mode) {
    case "localStorage":
      return localStorage.getItem(key);
    case "sessionStorage":
      return sessionStorage.getItem(key);
    case "Cookies":
      return Cookies.get(key);
  }
};

export const removeStorage = (key, mode = defaultStorageMode) => {
  switch (mode) {
    case "localStorage":
      localStorage.removeItem(key);
      break;
    case "sessionStorage":
      sessionStorage.removeItem(key);
      break;
    case "Cookies":
      Cookies.remove(key);
      break;
  }
};

export const clearStorage = (mode = defaultStorageMode) => {
  switch (mode) {
    case "localStorage":
      localStorage.clear();
      break;
    case "sessionStorage":
      sessionStorage.clear();
      break;
    case "Cookies":
      // 获取所有的 cookies 键名
      const cookiesKeys = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0]);

      // 遍历所有键名并移除相应的 cookie
      cookiesKeys.forEach(cookieKey => {
        Cookies.remove(cookieKey);
      });
      break;
  }
};
