import { type UserConfig, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import * as path from "node:path";
import { visualizer } from "rollup-plugin-visualizer"; // 打包分析
import viteCompression from "vite-plugin-compression"; // 压缩代码
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import AutoImport from "unplugin-auto-import/vite";
import viteSvgLoader from "vite-svg-loader";
import type { PluginInfo, XastElement } from "svgo/lib/types";

// import vueJsx from '@vitejs/plugin-vue-jsx';
// https://vitejs.dev/config/
// command, mode, ssrBuild
export default ({ mode }) => {
  console.log(`当前环境${mode}`);
  const env = loadEnv(mode, process.cwd());
  const config = {
    define: {
      "process.env": process.env, //解决process is not defined问题
      extensions: [".js", ".ts", "scss", ".tsx", ".jsx"]
    },

    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "@/styles/variables.scss";` // 配置全局 scss
        }
      }
    },
    plugins: [
      vue(),
      Unocss({
        /* options */
      }),
      viteCompression(),
      AutoImport({
        imports: ["vue", "vue-router"],
        dts: "src/auto-import.d.ts",
        eslintrc: {
          enabled: false, // Default `false`
          filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      VueI18nPlugin({
        jitCompilation: false,
        include: [path.resolve(__dirname, "src/locales/**")]
      }),
      viteSvgLoader({
        svgoConfig: {
          plugins: [
            "sortAttrs",
            {
              name: "prefixIds",
              params: {
                prefix: (node: XastElement, info: PluginInfo): string => {
                  return `icon-${path.basename(info.path, ".svg")}`;
                }
              }
            }
          ]
        }
      })
      // vueJsx({
      //   transformOn: true,
      //   mergeProps: true,
      // }),
    ],
    base: "./", // 开发或生产环境服务的公共基础路径 ,https://vitejs.bootcss.com/guide/build.html#public-base-path ,
    build: {
      outDir: "dist", // 打包后的文件名称,
      assetsDir: "static",
      reportCompressedSize: false, // 取消计算文件大小，加快打包速度
      sourcemap: false,
      assetsInlineLimit: 32000, // 设置320kb以内的打包为base64 以上的为动态   102400
      terserOptions: {
        // 生产环境下移除console
        compress: {
          drop_console: true,
          drop_debugger: true
        }
        // output:{
        //   chunkFileNames:'static/js/[name]-[hash].js',
        //   entryFileNames:"static/js/[name]-[hash].js",
        //   assetFileNames:"static/[ext]/name-[hash].[ext]",
        // }
      }
    },
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
    //       vue: ['vue', 'vue-router'],
    //       naive: ['naive-ui'],
    //       element: ['element-plus'],
    //       unocss:['unocss'],
    //       pinia:['pinia']
    //       // echarts: ['echarts'],
    //     },
    //   },
    // },
    resolve: {
      alias: {
        // 别名路径
        "/imgs": path.resolve(__dirname, "src/assets/img"), //动态vite导入图片  结合u
        "@": path.resolve(__dirname, "src"),
        "@apis": path.resolve(__dirname, "src/apis"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/components"),
        "@stores": path.resolve(__dirname, "src/stores"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@views": path.resolve(__dirname, "src/views"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@types": path.resolve(__dirname, "src/types")
      }
    },
    server: {
      https: false, // 是否开启https
      open: true, // 是否自动打开浏览器
      port: 3000, // 端口号
      host: true, // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      proxy: {
        "/api": {
          target: env.VITE_APP_API_URL, // 终端接口,
          changeOrigin: true,
          secure: false, // 如果是 https 接口需要配置这个参数
          rewrite: path => path.replace(/^\/api/, "") // 路径重写
        }
      }
    }
  };

  if (mode == "analyzer") {
    config.plugins.push(
      visualizer({
        open: true,
        brotliSize: true,
        filename: "./dist/analyzer.html"
      })
    );
  }

  return defineConfig(config as unknown as UserConfig);
};
