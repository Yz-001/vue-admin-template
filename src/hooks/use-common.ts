// import { useUserStore } from "@/stores/modules/user";
import { useDateFormat } from "@vueuse/core";

export default function useCommon() {
  // 自定义弹框 3秒消失
  const customMsgProp = reactive({
    loading: false,
    status: "",
    causeMsg: ""
  });

  const setCustomMsg = (status: "error" | "success", causeMsg?: string) => {
    customMsgProp.status = status;
    customMsgProp.causeMsg = causeMsg || "";
    const timer = setTimeout(() => {
      customMsgProp.causeMsg = "";
      customMsgProp.status = "";
      clearTimeout(timer);
    }, 3 * 1000);
  };
  // const userStore = useUserStore();
  // const tenantName = computed(() => {
  //   return userStore.tenantList?.find(i => i.sid == userStore?.userInfoSet?.tenantSid)?.name;
  // });

  const dateDefaultSlice = (dateStr: string) => {
    if (!dateStr) return "";
    if (new Date().getFullYear() == new Date(dateStr).getFullYear()) {
      // 今年 展示月日 时分秒
      return useDateFormat(dateStr, "MM-DD HH:mm:ss").value;
    } else {
      // 往年 年月日
      return useDateFormat(dateStr, "YYYY-MM-DD").value;
    }
  };
  return {
    customMsgProp,
    setCustomMsg,
    // tenantName,
    dateDefaultSlice
  };
}
