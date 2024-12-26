import { useAppStore } from "@/stores/modules/app";

export default function useLayout() {
  const appStore = useAppStore();

  const layoutDevice = computed(() => {
    return appStore.$state.device;
  });
  const mobileDevice = computed(() => {
    return layoutDevice.value == "mobile";
  });
  const desktopDevice = computed(() => {
    return layoutDevice.value == "desktop";
  });
  const layoutMode = computed(() => {
    return appStore.$state.layoutMode;
  });
  const verticalMode = computed(() => {
    return layoutMode.value == "vertical";
  });
  const horizontalMode = computed(() => {
    return layoutMode.value == "horizontal";
  });
  const mixinMode = computed(() => {
    return layoutMode.value == "mixin";
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
