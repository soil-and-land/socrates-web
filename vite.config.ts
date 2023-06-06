import path from "path";
import {defineConfig} from 'vite'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'


const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
const defaultConfig = {
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ]
    }),
  ],
};

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const isDev = mode === 'development';
    console.log(`Development Mode: ${isDev}`);
    let apiLocal = 'http://127.0.0.1:3000';
    let apiProd = 'https://api.socrates-soil.net'

    return {
      ...defaultConfig,
      server: {
        proxy: {
          "/run": {
            target: isDev ? apiLocal : apiProd,
            changeOrigin: true,
            secure: false,
          },
        },
      }
    }
  } else {
    return defaultConfig
  }
})
