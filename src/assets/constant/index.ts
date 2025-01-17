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

// 菜单状态
export const MENU_STATUS: { [key: string]: CommonOptionString } = {
  VISIBLE: {
    label: "显示",
    value: "0"
  },
  HIDDEN: {
    label: "隐藏",
    value: "1"
  }
};

// 菜单类型
export const MENU_TYPE: { [key: string]: CommonOptionString } = {
  CATALOG: {
    label: "目录",
    value: "1"
  },
  MENU: {
    label: "菜单",
    value: "2"
  },
  BUTTON: {
    label: "按钮",
    value: "3"
  }
};

// 岗位类型
export const POST_STATUS: { [key: string]: CommonOptionString } = {
  NORMAL: {
    label: "正常",
    value: "0"
  },
  PAUSE: {
    label: "暂停",
    value: "1"
  }
};

// 用户类型
export const USER_STATUS: { [key: string]: CommonOptionString } = {
  NORMAL: {
    label: "正常",
    value: "0"
  },
  PAUSE: {
    label: "暂停",
    value: "1"
  }
};

// 是否类型
export const YESNO_TYPE: { [key: string]: CommonOptionString } = {
  YES: {
    label: "是",
    value: "1"
  },
  NO: {
    label: "否",
    value: "2"
  }
};
