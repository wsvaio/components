import { dest, parallel, series, src } from "gulp";
import less from "gulp-less";
import autoprefixer from "gulp-autoprefixer";
import { componentPath, delPath, pkgPath, run } from "./utils";

// 删除easyest

export function removeDist() {
  return delPath(`${pkgPath}/components/dist`);
}

// 打包样式
export function buildStyle() {
  return src(`${componentPath}/src/**/style/**.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(dest(`${pkgPath}/components/dist/lib/src`))
    .pipe(dest(`${pkgPath}/components/dist/es/src`));
}

// 打包组件
export function buildComponent() {
  return run("pnpm run build", componentPath);
}
export default series(
  async () => removeDist(),
  async () => {
    await buildComponent();
    buildStyle();
  },
);
