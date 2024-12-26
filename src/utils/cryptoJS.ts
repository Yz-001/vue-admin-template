import * as CryptoJS from "crypto-js";
import type { LocationQueryRaw } from "vue-router";

export const SECRET_KEY = "2*%1pn*!6w!e22bw"; //加密密钥
export function encrypt(value: string | number | null | undefined) {
  //加密
  return CryptoJS.AES.encrypt(String(value) || "", CryptoJS.enc.Utf8.parse(SECRET_KEY), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })?.ciphertext?.toString();
}

// router query encrypt
export const QUERY_KEY = "3%*6on#!8w#a65fa"; //query加密密钥
export function encryptQuery(value: LocationQueryRaw) {
  return CryptoJS.AES.encrypt(JSON.stringify(value || {}), QUERY_KEY).toString();
}
export function decodeQuery(value: string) {
  const bytes = CryptoJS.AES.decrypt(value, QUERY_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8) || "{}");
}
