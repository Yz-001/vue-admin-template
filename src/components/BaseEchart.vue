<template>
  <div ref="elEcharts" class="base-echarts" />
</template>
<script setup lang="ts">
import { shallowRef, onMounted, watch } from "vue";
import { useEcharts, type EChartsCoreOption } from "@/hooks/use-echart";

interface Props {
  options: EChartsCoreOption;
  isOnDataZoom?: boolean;
  isOnItemClick?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["dataZoomChange", "itemClick"]);
const elEcharts = shallowRef();
const currentOptions = shallowRef(props.options);
const addOnDataZoom = () => {
  charts.value?.on("dataZoom", handleDataZoomChange);
};
const addItemClick = () => {
  charts.value?.on("click", handleChartItemClick);
};
const handleDataZoomChange = (data: EcZoomDataRow) => {
  const option = charts.value?.getOption();
  const startValue = option?.dataZoom?.[0]?.startValue;
  const endValue = option?.dataZoom?.[0]?.endValue;
  const xAxisStartValue = option?.xAxis?.[0]?.data[startValue];
  const xAxisEndValue = option?.xAxis?.[0]?.data[endValue];
  emit("dataZoomChange", { ...data, startValue, endValue, xAxisStartValue, xAxisEndValue });
};
const handleChartItemClick = (params: any) => {
  emit("itemClick", params);
};
const { charts, setOptions, initCharts } = useEcharts(elEcharts, currentOptions.value);

watch(
  () => props.options,
  nVal => {
    let targetOptions: EChartsCoreOption = {};
    targetOptions = { ...nVal };
    setOptions(targetOptions);
  }
);

onMounted(() => {
  initCharts();
  nextTick(() => {
    if (props?.isOnDataZoom) {
      addOnDataZoom();
    }
    if (props?.isOnItemClick) {
      addItemClick();
    }
  });
});

onDeactivated(() => {
  if (props?.isOnDataZoom) {
    charts.value?.off("dataZoom", handleDataZoomChange);
  }
  if (props?.isOnItemClick) {
    charts.value?.on("click", handleChartItemClick);
  }
});

export interface EcZoomDataRow {
  type: "datazoom";
  // 缩放的开始位置的百分比，0 - 100
  start: number;
  // 缩放的结束位置的百分比，0 - 100
  end: number;
  // 缩放的开始位置的数值，只有在工具栏的缩放行为的事件中存在。
  startValue?: number;
  // 缩放的结束位置的数值，只有在工具栏的缩放行为的事件中存在。
  endValue?: number;
  xAxisStartValue?: string;
  xAxisEndValue?: string;
  batch: EcZoomDataRow[];
}
export interface ChartItem {
  componentType: string;
  seriesType: string; // 系列类型。值可能为：'line'、'bar'、'pie' 等。当 componentType 为 'series' 时有意义。
  seriesIndex: number; // 系列在传入的 option.series 中的 index。当 componentType 为 'series' 时有意义。
  seriesName: string; // 系列名称。当 componentType 为 'series' 时有意义。
  name: string; // 数据名，类目名
  dataIndex: number; // 数据在传入的 data 数组中的 index
  data: Object; // 传入的原始数据项
  dataType: string;
  value: number | number[]; // 传入的数据值
  color: string; // 数据图形的颜色。当 componentType 为 'series' 时有意义。
}
</script>

<style lang="scss" scoped>
.base-echarts {
  width: 100%;
  height: 100%;
}
</style>
