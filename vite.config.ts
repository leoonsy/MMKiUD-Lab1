import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    base: process.env.VITE_APP_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      vueI18n({
        include: path.resolve(__dirname, './src/i18n/**'),
        defaultSFCLang: 'yaml',
      }),
    ],
  });
};
