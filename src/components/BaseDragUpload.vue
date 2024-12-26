<template>
  <div class="el-dialog-custom">
    <ElDialog
      :modelValue="uploadDialogShow"
      :title="$t('upload.title')"
      width="30%"
      :show-close="false"
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
    >
      <ElUpload
        ref="uploadRef"
        drag
        class="base-drag-upload"
        :action="action"
        :headers="headers"
        :file-list="fileData"
        :disabled="uploadLosding"
        :accept="uploadAcceptLimit"
        :limit="limit"
        :on-progress="handleProgress"
        :before-upload="handBeforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-exceed="handleExceed"
        :before-remove="handleRemove"
        :show-file-list="!uploadLosding"
      >
        <div v-if="uploadLosding" class="base-drag-upload__progress">
          <p class="base-drag-upload__progress__info">
            <span :title="uploadPercentagFile?.name">{{ uploadPercentagFile?.name }}</span>
          </p>
          <p class="base-drag-upload__num">
            <ElProgress :percentage="uploadPercentage" />
            <ElIcon class="base-drag-upload__close" @click.stop="handleUploadCancel"><Close /></ElIcon>
          </p>
        </div>
        <div v-else>
          <el-icon class="base-drag-upload__icon"><Upload /></el-icon>
          <div class="base-drag-upload__centertip">{{ centerTip || $t("upload.meg.centertip") }}</div>
          <span class="base-drag-upload__accept">{{ $t("upload.meg.accept") }}：{{ acceptTip }} </span>
        </div>
      </ElUpload>
      <template #footer>
        <span class="el-dialog-custom__foot">
          <ElButton :disabled="!!uploadPercentage" @click="handleDialogClose">{{ $t("operate.cancel") }}</ElButton>
          <ElButton :disabled="!!uploadPercentage" type="primary" @click="handleDialogAdd">{{
            $t("operate.newCreate")
          }}</ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { COMMON_UPLOAD_FILE } from "@/apis/common";
import { baseUrl } from "@/apis/request";
import useUpload from "@/hooks/use-upload";
import { getToken } from "@/utils/storage";

const props = withDefaults(defineProps<BaseUploadProps>(), {
  action: import.meta.env.VITE_APP_API_URL + baseUrl + COMMON_UPLOAD_FILE,
  headers: {
    Authorization: getToken(),
    token: getToken()
  },
  accept: () => [
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".doc",
    ".docx",
    ".mp4",
    ".wmv",
    ".avi",
    ".mpg",
    ".mpeg",
    ".bmp",
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf"
  ],
  limit: 10,
  size: 200
});

const emit = defineEmits([
  "on-file-success",
  "on-file-error",
  "on-file-remove",
  "on-cancel",
  "on-save",
  "update:uploadDialogShow",
  "on-error"
]);

const {
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
} = useUpload(props, emit);

interface BaseUploadProps {
  uploadDialogShow?: boolean; // 弹窗是否可见
  action?: string; // 上传文件API
  headers?: any; // 上传文件请求头
  defultFileList?: File[]; // 文件列表  不填默认为空
  accept?: string[]; // 支持上传文件格式 !谨慎传参 请参考默认格式，使用小写格式
  centerTip?: string; // 中间行的文字提示
  limit?: number; // 文件限制上传个数
  size?: number; // 文件限制大小 MB单位
  type?: string; // 用于区分上传组件类型
}
</script>

<style lang="scss" scoped>
.base-drag-upload {
  width: calc(100% - 40px);
  margin: 0 auto;

  :deep(.el-upload-dragger) {
    height: 192px;
    background: #fafafa;
    border-color: #d9d9d9;
  }

  &__icon {
    width: 48px;
    height: 48px;
  }

  &__centertip {
    margin-top: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #808080;
  }

  &__accept {
    font-size: 12px;
    line-height: 20px;
    color: #b1b1b1;
  }

  &__progress {
    width: 244px;
    margin: 30px auto;

    &__info {
      display: flex;
      align-items: center;
      text-align: left;

      .el-image {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }

      span {
        display: inline-block;
        width: calc(100% - 30px);
        overflow: hidden;
        color: #333;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    :deep(.el-progress-bar__inner) {
      background-color: var(--el-color-primary);
    }
  }

  &__num {
    display: flex;
  }

  &__close {
    margin-top: -2px;
    font-size: 20px;
    color: #333;
  }

  :deep(.el-upload-list) {
    max-height: 300px;
    overflow-y: auto;
  }

  .el-progress {
    width: 230px;
  }
}

:deep(.el-dialog) {
  border-radius: 8px !important;
}

.el-dialog-custom {
  border-radius: 8px !important;

  .el-dialog__body {
    padding: 10px 0 0;
  }

  .el-dialog__title {
    &::before {
      position: relative;
      top: 3px;
      left: -5px;
      display: inline-block;
      width: 4px;
      height: 18px;
      content: "";
      background: var(--el-color-primary);
      border-radius: 3px;
    }
  }

  .el-dialog-custom__foot {
    .el-button:not(.is-disabled) {
      width: 80px;
      height: 32px;
      color: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
      border-radius: 6px;

      &.el-button--primary {
        color: #fafafa;
      }
    }

    .el-button.is-disabled {
      width: 80px;
    }

    .el-button--primary.is-disabled {
      border-color: none;
      opacity: 0.6;
    }
  }
}
</style>
