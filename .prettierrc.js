// @ts-check

/** @type {import("prettier").Config} */
export default {
  printWidth:120,       // 行长度
  tabWidth: 2,          // 使用2个空格作为缩进。
  bracketSpacing: true, // 在对象字面量和数组的括号内保留空格
  singleQuote: false,   // 此设置控制字符串使用单引号还是双引号 true双引号 false单引号
  arrowParens: "avoid", // 控制箭头函数参数是否总是用圆括号包裹 avoid 如果传参只有一个 就自动去括号为x=>{}
  trailingComma: "none",// 决定了在多行数组、对象字面量或函数参数列表的末尾是否添加逗号。当设置为 "none" 时，不会在最后一个元素后添加额外的逗号
  endOfLine: "auto",    // 行尾符号
  vueIndentScriptAndStyle: false, // 是否格式化 .vue 文件中的 <script> 和 <style> 标签
};
