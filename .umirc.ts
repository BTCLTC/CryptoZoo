import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/home', exact: true },
    {
      path: '/', component: '@/layout/layout-1', routes: [
        { path: '/market', component: '@/pages/market' },
        { path: '/profile', component: '@/pages/profile' },
      ]
    },

  ],
  esbuild: {},
});
