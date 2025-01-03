import type { VNodeChild } from "vue";

export interface FormProps {
  componentList?: ComponentItem[];
  formRules?: Record<string, any[]>;
  labelWidth?: string;
  operSpan?: {
    [key in keyof typeof SpanEnum]: number;
  };
  formLine?: boolean;
}

export interface ComponentItem {
  componentName: string; // 实际组件名 或 CustomTemplate自定义
  prop?: string; // 表单项对应的 model 属性名
  label?: string; // 表单项标签
  rules?: any[]; // 表单项验证规则
  attrs?: {
    //单项属性
    [key: string]: any;
  };
  events?: {
    //单项事件
    [key: string]: ((...args: any[]) => void) | Array<(...args: any[]) => void>;
  };
  span?: {
    //单项响应式大小
    [key in keyof typeof SpanEnum]: number;
  };
  slots?: {
    //单项插槽
    default?: string | ((props: any) => VNodeChild);
  };
}

export enum SpanEnum {
  sm = "sm",
  md = "md",
  lg = "lg"
}
