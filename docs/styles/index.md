# 样式布局

## 常用颜色

### 主题色

```
var(--el-color-primary)
```

:::warning INFO
主题色可在"系统默认配置"中动态配置
:::

### 背景色

```
background-color: var(--el-bg-color-page);
```

```
background-color: var(--el-bg-color-overlay);
```

:::tip
当前子页面建议使用page-container
:::

## 响应式布局

| 窗口视图   | 范围                       |
| :--------- | :------------------------- |
| 移动端(sm) | width <=768px，width > 760 |
| 平板(md)   | width <=990                |
| 桌面(lg)   | width > 990                |

:::warning INFO
使用`<el-row><el-col :sm="24" :md="12" :lg="8"></el-col></el-row>`布局(数值请自定义)，结合系统模式实现响应式
:::

后期待补充...
