// const notEmpty = require('@/utils/common.js')

module.exports = {
  description: "创建主页index",
  prompts: [
    {
      type: "input",
      name: "fileName",
      message: "请输入view名称,勿与之前重复,然后点击回车"
      // validate: notEmpty('fileName'),
    }
  ],
  actions: data => {
    const fileName = "{{fileName}}";
    const actions = [
      {
        type: "add",
        path: `src/views/${fileName}/index.vue`,
        templateFile: "src/assets/template/index.hbs",
        data: {
          fileName: fileName
        }
      }
    ];

    return actions;
  }
};
