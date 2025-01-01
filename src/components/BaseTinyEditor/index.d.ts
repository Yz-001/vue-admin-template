export interface BaseTinyEditorProps {
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
