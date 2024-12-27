import { useAppStore } from "@/stores/modules/app";
import { layoutModeEnum, layoutDeviceEnum } from "@/apis/interface/common";

export default function useLayout() {
  const appStore = useAppStore();

  const layoutDevice = computed(() => {
    return appStore.$state.device;
  });
  const mobileDevice = computed(() => {
    return layoutDevice.value == layoutDeviceEnum.MOBILE;
  });
  const desktopDevice = computed(() => {
    return layoutDevice.value == layoutDeviceEnum.DESKTOP;
  });
  const layoutMode = computed(() => {
    return appStore.$state.layoutMode;
  });
  const verticalMode = computed(() => {
    return layoutMode.value == layoutModeEnum.VERTICAL;
  });
  const horizontalMode = computed(() => {
    return layoutMode.value == layoutModeEnum.HORIZONTAL;
  });
  const mixinMode = computed(() => {
    return layoutMode.value == layoutModeEnum.MIXIN;
  });
  const sidebarOpened = computed(() => {
    return appStore.$state.sidebar.opened;
  });
  const sidebarCollapse = computed(() => {
    return appStore.sidebar.collapse;
  });

  return {
    layoutDevice,
    mobileDevice,
    desktopDevice,
    layoutMode,
    verticalMode,
    horizontalMode,
    mixinMode,
    sidebarOpened,
    sidebarCollapse
  };
}
