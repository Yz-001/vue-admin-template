import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import * as parserVue from "vue-eslint-parser";
import { defineFlatConfig } from "eslint-define-config";
import * as parserTypeScript from "@typescript-eslint/parser";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import pluginPrettier from "eslint-plugin-prettier"; // 引入 Prettier 插件以确保代码格式的一致性

// 定义公共规则，用于减少冗余并保持一致性。
const commonRules = {
  "prettier/prettier": "error", // 使用 Prettier 的规则来保证代码风格一致。
  ...pluginPrettier.configs.recommended.rules // 使用推荐的 Prettier 规则集。
};

export default defineFlatConfig([
  // JavaScript 文件配置
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"], // 匹配所有 JavaScript 文件（包括 CommonJS 和 ES Modules）
    languageOptions: {
      parser: js.parser, // 使用 @eslint/js 提供的解析器来解析 JavaScript 代码。
      parserOptions: {
        sourceType: "module" // 设置源代码类型为模块，支持 ES6 模块化语法。
      }
    },
    ignores: [
      "**/.*", // 忽略隐藏文件（例如 .gitignore, .env 等）
      "dist/*", // 忽略构建输出目录下的所有文件
      "*.d.ts", // 忽略 TypeScript 类型声明文件
      "public/*", // 忽略公共资源文件夹中的静态资源
      "src/assets/**", // 忽略源码中的资产文件夹
      "src/**/iconfont/**" // 忽略特定图标字体文件夹
    ],
    plugins: {
      prettier: pluginPrettier // 使用 Prettier 插件以确保代码格式的一致性。
    },
    rules: {
      ...commonRules // 应用公共规则以保持一致性。
    }
  },

  // TypeScript 文件配置
  {
    files: ["**/*.ts", "**/*.cts", "**/*.mts", "**/*.tsx"], // 匹配所有 TypeScript 和 TSX 文件（包括 CommonJS 和 ES Modules）
    languageOptions: {
      parser: parserTypeScript, // 使用 @typescript-eslint 解析器来解析 TypeScript 代码。
      parserOptions: {
        sourceType: "module" // 设置源代码类型为模块，支持 ES6 模块化语法。
      }
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript, // 使用 @typescript-eslint 插件来处理 TypeScript 特定的 ESLint 规则。
      prettier: pluginPrettier // 确保在这里也定义 Prettier 插件以应用代码格式规则。
    },
    rules: {
      // 应用严格的 TypeScript 规则，确保代码遵循最佳实践。
      ...pluginTypeScript.configs.strict.rules,
      "@typescript-eslint/ban-types": "off", // 关闭禁止使用某些类型（如 Object, Function）的规则，根据项目需求调整。
      "@typescript-eslint/no-redeclare": "error", // 禁止重复声明同一名称的变量、函数等，避免命名冲突。
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略以单个下划线开头的函数参数
          varsIgnorePattern: "^_", // 忽略以单个下划线开头的变量
          destructuredArrayIgnorePattern: "^_" // 如果需要，也可以忽略解构数组中的下划线变量
        }
      ],
      "@typescript-eslint/ban-ts-comment": "off", // 允许使用 TypeScript 注释（如 // @ts-ignore），但应谨慎使用。
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型，但在可能的情况下应尽量避免。
      "@typescript-eslint/prefer-as-const": "warn", // 建议使用 as const 来定义不可变的值。
      "@typescript-eslint/no-import-type-side-effects": "error", // 禁止导入仅用于类型的模块，以避免不必要的副作用。
      "@typescript-eslint/explicit-module-boundary-types": "off", // 不强制显式定义模块边界的返回类型。
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false, // 允许类型注解
          fixStyle: "inline-type-imports" // 内联类型导入的修复风格
        }
      ],
      ...commonRules // 应用公共规则以保持一致性。
    }
  },

  // Vue 单文件组件配置
  {
    files: ["**/*.vue"], // 匹配所有 Vue 单文件组件
    languageOptions: {
      globals: {
        $: "readonly", // Vue 实例上的 $refs 和其他全局 API
        $ref: "readonly", // 可能是指向 ref() 的快捷方式
        $shallowRef: "readonly", // 浅层响应式的 ref
        $toRef: "readonly" // 组合式 API 中的 toRef 函数
      },
      parser: parserVue, // 使用 vue-eslint-parser 解析 Vue SFC (单文件组件)
      parserOptions: {
        ecmaFeatures: {
          jsx: true // 支持 JSX 语法，这在 Vue 3 中是有效的，特别是在 <script setup> 中。
        },
        extraFileExtensions: [".vue"], // 指定额外的文件扩展名，使 ESLint 能够正确解析 .vue 文件。
        parser: "@typescript-eslint/parser", // 在 Vue 文件中使用 TypeScript 解析器，以支持 TypeScript 语法。
        sourceType: "module" // 设置源代码类型为模块，支持 ES6 模块化语法。
      }
    },
    plugins: {
      vue: pluginVue, // 使用 Vue 插件，以应用针对 Vue 的特殊规则。
      prettier: pluginPrettier // 确保在这里定义 Prettier 插件以应用代码格式规则。
    },
    processor: pluginVue.processors[".vue"], // 使用 Vue 处理器处理 .vue 文件，以便更好地解析和检查 Vue SFC。
    rules: {
      // 合并 Vue 插件提供的不同规则集，确保遵守 Vue 最佳实践。
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs["vue3-essential"].rules,
      ...pluginVue.configs["vue3-recommended"].rules,
      "vue/no-v-html": "off", // 允许使用 v-html 指令，但要注意潜在的安全风险。
      "vue/require-explicit-emits": "warn", // 警告未显式声明 emit 事件，鼓励良好的编码习惯。
      "vue/no-setup-props-reactivity-loss": "off", // 错误：在 <script setup> 中 props 反应性丢失，确保 props 正确传递。
      "vue/multi-word-component-names": "off", // 关闭多词组件名称规则，可以根据项目需要调整。
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always", // 空标签总是自闭合
            normal: "always", // 普通标签总是自闭合
            component: "always" // 自定义组件总是自闭合
          },
          svg: "always", // SVG 标签总是自闭合
          math: "always" // MathML 标签总是自闭合
        }
      ], // 强制 HTML 自闭合标签的使用规则，保持代码一致性。
      ...commonRules // 应用公共规则以保持一致性。
    }
  }
]);
