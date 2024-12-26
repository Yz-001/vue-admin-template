// @ts-nocheck

/** @type {import("@commitlint/types").UserConfig} */
export default {
  ignores: [commit => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat", //新增功能
        "fix", //修复缺陷
        "perf", //性能优化
        "style", //样式调整
        "docs", //文档更新
        "test", //测试相关
        "refactor", //代码重构
        "build", //构建系统或依赖变更
        "ci", //持续集成/部署相关
        "chore", //维护性任务
        "revert", //回退操作
        "wip", //草稿提交
        "workflow", //工作流程改进
        "types", //类型定义
        "release" //发布相关
      ]
    ]
  }
};
