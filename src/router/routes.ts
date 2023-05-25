import { RouteRecordRaw } from 'vue-router';
import AboutPage from '../pages/AboutPage.vue';
import PakPage from '../pages/PakPage.vue';
import AutoPakPage from '../pages/AutoPakPage.vue';
import ListPakPage from '../pages/ListPakPage.vue';
import LinksPage from '../pages/LinksPage.vue';
import MainLayout from '../layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/', redirect: { name: 'about' } },
      { name: 'about', path: '/about', component: AboutPage },
      { name: 'pak', path: '/pak', component: PakPage },
      { name: 'autoPak', path: '/autoPak', component: AutoPakPage },
      { name: 'listPak', path: '/listPak', component: ListPakPage },
      { name: 'links', path: '/links', component: LinksPage },
    ],
  },
];
export default routes;
