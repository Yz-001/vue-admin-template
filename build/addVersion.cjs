//npm run build打包前执行此段代码
// eslint-disable-next-line no-undef
let fs = require("fs");

//返回package的json数据
function getPackageJson() {
  let data = fs.readFileSync("./package.json"); //fs读取文件
  return JSON.parse(data); //转换为json对象
}

let packageData = getPackageJson(); //获取package的json
let arr = packageData.version.split("."); //切割后的版本号数组
arr[2] = parseInt(arr[2]) + 1;
packageData.version = arr.join("."); //转换为以"."分割的字符串
//用packageData覆盖package.json内容 自动更新最后一位编号
fs.writeFile("./package.json", JSON.stringify(packageData, null, "\t"), (err) => {
  if (err) {
    console.log("更新package version失败", err);
  } else {
    console.log("更新package version成功");
  }
});
// 创建version.json
fs.writeFile(
  "./dist/version.json",
  JSON.stringify({ name: packageData.name, version: packageData.version, engines: packageData.engines }, null, "\t"),
  (err) => {
    if (err) {
      console.log("创建version.json失败", err);
    } else {
      console.log("创建version.json成功");
    }
  }
);
