export interface Wapper<T> {
  requestAccess?: boolean;
  code?: string | number;
  msg?: string;
  success?: boolean;
  timeStamp?: number;
  data: T;
}
export interface commonParams {
  appInfo: string | -1;
  source: string | -1;
  nonce: string | -1;
  token: string | -1;
  userId: number;
  sign: string;
}
export interface User {
  username: string;
  age: number;
}

export interface HttpOptions {
  contentType: string;
  noErrMsgCodes: number[]; // 不提示错误的code集合 前端额外做其他提示
}
