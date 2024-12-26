<template>
  <div class="base-editor">
    <editor :id="tinymceId" v-model="htmlContent" :init="handleInit" :enabled="enabled" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref, nextTick, onMounted } from "vue"; //全屏
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import * as defineConfig from "./config";

const props = withDefaults(defineProps<BaseTinyEditorProps>(), {
  enabled: true,
  readonly: false
});
const emits = defineEmits(["update:modelValue", "setHtml"]);
const htmlContent = defineModel<string>("htmlContent");
// const loading = ref(false);
const tinymceId = ref("tiny-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""));
const editorRef = ref();
const editorManagerRef = ref();
const handleInit = reactive({
  ...defineConfig.initOption,
  selector: "#" + tinymceId.value, //富文本编辑器的id,
  ...props.customConfig,
  setup: function (editor) {
    editorRef.value = editor;
    editorManagerRef.value = editor.editorManager;
  },
  //图片上传
  images_upload_handler: function (blobInfo, progress) {
    // 实际项目再配置
    // new Promise((resolve, reject) => {
    //   let file = blobInfo.blob();
    //   if (file.size / 1024 / 1024 > 200) {
    //     reject({
    //       message: "上传失败，图片大小请控制在 200M 以内",
    //       remove: true
    //     });
    //   }
    //   const formData = new FormData();
    //   formData.append("file", file);
    //   console.log(formData);
    //   axios
    //     .post("/api/upload/upload", formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data"
    //       },
    //       onUploadProgress: progressEvent => {
    //         progress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
    //       }
    //     })
    //     .then(res => {
    //       resolve(res.data.url);
    //     })
    //     .catch();
    // });
  }
});

// 设置编辑器只读模式
watch(
  () => props.readonly,
  newValue => {
    nextTick(() => {
      tinymce.activeEditor.mode.set(newValue ? "readonly" : "design");
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

interface BaseTinyEditorProps {
  enabled?: boolean; //是否启用
  readonly?: boolean; //是否只读
  // contentHeight?: string; //TODO 内容高度
  customConfig?: CustomTinyConfig; //自定义额外配置集合
}
// 如需其他参数从官网拿值并加类型 https://www.tiny.cloud/docs/tinymce/latest/editor-size-options/
// CustomConfig配置的会顶替掉defineConfig配置 属于自定义配置
export interface CustomTinyConfig {
  inline?: boolean; // 行内模式
  placeholder?: string; // 内容预展示文本
  editable_root?: boolean; // 编辑器初始可编辑状态
  plugins?: string | Array<string>; // 插件
  toolbar?: string | Array<string> | boolean; // 工具栏
  resize?: boolean; //调整编辑器大小工具
  menubar?: boolean; //是否显示菜单栏
  statusbar?: boolean; //是否显示隐藏状态栏
  quickbars_selection_toolbar?: string | boolean; //选择后快捷操作
  quickbars_insert_toolbar?: string | boolean; //插入操作快捷操作
  link_context_toolbar?: string | boolean; //链接快捷操作
  forced_root_block_attrs?: {
    //为forced_root_block指定属性
    [key: string]: any;
  };
}
</script>
<style lang="scss" scoped>
:deep(.tox-tinymce) {
  // height: v-bind("props.contentHeight") !important;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  .tox-statusbar {
    display: none;
  }
}
</style>
<style lang="scss">
/* 在el-dialog中使用tinymce  z-index被遮挡 */
.tox-tinymce-aux {
  z-index: 3000 !important;
}
</style>
