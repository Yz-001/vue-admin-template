import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import * as parserVue from "vue-eslint-parser";
import configPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineFlatConfig } from "eslint-define-config";
import * as parserTypeScript from "@typescript-eslint/parser";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

export default defineFlatConfig([
  // 基础 JavaScript 文件配置
  {
    // 扩展自 @eslint/js 推荐的基础规则集，确保代码符合最佳实践。
    ...js.configs.recommended,
    ignores: [
      "**/.*", // 忽略隐藏文件（例如 .gitignore, .env 等）
      "dist/*", // 忽略构建输出目录下的所有文件
      "*.d.ts", // 忽略 TypeScript 类型声明文件
      "public/*", // 忽略公共资源文件夹中的静态资源
      "src/assets/**", // 忽略源码中的资产文件夹
      "src/**/iconfont/**" // 忽略特定图标字体文件夹
    ],
    languageOptions: {
      globals: {
        // 定义全局变量为只读，防止意外修改这些变量。
        // 这些变量通常来自项目中使用的库或框架的全局对象。
        RefType: "readonly",
        EmitType: "readonly",
        TargetContext: "readonly",
        ComponentRef: "readonly",
        ElRef: "readonly",
        ForDataType: "readonly",
        AnyFunction: "readonly",
        PropType: "readonly",
        Writable: "readonly",
        Nullable: "readonly",
        NonNullable: "readonly",
        Recordable: "readonly",
        ReadonlyRecordable: "readonly",
        Indexable: "readonly",
        DeepPartial: "readonly",
        Without: "readonly",
        Exclusive: "readonly",
        TimeoutHandle: "readonly",
        IntervalHandle: "readonly",
        Effect: "readonly",
        ChangeEvent: "readonly",
        WheelEvent: "readonly",
        ImportMetaEnv: "readonly",
        Fn: "readonly",
        PromiseFn: "readonly",
        ComponentElRef: "readonly",
        parseInt: "readonly",
        parseFloat: "readonly"
      }
    },
    plugins: {
      prettier: pluginPrettier // 使用 Prettier 插件以确保代码格式的一致性。
    },
    rules: {
      // 合并 Prettier 的规则和推荐的 Prettier 规则，确保代码风格统一。
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,
      "no-debugger": "warn", // 将使用 debugger 语句视为警告，便于调试时使用，但提醒开发者在提交前移除。
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // 忽略以下划线开头的参数
          varsIgnorePattern: "^_" // 忽略以下划线开头的变量
        }
      ], // 禁止未使用的变量，提高代码质量。
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto" // 自动检测换行风格，保证跨平台兼容性。
        }
      ]
    }
  },

  // TypeScript 文件配置
  {
    files: ["**/*.?([cm])ts", "**/*.?([cm])tsx"], // 匹配所有 TypeScript 和 TSX 文件
    languageOptions: {
      parser: parserTypeScript, // 使用 TypeScript 解析器解析代码
      parserOptions: {
        sourceType: "module" // 设置源代码类型为模块，支持 ES6 模块化语法。
      }
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript // 使用 @typescript-eslint 插件来处理 TypeScript 特定的 ESLint 规则。
    },
    rules: {
      // 应用严格的 TypeScript 规则，确保代码遵循最佳实践。
      ...pluginTypeScript.configs.strict.rules,
      "@typescript-eslint/ban-types": "off", // 关闭禁止使用某些类型（如 Object, Function）的规则，根据项目需求调整。
      "@typescript-eslint/no-redeclare": "error", // 禁止重复声明同一名称的变量、函数等，避免命名冲突。
      "@typescript-eslint/ban-ts-comment": "off", // 允许使用 TypeScript 注释（如 // @ts-ignore），但应谨慎使用。
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型，但在可能的情况下应尽量避免。
      "@typescript-eslint/prefer-as-const": "warn", // 建议使用 as const 来定义不可变的值。
      "@typescript-eslint/no-empty-function": "off", // 不报错空函数，适用于某些场景如事件处理器。
      "@typescript-eslint/no-non-null-assertion": "off", // 不报错非空断言，但应该仔细考虑其必要性。
      "@typescript-eslint/no-import-type-side-effects": "error", // 禁止导入仅用于类型的模块，以避免不必要的副作用。
      "@typescript-eslint/explicit-module-boundary-types": "off", // 不强制显式定义模块边界的返回类型。
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false, // 允许类型注解
          fixStyle: "inline-type-imports" // 内联类型导入的修复风格
        }
      ],
      "@typescript-eslint/prefer-literal-enum-member": [
        "error",
        {
          allowBitwiseExpressions: true // 允许枚举成员使用位运算表达式
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ] // 对于 TypeScript 文件，也禁止未使用的变量，忽略以下划线开头的参数和变量。
    }
  },

  // .d.ts 类型声明文件配置
  {
    files: ["**/*.d.ts"],
    rules: {
      "eslint-comments/no-unlimited-disable": "off", // 允许在 .d.ts 文件中无限制地禁用规则，适合类型声明文件的特殊情况。
      "import/no-duplicates": "off", // 关闭重复导入检查，因为类型声明文件可能会有重复的导入。
      "unused-imports/no-unused-vars": "off" // 关闭未使用变量检查，对于类型声明文件来说这是合理的。
    }
  },

  // JavaScript 文件配置
  {
    files: ["**/*.?([cm])js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off", // 允许使用 require 导入语句，尽管是在 JavaScript 文件中。
      "@typescript-eslint/no-var-requires": "off" // 不报错 var require 语法，适用于旧版 Node.js 或 CommonJS 模块。
    }
  },

  // Vue 单文件组件配置
  {
    files: ["**/*.vue"],
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
      vue: pluginVue // 使用 Vue 插件，以应用针对 Vue 的特殊规则。
    },
    processor: pluginVue.processors[".vue"], // 使用 Vue 处理器处理 .vue 文件，以便更好地解析和检查 Vue SFC。
    rules: {
      // 合并 Vue 插件提供的不同规则集，确保遵守 Vue 最佳实践。
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs["vue3-essential"].rules,
      ...pluginVue.configs["vue3-recommended"].rules,
      "no-undef": "off", // 关闭未定义变量检查，因为 Vue SFC 中可能包含预编译模板。
      "no-unused-vars": "off", // 关闭未使用变量检查，避免与 Vue 编译器冲突。
      "vue/no-v-html": "off", // 允许使用 v-html 指令，但要注意潜在的安全风险。
      "vue/require-default-prop": "off", // 不强制要求 prop 默认值，取决于项目需求。
      "vue/require-explicit-emits": "warn", // 警告未显式声明 emit 事件，鼓励良好的编码习惯。
      "vue/multi-word-component-names": "error", // 强制组件名称使用多个单词，遵循 Vue 的命名约定。
      "vue/no-setup-props-reactivity-loss": "error", // 错误：在 <script setup> 中 props 反应性丢失，确保 props 正确传递。
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
      ] // 强制 HTML 自闭合标签的使用规则，保持代码一致性。
    }
  }
]);
