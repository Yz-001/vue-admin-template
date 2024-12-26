import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
/**消息类型枚举 */
export type MessageTypes = "info" | "success" | "warning" | "error";
/**通知弹窗样式 */
export type Feedback = "Alert" | "Message" | "MessageBox" | "Notification";

/**消息通知-通用
 * @default ty:"info";feed:"Notification";
 */
export function message(msg: string = "", ty: MessageTypes = "info", feed: Feedback = "Message"): void {
  switch (feed) {
    case "Notification":
      ElNotification({ message: msg, type: ty, title: ty });
      break;
  }
}
/**错误消息 */
export function messageError(msg: string = "", feed: Feedback = "Message"): void {
  switch (feed) {
    case "Notification":
      ElNotification({ message: msg, type: "error", title: "error" });
      break;
    case "Message":
      ElMessage({ message: msg, type: "error" });
      break;
    case "MessageBox":
      ElMessageBox({ message: msg, type: "error", title: "error" });
      break;
  }
}
/**成功消息 */
export function messageSuccess(msg: string = "", feed: Feedback = "Message"): void {
  switch (feed) {
    case "Notification":
      ElNotification({ message: msg, type: "success", title: "success" });
      break;
    case "Message":
      ElMessage({ message: msg, type: "success" });
      break;
    case "MessageBox":
      ElMessageBox({ message: msg, type: "success", title: "success" });
      break;
  }
}
/**告警消息 */
export function messageWarning(msg: string = "", feed: Feedback = "Message"): void {
  switch (feed) {
    case "Notification":
      ElNotification({ message: msg, type: "warning", title: "warning" });
      break;
    case "Message":
      ElMessage({ message: msg, type: "warning" });
      break;
    case "MessageBox":
      ElMessageBox({ message: msg, type: "warning", title: "warning" });
      break;
  }
}

interface DelParam {
  removetxt?: string;
  tip?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}
/**
 * 公共删除弹框
 * @param param
 * @returns (resolve return 'confirm') or (reject return 'cancel' or error)
 */
export function commonDelBox({
  removetxt = "删除后无法恢复，确定要删除此项！",
  tip = "提醒",
  confirmButtonText = "确认",
  cancelButtonText = "取消"
}: DelParam) {
  return new Promise<string>((resolve, reject) => {
    ElMessageBox.confirm(removetxt, tip, {
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    })
      .then(async res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
