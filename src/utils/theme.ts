// 切换主题明暗模式 body设置class样式
export function handleThemeMode(theme: string) {
  if (theme == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// 处理主题样式
export function handleThemeStyle(theme: string | null) {
  document.documentElement.style.setProperty("--el-color-primary", theme);
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(theme, i / 10)}`);
  }
  for (let i = 1; i <= 9; i++) {
    document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkColor(theme, i / 10)}`);
  }
}

// hex颜色转rgb颜色
export function hexToRgb(str: string) {
  str = str.replace("#", "");
  let hexs = str.match(/../g) as any[];
  for (let i = 0; i < 3; i++) {
    hexs[i] = parseInt(hexs[i], 16);
  }
  return hexs;
}

// rgb颜色转Hex颜色
export function rgbToHex(r: string, g: string, b: string): string {
  const hex = [parseInt(r, 10).toString(16), parseInt(g, 10).toString(16), parseInt(b, 10).toString(16)];

  return `#${hex.map(x => x.padStart(2, "0")).join("")}`;
}

// 变浅颜色值
export function getLightColor(color: string | null, level: number) {
  let rgb = hexToRgb(String(color)) as any[];
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i]);
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

// 变深颜色值
export function getDarkColor(color: string | null, level: number) {
  let rgb = hexToRgb(String(color)) as any[];
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor(rgb[i] * (1 - level));
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}
