import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import vue from "@vitejs/plugin-vue";
import css from "rollup-plugin-css-only";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const overrides = {
  compilerOptions: { declaration: true },
};

export default defineConfig([
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.cjs",
        format: "cjs",
      },
      {
        file: "./dist/index.mjs",
        format: "esm",
      },
    ],
    plugins: [
      nodeResolve(),
      vue({
        reactivityTransform: true,
      }),
      typescript({ tsconfigOverride: overrides, check: false }),
      css({ output: "index.css" }),
    ],
    external: ["vue", "element-plus", "vue-request", "@wsvaio/utils", "vant"],
  },
]);
