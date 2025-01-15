import type { VNodeChild } from "vue";

export interface FormProps {
  componentList?: ComponentItem[];
  formRules?: Record<string, any[]>;
  labelWidth?: string;
  operColLayout?: {
    [key in keyof typeof ColLayoutEnum]?: number;
  };
  formLine?: boolean;
  collapseCount?: number; // 指定折叠时显示的组件数量，默认为1
}

export interface ComponentItem {
  type: string; // 实际组件名 或 CustomTemplate自定义
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
  colLayout?: {
    //单项响应式大小
    [key in keyof typeof ColLayoutEnum]?: number;
  };
  slots?: {
    //单项插槽
    default?: string | ((props: any) => VNodeChild);
  };
}

// 布局枚举
export enum ColLayoutEnum {
  sm = "sm", // ≥768px 分辨率下大小
  md = "md", // ≥992px 分辨率下大小
  lg = "lg", // ≥1200px 分辨率下大小
  offset = "offset", // 左侧间隔格数
  push = "push", // 向右移动格数
  pull = "pull" // 向左移动格数
}

// Form组件枚举
export enum FormComponentEnum {
  ElAffix = "ElAffix",
  ElAlert = "ElAlert",
  ElAutocomplete = "ElAutocomplete",
  ElAutoResizer = "ElAutoResizer",
  ElAvatar = "ElAvatar",
  ElAnchor = "ElAnchor",
  ElAnchorLink = "ElAnchorLink",
  ElBacktop = "ElBacktop",
  ElBadge = "ElBadge",
  ElBreadcrumb = "ElBreadcrumb",
  ElBreadcrumbItem = "ElBreadcrumbItem",
  ElButton = "ElButton",
  ElButtonGroup = "ElButtonGroup",
  ElCalendar = "ElCalendar",
  ElCard = "ElCard",
  ElCarousel = "ElCarousel",
  ElCarouselItem = "ElCarouselItem",
  ElCascader = "ElCascader",
  ElCascaderPanel = "ElCascaderPanel",
  ElCheckTag = "ElCheckTag",
  ElCheckbox = "ElCheckbox",
  ElCheckboxButton = "ElCheckboxButton",
  ElCheckboxGroup = "ElCheckboxGroup",
  ElCol = "ElCol",
  ElCollapse = "ElCollapse",
  ElCollapseItem = "ElCollapseItem",
  ElCollapseTransition = "ElCollapseTransition",
  ElColorPicker = "ElColorPicker",
  ElConfigProvider = "ElConfigProvider",
  ElContainer = "ElContainer",
  ElAside = "ElAside",
  ElFooter = "ElFooter",
  ElHeader = "ElHeader",
  ElMain = "ElMain",
  ElDatePicker = "ElDatePicker",
  ElDescriptions = "ElDescriptions",
  ElDescriptionsItem = "ElDescriptionsItem",
  ElDialog = "ElDialog",
  ElDivider = "ElDivider",
  ElDrawer = "ElDrawer",
  ElDropdown = "ElDropdown",
  ElDropdownItem = "ElDropdownItem",
  ElDropdownMenu = "ElDropdownMenu",
  ElEmpty = "ElEmpty",
  ElForm = "ElForm",
  ElFormItem = "ElFormItem",
  ElIcon = "ElIcon",
  ElImage = "ElImage",
  ElImageViewer = "ElImageViewer",
  ElInput = "ElInput",
  ElInputNumber = "ElInputNumber",
  ElLink = "ElLink",
  ElMenu = "ElMenu",
  ElMenuItem = "ElMenuItem",
  ElMenuItemGroup = "ElMenuItemGroup",
  ElSubMenu = "ElSubMenu",
  ElPageHeader = "ElPageHeader",
  ElPagination = "ElPagination",
  ElPopconfirm = "ElPopconfirm",
  ElPopover = "ElPopover",
  ElPopper = "ElPopper",
  ElProgress = "ElProgress",
  ElRadio = "ElRadio",
  ElRadioButton = "ElRadioButton",
  ElRadioGroup = "ElRadioGroup",
  ElRate = "ElRate",
  ElResult = "ElResult",
  ElRow = "ElRow",
  ElScrollbar = "ElScrollbar",
  ElSelect = "ElSelect",
  ElOption = "ElOption",
  ElOptionGroup = "ElOptionGroup",
  ElSelectV2 = "ElSelectV2",
  ElSkeleton = "ElSkeleton",
  ElSkeletonItem = "ElSkeletonItem",
  ElSlider = "ElSlider",
  ElSpace = "ElSpace",
  ElStatistic = "ElStatistic",
  ElCountdown = "ElCountdown",
  ElSteps = "ElSteps",
  ElStep = "ElStep",
  ElSwitch = "ElSwitch",
  ElTable = "ElTable",
  ElTableColumn = "ElTableColumn",
  ElTableV2 = "ElTableV2",
  ElTabs = "ElTabs",
  ElTabPane = "ElTabPane",
  ElTag = "ElTag",
  ElText = "ElText",
  ElTimePicker = "ElTimePicker",
  ElTimeSelect = "ElTimeSelect",
  ElTimeline = "ElTimeline",
  ElTimelineItem = "ElTimelineItem",
  ElTooltip = "ElTooltip",
  ElTransfer = "ElTransfer",
  ElTree = "ElTree",
  ElTreeSelect = "ElTreeSelect",
  ElTreeV2 = "ElTreeV2",
  ElUpload = "ElUpload",
  ElWatermark = "ElWatermark",
  ElTour = "ElTour",
  ElTourStep = "ElTourStep",
  CustomTemplate = "CustomTemplate" // 自定义模板组件
}
