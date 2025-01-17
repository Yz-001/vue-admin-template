import * as XLSX from "xlsx";
import { type ExcelColumn, ExcelFormatEnum, ExportDateFormatEnum, ExportModeEnum } from "./type";
import { useDateFormat } from "@vueuse/core";
import { ElMessage } from "element-plus";

export default function useExport(props: any) {
  // 格式化excel数据
  function getFormatExcelData(exportData: any[], excelElemColumns: ExcelColumn[]): any[] {
    return exportData.map(data => {
      const formattedData = { ...data };

      excelElemColumns.forEach(column => {
        let currentVal = data[column.prop];

        if (column.type === ExcelFormatEnum.OBJECT) {
          currentVal = getObjectValue(data, column);
        } else if (column.type === ExcelFormatEnum.SECTION) {
          currentVal = getSectionValue(data, column);
        } else if (column.type === ExcelFormatEnum.LIST) {
          currentVal = getListValues(data, column).join(", ");
        } else if (column.type === ExcelFormatEnum.DATE) {
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
        } else if (column.type === ExcelFormatEnum.NUMBER) {
          currentVal = formatNumber(data[column.prop], column.decimalPlaces);
        } else if (column.type === ExcelFormatEnum.CUSTOMFORMAT) {
          if (typeof column.formatFn == "function") currentVal = column.formatFn(data[column.prop], column.dateFormat);
        } else if (column.masked) {
          currentVal = maskText(data[column.prop]);
        }
        formattedData[column.prop] = currentVal; // 更新该列的值
      });

      return formattedData;
    });
  }

  const handleExport = () => {
    const name = props.filename;
    if (props.exportModel == ExportModeEnum.LISTDATA) {
      //当前列表数据导出
      const exportData = getFormatExcelData(props.excelData, props.excelElemColumns);
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
      XLSX.writeFile(workbook, `${name}.xlsx`);
    } else if (props.exportModel == ExportModeEnum.APILISTDATA) {
      // 请求接口-获取全部列表数据导出
      props.remoteConfig
        .remoteApi(props.remoteConfig.defaultParams)
        .then((res: any) => {
          const exportData = getFormatExcelData(res?.data?.rows || [], props.excelElemColumns);
          const worksheet = XLSX.utils.json_to_sheet(exportData);
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
