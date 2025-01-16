import type { CommonOptionString } from "@/apis/interface/common";
// 部门状态
export const DEPT_STATUS: { [key: string]: CommonOptionString } = {
  NORMAL: {
    label: "正常",
    value: "0"
  },
  PAUSE: {
    label: "暂停",
    value: "1"
  }
};

// 角色状态
export const ROLE_STATUS: { [key: string]: CommonOptionString } = {
  NORMAL: {
    label: "正常",
    value: "0"
  },
  PAUSE: {
    label: "暂停",
    value: "1"
  }
};
