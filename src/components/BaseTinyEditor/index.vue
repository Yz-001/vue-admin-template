<script setup lang="ts">
import { computed, reactive, watch, ref, nextTick, onMounted } from "vue"; //全屏
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import * as defineConfig from "./config";
import type { BaseTinyEditorProps, CustomTinyConfig } from "./index.d.ts";
import { uploadServerFileApi } from "@/apis/common";

const props = withDefaults(defineProps<BaseTinyEditorProps>(), {
  enabled: true,
  readonly: false
});
const emits = defineEmits(["update:modelValue", "setHtml"]);
const htmlContent = defineModel<string>("htmlContent");
const tinymceId = ref("tiny-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""));
const editorRef = ref();
const editorManagerRef = ref();
const handleInit = reactive({
  ...defineConfig.initOption,
  selector: "#" + tinymceId.value, //富文本编辑器的id,
  ...props.customConfig,
  setup: function (editor: any) {
    editorRef.value = editor;
    editorManagerRef.value = editor.editorManager;
  },
  //图片上传
  images_upload_handler: function (blobInfo: any, progress: any) {
    new Promise((resolve, reject) => {
      let file = blobInfo.blob();
      if (file.size / 1024 / 1024 > 200) {
        reject({
          message: "上传失败，图片大小请控制在 200M 以内",
          remove: true
        });
      }
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);
      uploadServerFileApi(formData)
        .then((res: any) => {
          resolve(res.data.url);
        })
        .catch();
    });
  }
});

// 设置编辑器只读模式
watch(
  () => props.readonly,
  newValue => {
    nextTick(() => {
      if (tinymce) tinymce.activeEditor.mode.set(newValue ? "readonly" : "design");
    });
  },
  { immediate: true }
);

//初始化编辑器
onMounted(() => {
  tinymce.init({});
});

// 设置值
const handleSetContent = content => {
  tinymce.activeEditor.setContent(content);
};

// 获取值
const handleGetContent = () => {
  return tinymce.activeEditor.getContent();
};

// 添加dom节点
const handleDomAdd = (parentElm: Element, tagName: string, attrs: any, html: string, create: boolean) => {
  tinymce.activeEditor.dom.add(parentElm, tagName, attrs, html, create);
  editorRef.value.focus();
};

// 在当前光标插入节点
const handleDomInsert = (eleStr: string, config: { [key: string]: any }) => {
  tinymce.activeEditor.insertContent(eleStr, config);
  editorRef.value.focus();
};

// 删除初始p下br
const handlePinitBrRemove = (rootElm: Element | any) => {
  if (rootElm?.childNodes?.length == 1 && rootElm?.childNodes[0]?.tagName == "BR") {
    tinymce.activeEditor.dom.remove(rootElm?.childNodes[0]);
  }
};
// 获取节点
const handleDomGet = (targetDom: Element) => {
  return tinymce.activeEditor.dom.get(targetDom);
};

// 获取body内容
const handleBodyGet = () => {
  return tinymce.activeEditor.dom.get(tinymce.activeEditor.getBody());
};

// 重置HTML
const handleSetHTML = (elm: Element | string, html: string) => {
  tinymce.activeEditor.dom.setHTML(elm, html);
};

// 选择节点
const handleDomSelect = (selector: string, scope?: any) => {
  return tinymce.activeEditor.dom.select(selector, scope);
};

defineExpose({
  editorManagerRef,
  handleSetContent,
  handleGetContent,
  handleDomAdd,
  handleDomInsert,
  handlePinitBrRemove,
  handleDomGet,
  handleBodyGet,
  handleSetHTML,
  handleDomSelect
});
</script>

<template>
  <div class="base-editor">
    <editor :id="tinymceId" v-model="htmlContent" :init="handleInit" :enabled="enabled" />
  </div>
</template>

<style lang="scss" scoped>
.base-editor {
  border: 1px solid #dddfe5;
}

:deep(.tox-tinymce) {
  height: 100% !important;
  border: 1px solid #dddfe5;
  border-radius: 4px;

  // .tox-statusbar {
  //   display: none;
  // }
}
</style>
<style lang="scss">
/* 在el-dialog中使用tinymce  z-index被遮挡 */
.tox-tinymce-aux {
  z-index: 3000 !important;
}
</style>
