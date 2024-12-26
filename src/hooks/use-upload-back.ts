import { delUploadServerFileApi } from "@/apis/common";
import type { Wapper } from "@/utils/http/types";
import { ElMessage, type UploadFile, type UploadProgressEvent } from "element-plus";
import { useI18n } from "vue-i18n";

export default function useUpload(props: any, emit: any) {
  const { t } = useI18n();
  const fileData = ref<FileResItem[]>([]);
  const acceptTip = computed(() => {
    const fileTypes = props?.accept?.map((ft: string) => ft?.slice(1)); // 移除每个元素的第一个字符
    return fileTypes?.join(" / ");
  });

  const uploadAcceptLimit = computed(() => {
    // el-upload 区分大小写 accept合并一份大写的
    const upperCase = props?.accept?.map((ft: string) => ft?.toUpperCase());
    return [...props?.accept, ...upperCase].toString();
  });

  // 进度条
  const uploadPercentage = ref(0);
  const uploadPercentagFile = ref();
  const uploadLosding = computed(() => {
    return uploadPercentage.value > 0;
  });
  const handleProgress = (evt: UploadProgressEvent, uploadFile: UploadFile) => {
    uploadPercentagFile.value = uploadFile;
    uploadPercentage.value = Number(evt.percent.toFixed(2));
  };

  // 上传事件
  const handBeforeUpload = (uploadFile: UploadFile) => {
    const suffix = uploadFile.name?.split(".")?.pop()?.toLocaleLowerCase();
    if (!props?.accept?.includes(`.${suffix}`)) {
      ElMessage.error(t("upload.meg.type", [props?.accept?.toString()]));
      return false;
    }

    if (uploadFile.size && uploadFile.size > 1048576 * props?.size) {
      ElMessage.error(t("upload.meg.size", [props.size]));
      return false;
    }

    uploadPercentage.value = 1;
    return true;
  };

  const handleSuccess = (response: Wapper<FileResItem>) => {
    uploadPercentage.value = 0;
    fileData.value.push({ fileName: response?.data?.fileName, id: response?.data?.id });
    emit("on-file-success", fileData.value);
  };

  const handleRemove = async (uploadFile: { response: Wapper<FileResItem> }) => {
    const delIds = uploadFile?.response?.data?.id;
    if (!delIds) {
      return true;
    } else {
      try {
        await delUploadServerFileApi([delIds]);
        if (fileData.value && fileData.value.length) {
          const removeIndex = fileData.value.findIndex((item: FileResItem) => item.id == delIds);
          if (removeIndex > -1) {
            fileData.value?.splice(removeIndex, 1);
          }
        }
        emit("on-file-remove", fileData.value, uploadFile);
        return true;
      } catch (error: any) {
        if (error?.msg) ElMessage.error(error.msg);
        return false;
      }
    }
  };

  const handleExceed = () => {
    ElMessage.error(t("upload.meg.exceed", [props.limit, fileData.value?.length || 0]));
  };

  const handleError = (error: Wapper<any>, uploadFile: UploadFile) => {
    //todo test
    if (error?.msg) {
      ElMessage.error(error.msg);
    }
    if (uploadRef.value) uploadRef.value.handleRemove(uploadFile);
    uploadPercentage.value = 0;
    emit("on-error", error, fileData.value);
  };

  const uploadRef = ref();
  const handleUploadCancel = () => {
    if (uploadRef.value) {
      uploadRef.value.abort();
      uploadRef.value.handleRemove(uploadPercentagFile.value);
      uploadPercentage.value = 0;
    }
  };

  // 弹框相关
  const handleDialogClose = async () => {
    if (fileData.value?.length) {
      const ids = fileData.value?.map((item: FileResItem) => item?.id);
      await delUploadServerFileApi(ids)
        .then(() => {
          fileData.value = [];
        })
        .catch(({ msg }) => {
          if (msg) ElMessage.error(msg);
        });
    }

    emit("on-cancel");
    emit("update:uploadDialogShow", false);
  };

  const handleDialogAdd = async () => {
    emit("on-save", fileData.value);
    fileData.value = [];
    handleDialogClose();
  };

  watchEffect(() => {
    if (props?.defultFileList) {
      fileData.value = JSON.parse(JSON.stringify(props?.defultFileList));
    }
  });

  return {
    fileData,
    uploadAcceptLimit,
    uploadLosding,
    handleProgress,
    handBeforeUpload,
    handleSuccess,
    handleError,
    handleExceed,
    handleRemove,
    uploadRef,
    handleUploadCancel,
    uploadPercentage,
    uploadPercentagFile,
    acceptTip,
    handleDialogClose,
    handleDialogAdd
  };
}

export interface FileResItem {
  id: string;
  fileName: string;
}
