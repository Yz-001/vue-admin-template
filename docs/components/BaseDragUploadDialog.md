# BaseDragUploadDialog

### 常规使用

```html
<BaseDragUpload v-model:uploadDialogShow="uploadDialogShow" @on-save="handleUploadSave" />
```

### 属性

| 参数             | 说明         | 类型    | 可选值     | 默认值 |
| :--------------- | :----------- | :------ | :--------- | :----- |
| uploadDialogShow | 弹窗是否可见 | Boolean | true/false | -      |

### 插槽

| name | 说明 |
| :--- | :--- |

### 事件

| 方法名  | 说明       | 参数 |
| :------ | :--------- | :--- |
| on-save | 保存后回调 |      |
