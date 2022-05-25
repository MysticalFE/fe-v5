import { defineConfig } from 'vite';
import { dependencies } from './package.json';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { md } from './plugins/md';
const reactSvgPlugin = require('vite-plugin-react-svg');
import { visualizer } from 'rollup-plugin-visualizer';

const chunk2 = [
  '@codemirror/autocomplete',
  '@codemirror/highlight',
  '@codemirror/lint',
  '@codemirror/language',
  '@codemirror/state',
  '@d3-charts/ts-graph',
  '@y0c/react-datepicker',
  'better-babel-generator',
  '@codemirror/view',
  'codemirror-promql',
  '@codemirror/basic-setup',
];
const chunk3 = ['react-ace'];
const chunk1 = ['react', 'react-router-dom', 'react-dom', 'moment', '@ant-design/icons', 'umi-request', 'lodash', 'react-grid-layout', 'd3', 'ahooks', 'color'];
const antdChunk = ['antd'];

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (chunk1.includes(key) || chunk2.includes(key) || chunk3.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

const serverIp = 'http://192.168.103.33:19000/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    md(),
    reactRefresh(),
    reactSvgPlugin({ defaultExport: 'component' }),
    // visualizer()
  ],
  define: {},
  resolve: {
    alias: [
      {
        find: '@/store/eventWallInterface',
        replacement: '/src/Packages/EventWall/interface',
      },
      {
        find: '@/services/outfire',
        replacement: '/src/Packages/Outfire/services/outfire',
      },
      {
        find: '@/pages/outfire',
        replacement: '/src/Packages/Outfire/pages',
      },
      {
        find: '@',
        replacement: '/src',
      },
    ],
    // extensions:['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    proxy: {
      // 字符串简写写法
      // '/foo': 'http://localhost:4567/foo',
      // 选项写法
      // '/api': {
      //   target: 'http://10.86.76.13:8085',
      //   changeOrigin: true,
      // },
      '/api/n9e': {
        target: serverIp,
        // target: 'http://10.206.0.16:18000/',
        changeOrigin: true,
      },
      '/filters': {
        target: serverIp,
        changeOrigin: true,
      },
      '/integrations': {
        target: serverIp,
        changeOrigin: true,
      },
      '/alerts': {
        target: serverIp,
        changeOrigin: true,
      },
      '/changes': {
        target: serverIp,
        changeOrigin: true,
      },
      '/dimension/api/v1': {
        target: 'http://10.166.53.215:8089',
        changeOrigin: true,
      },
      '/v1/api/fireplate': {
        target: 'http://172.20.70.60:8010',
        changeOrigin: true,
      },
      // 正则表达式写法
      // '^/fallback/.*': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/fallback/, '')
      // }
    },
  },
  build: {
    target: 'chrome58',
    outDir: 'pub',
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: chunk1,
          vendor1: chunk2,
          vendor2: chunk3,
          antdChunk: antdChunk,
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "/src/global.variable.less";`,
        javascriptEnabled: true,
        modifyVars: {
          'font-size-base': '12px',
          'color-base': '#333',
          'form-item-margin-bottom': '18px',
          'font-family': 'verdana, Microsoft YaHei, Consolas, Deja Vu Sans Mono, Bitstream Vera Sans Mono',
          'text-color': '#333',
          'menu-dark-bg': '#2C3D5E',
          'menu-dark-inline-submenu-bg': '#2C3D5E',
        },
      },
    },
  },
});
