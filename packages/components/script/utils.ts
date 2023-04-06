import fs from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

// 组件库根目录
export const componentPath = resolve(__dirname, "../");

// pkg根目录
export const pkgPath = resolve(__dirname, "../../");

// 保留的文件
// const stayFile = ["package.json", "README.md"];

export async function delPath(path: string) {
  let files: string[] = [];

  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);

    files.forEach(async (file) => {
      const curPath = resolve(path, file);

      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        if (file != "node_modules") await delPath(curPath);
      }
      else {
        // delete file
        // if (!stayFile.includes(file))
        fs.unlinkSync(curPath);
      }
    });

    if (path != `${pkgPath}/components/dist`) fs.rmdirSync(path);
  }
}

export async function run(command: string, path: string) {
  // cmd表示命令，args代表参数，如 rm -rf  rm就是命令，-rf就为参数
  const [cmd, ...args] = command.split(" ");
  return new Promise((resolve) => {
    const app = spawn(cmd, args, {
      cwd: path, // 执行命令的路径
      stdio: "inherit", // 输出共享给父进程
      shell: true, // mac不需要开启，windows下git base需要开启支持
    });
    // 执行完毕关闭并resolve
    app.on("close", resolve);
  });
}
