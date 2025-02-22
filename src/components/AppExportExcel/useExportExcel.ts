import * as XLSX from "xlsx";
import { type ExcelColumn, ExcelFormatEnum, ExportDateFormatEnum, ExportModeEnum } from "./type";
import { useDateFormat } from "@vueuse/core";
import { ElMessage } from "element-plus";

export default function useExport(props: any) {
  // 格式化excel数据
  function getFormatExcelData(exportData: any[], excelElemColumns: ExcelColumn[]): any[] {
    // 提前准备一个 prop 列表，以便快速查找
    const columnProps = excelElemColumns.map(column => column.prop);
    return exportData.map(data => {
      const formattedData: { [key: string]: any } = {};

      excelElemColumns.forEach(column => {
        // 确保 data 中存在对应的 prop 并且该列已定义
        if (data.hasOwnProperty(column.prop) && columnProps.includes(column.prop)) {
          let currentVal;

          switch (column.type) {
            case ExcelFormatEnum.OBJECT:
              currentVal = getObjectValue(data, column);
              break;
            case ExcelFormatEnum.SECTION:
              currentVal = getSectionValue(data, column);
              break;
            case ExcelFormatEnum.LIST:
              currentVal = getListValues(data, column).join(", ");
              break;
            case ExcelFormatEnum.DATE:
              if (column.dateStartProp && column.dateEndProp) {
                currentVal = formatDateRange(
                  data[column.dateStartProp],
                  data[column.dateEndProp],
                  column.dateFormat,
                  column.separator
                );
              } else {
                currentVal = formatDate(data[column.prop], column.dateFormat);
              }
              break;
            case ExcelFormatEnum.NUMBER:
              currentVal = formatNumber(data[column.prop], column.decimalPlaces);
              break;
            case ExcelFormatEnum.CUSTOMFORMAT:
              if (typeof column.formatFn === "function") {
                currentVal = column.formatFn(data[column.prop], column.dateFormat);
              }
              break;
            default:
              currentVal = data[column.prop]; // 默认情况下，直接使用原始值
          }

          // 如果有 masked 属性并且为真，则应用 maskText 函数
          if (column.masked) {
            currentVal = maskText(currentVal);
          }

          // 只添加那些在 excelElemColumns 中定义了的 prop
          formattedData[column.prop] = currentVal;
        }
      });
      return Object.values(formattedData);
    });
  }

  const handleExport = () => {
    const name = props.filename;
    if (props.exportModel == ExportModeEnum.LISTDATA) {
      //当前列表数据导出
      const exportData = getFormatExcelData(props.excelData, props.excelElemColumns);
      const headData = props?.excelElemColumns?.map((i: ExcelColumn) => i.label);
      const worksheet = XLSX.utils.aoa_to_sheet([headData, ...exportData]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
      XLSX.writeFile(workbook, `${name}.xlsx`);
    } else if (props.exportModel == ExportModeEnum.APILISTDATA) {
      // 请求接口-获取全部列表数据导出
      props.remoteConfig
        .remoteApi(props.remoteConfig.defaultParams)
        .then((res: any) => {
          const exportData = getFormatExcelData(res?.data?.rows || [], props.excelElemColumns);
          const headData = props?.excelElemColumns?.map((i: ExcelColumn) => i.label);
          const worksheet = XLSX.utils.aoa_to_sheet([headData, ...exportData]);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, name);
          XLSX.writeFile(workbook, `${name}.xlsx`);
        })
        .catch((error: Error) => {
          if (error?.message) ElMessage({ message: error.message, type: "error" });
        });
    } else if (props.exportModel == ExportModeEnum.BINARYSTREAM) {
      // 请求接口-二进制
      props.remoteConfig
        .remoteApi(props.remoteConfig.defaultParams)
        .then((blobData: any) => {
          const url = window.URL.createObjectURL(
            new Blob([blobData], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            })
          );
          downloadFile(url, name);
        })
        .catch((error: Error) => {
          if (error?.message) ElMessage({ message: error.message, type: "error" });
        });
    }
  };

  const applyStyles = (worksheet: XLSX.WorkSheet) => {
    // 这里可以添加更复杂的样式逻辑
    // 目前只演示如何设置单元格样式
    if (props.excelStyle?.headerStyle) {
      const range = XLSX.utils.decode_range(String(worksheet["!ref"]));
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!worksheet[address]) continue;
        worksheet[address].s = props.excelStyle.headerStyle;
      }
    }

    if (props.excelStyle?.cellStyle) {
      // 对所有单元格应用样式
      Object.keys(worksheet).forEach(key => {
        if (key[0] !== "!") {
          worksheet[key].s = props.excelStyle.cellStyle;
        }
      });
    }
  };

  // 获取对象中指定值
  function getObjectValue(row: any, column: ExcelColumn): string {
    const valueKey = column.sunValue || "name";
    return row[column.prop]?.[valueKey] || "";
  }

  function getSectionValue(row: any, column: ExcelColumn): string {
    if (!column.selectList) return "";
    const labelValue = column.labelValue || "value";
    const labelName = column.labelName || "name";
    const item = column.selectList.find(item => item[labelValue] === row[column.prop]);
    return item ? item[labelName] : "";
  }

  function getListValues(row: any, column: ExcelColumn): string[] {
    const items = row[column.prop] || [];
    const valueKey = column.sunValue || "name";
    return items.map((item: any) => item[valueKey]);
  }

  function formatDate(
    date: string | Date,
    formatStr: ExportDateFormatEnum = ExportDateFormatEnum.YYYY_MM_DD_HH_MM_SS
  ): string {
    if (!date) return "";
    const formattedDate = useDateFormat(new Date(date), formatStr, { locales: "en-US" }).value;
    return formattedDate;
  }

  function formatDateRange(
    startDate: string | Date,
    endDate: string | Date,
    formatStr: ExportDateFormatEnum = ExportDateFormatEnum.YYYY_MM_DD_HH_MM_SS,
    separator: string = "-"
  ): string {
    const startFormatted = formatDate(startDate, formatStr);
    const endFormatted = formatDate(endDate, formatStr);
    return `${startFormatted} ${separator} ${endFormatted}`;
  }

  function formatNumber(value: number, decimalPlaces: number = 2): string {
    return decimalPlaces != undefined ? Number(value)?.toFixed(decimalPlaces) : String(Number(value));
  }

  function maskText(text: string): string {
    if (text.length <= 5) return text;
    return text.slice(0, 2) + "*".repeat(text.length - 5) + text.slice(-3);
  }

  function downloadFile(fileUrl: string, name: string = "下载文件") {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/")?.pop() || "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.download = name;
    link.click();
    const timer = setTimeout(() => {
      document.body.removeChild(link);
      clearTimeout(timer);
    }, 0);
  }

  return {
    handleExport,
    getFormatExcelData,
    applyStyles
  };
}
