import { type Ref, shallowRef, onMounted, onDeactivated, onBeforeUnmount, watch } from "vue";
import echarts from "@/plugins/echarts";
export type EChartsCoreOption = echarts.EChartsCoreOption;
import { useAppStore } from "@/stores/modules/app";

export default function useEcharts(elRef: Ref<HTMLDivElement>, options: EChartsCoreOption) {
  const charts = shallowRef<echarts.ECharts>();

  const initCharts = (themeColor?: Array<string>) => {
    charts.value = echarts.init(elRef.value);
    if (themeColor) {
      options.color = themeColor;
    }
    setOptions(options);
  };
  const setOptions = (options: EChartsCoreOption) => {
    charts.value && charts.value.setOption(options);
  };
  const echartsResize = () => {
    charts.value && charts.value.resize();
  };
  // const getEcharGradation = (arr: Array<any>) => {
  //   return new echarts.graphic.LinearGradient(...arr);
  // };
  const appStore = useAppStore();
  watch(
    () => appStore.$state.sidebar.collapse,
    (newVal, oldVal) => {
      if (newVal != oldVal) {
        echartsResize();
      }
    }
  );
  onMounted(() => {
    window.addEventListener("resize", echartsResize);
  });
  // 防止 echarts 页面 keepAlive 时，还在继续监听页面
  onDeactivated(() => {
    window.removeEventListener("resize", echartsResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", echartsResize);
  });
  return {
    charts,
    initCharts,
    setOptions,
    echartsResize
    // getEcharGradation
  };
}
