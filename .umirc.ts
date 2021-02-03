import { defineConfig } from 'umi';

export default defineConfig({
  locale: {
    default: 'zh-CN',
    antd: false,
    title: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/home', exact: true, title: 'site.title' },
    {
      path: '/', component: '@/layout/layout-1', routes: [
        { path: '/market', component: '@/pages/market', title: 'market.title', },
        { path: '/profile', component: '@/pages/profile', title: 'profile.title', },
      ]
    },

  ],
  esbuild: {},
});
