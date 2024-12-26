import { useElementPlus } from "@/plugins/elementPlus";
import { useEcharts } from "@/plugins/echarts";
import { useI18n } from "@/plugins/i18n";

export const plugins = (app: any) => {
  app.use(useI18n).use(useElementPlus);
  useEcharts(app);
};
