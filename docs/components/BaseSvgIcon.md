# BaseSvgIcon

### 常规使用

```html
<svg-icon name="def" f="#787849" w="60px" h="70px"> </svg-icon>
```

### 属性

| 参数 | 说明      | 类型   | 可选值 | 默认值 |
| :--- | :-------- | :----- | :----- | :----- |
| name | svg文件名 | string | -      | -      |
| f    | 填充颜色  | string | -      | -      |
| w    | svg宽度   | string | -      | ’18px‘ |
| h    | svg高度   | string | -      | ’18px‘ |

### 插槽

无

### 事件

无

### 外层scss修改fill

```css
:deep(.svg-def path) {
  fill: forestgreen !important;
}
```
