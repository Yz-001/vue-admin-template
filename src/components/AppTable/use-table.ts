import { DateFormatEnum, type TableProps, TagTypeEnum, type TableColumn } from "./type";
import { useDateFormat } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ref, computed, reactive } from "vue";

export default function useTable(
  props: TableProps,
  emit: (
    event: "update:pageSize" | "update:currentPage" | "refresh" | "update:data" | "cell-click",
    ...args: any[]
  ) => void
) {
  const tableData = ref(props.data);
  const tableColumns = computed(() => props.columns);
  const tableTotal = ref(0);
  const pagination = reactive({
    currentPage: props.defaultPageNumber,
    pageSize: props.defaultPageSize
  });
  // 获取对象中指定值
  function getObjectValue(row: any, column: TableColumn): string {
    const valueKey = column.sunValue || "name";
    return row[column.prop]?.[valueKey] || "";
  }

  function getSectionValue(row: any, column: TableColumn): string {
    if (!column.selectList) return "";
    const labelValue = column.labelValue || "value";
    const labelName = column.labelName || "name";
    const item = column.selectList.find(item => item[labelValue] === row[column.prop]);
    return item ? item[labelName] : "";
  }

  function getImageSrc(row: any, column: TableColumn): string {
    return row[column.prop] || "";
  }

  function handlePreviewImage(_row: any, _column: TableColumn) {
    // 图片预览逻辑可以在这里实现
    console.log("handlePreviewImage: ", _row, _column);
  }

  function getListValues(row: any, column: TableColumn): string[] {
    const items = row[column.prop] || [];
    const valueKey = column.sunValue || "name";
    return items.map((item: any) => item[valueKey]);
  }

  function formatDate(date: string | Date, formatStr: DateFormatEnum = DateFormatEnum.YYYY_MM_DD_HH_MM_SS): string {
    if (!date) return "";
    const formattedDate = useDateFormat(new Date(date), formatStr, { locales: "en-US" }).value;
    return formattedDate;
  }
  function formatDateRange(
    startDate: string | Date,
    endDate: string | Date,
    formatStr: DateFormatEnum = DateFormatEnum.YYYY_MM_DD_HH_MM_SS,
    separator: string = "-"
  ): string {
    const startFormatted = formatDate(startDate, formatStr);
    const endFormatted = formatDate(endDate, formatStr);
    return `${startFormatted} ${separator} ${endFormatted}`;
  }

  function handleSizeChange(newSize: number) {
    emit("update:pageSize", { currentPage: pagination.currentPage, pageSize: newSize });
    fetchData();
  }

  function handleCurrentChange(newPage: number) {
    emit("update:currentPage", { currentPage: newPage, pageSize: pagination.pageSize });
    fetchData();
  }
  function refresh() {
    fetchData();
    emit("refresh");
  }

  async function fetchData() {
    if (props?.remoteConfig?.autoRequest && props.remoteConfig.remoteApi) {
      try {
        const params = {
          ...(props.filterParams || {}),
          ...props.remoteConfig.defaultParams,
          pageNumber: pagination.currentPage,
          pageSize: pagination.pageSize
        };
        const result = await props.remoteConfig.remoteApi(params);
        tableData.value = result.data?.rows || [];
        tableTotal.value = result.data?.total;
        emit("update:data", JSON.parse(JSON.stringify(result.data?.rows || []))); // 更新外部组件的数据
      } catch (error: any) {
        if (error?.message) ElMessage({ message: error.message, type: "error" });
      }
    }
  }

  function clearData() {
    tableData.value = [];
    tableTotal.value = 0;
    emit("update:data", []);
  }

  function handleCellClick(row: any, column: any, cell: HTMLElement) {
    if (column.property == "template") return;
    const text = cell.innerText.trim();
    if (text) {
      copyText(text);
    }
    emit("cell-click", { row, column, cell });
  }

  function maskText(text: string): string {
    if (text.length <= 5) return text;
    return text.slice(0, 2) + "*".repeat(text.length - 5) + text.slice(-3);
  }

  function copyText(value: string, desensitize = false) {
    let text = "";
    if (desensitize) {
      text = maskText(value);
    } else {
      text = typeof value === "number" ? value : value.replace(/[\t\n]/g, " ");
    }
    // 动态创建 textarea 标签
    const textarea = document.createElement("textarea");
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = true;
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = text;
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea);
    // 选中值并复制
    textarea.select();
    const result = document.execCommand("Copy");
    if (result) {
      if (text === "") {
        ElMessage({ message: "没有可复制数据！", type: "warning" });
      } else {
        ElMessage({ message: "复制成功！", type: "success" });
      }
    }
    document.body.removeChild(textarea);
  }

  function downloadFile(fileUrl: string) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop() || "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    const timer = setTimeout(() => {
      document.body.removeChild(link);
      clearTimeout(timer);
    }, 0);
  }

  function getFileUrls(row: any, column: TableColumn): string[] {
    const fileUrls = row[column.prop];
    return Array.isArray(fileUrls) ? fileUrls : [fileUrls];
  }

  function isImageUrl(url: string): boolean {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extensionMatch = url.match(/\.([^.]+)$/i);
    return !!(extensionMatch && imageExtensions.includes(extensionMatch[1].toLowerCase()));
  }

  function handleFileClick(fileUrl: string, _column: TableColumn) {
    downloadFile(fileUrl);
    console.log("handleFileClick: ", _column);
  }

  function formatNumber(value: number, decimalPlaces: number = 2): string {
    return value.toFixed(decimalPlaces);
  }

  function getTagType(column: TableColumn, row: any): TagTypeEnum {
    if (column.tagSuccess && row[column.prop] === column.tagSuccess.value) return TagTypeEnum.Success;
    if (column.tagError && row[column.prop] === column.tagError.value) return TagTypeEnum.Danger;
    return column.tagType || TagTypeEnum.Info;
  }

  function getTagColor(column: TableColumn, row: any): string {
    if (column.tagSuccess && row[column.prop] === column.tagSuccess.value) return column.tagSuccess.color || "";
    if (column.tagError && row[column.prop] === column.tagError.value) return column.tagError.color || "";
    return "";
  }
  return {
    tableData,
    tableColumns,
    tableTotal,
    pagination,
    getObjectValue,
    getSectionValue,
    getImageSrc,
    handlePreviewImage,
    getListValues,
    formatDate,
    formatDateRange,
    handleSizeChange,
    handleCurrentChange,
    refresh,
    fetchData,
    clearData,
    handleCellClick,
    maskText,
    copyText,
    downloadFile,
    getFileUrls,
    isImageUrl,
    handleFileClick,
    formatNumber,
    getTagType,
    getTagColor
  };
}
