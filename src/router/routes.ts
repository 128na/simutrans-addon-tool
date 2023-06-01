import { RouteRecordRaw } from 'vue-router';
import AboutPage from '../pages/AboutPage.vue';
import ImageMergerPage from '../pages/ImageMergerPage.vue';
import PakPage from '../pages/PakPage.vue';
import AutoPakPage from '../pages/AutoPakPage.vue';
import ListPakPage from '../pages/ListPakPage.vue';
import ListDatPage from '../pages/ListDatPage.vue';
import LinksPage from '../pages/LinksPage.vue';
import ResizeobjPage from '../pages/ResizeobjPage.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import MainLayout from '../layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/', redirect: { name: 'about' } },
      { name: 'about', path: '/about', component: AboutPage },
      { name: 'imageMerger', path: '/image', component: ImageMergerPage },
      { name: 'pak', path: '/pak', component: PakPage },
      { name: 'autoPak', path: '/autoPak', component: AutoPakPage },
      { name: 'listPak', path: '/listPak', component: ListPakPage },
      { name: 'listDat', path: '/listDat', component: ListDatPage },
      { name: 'resizeobj', path: '/resizeobj', component: ResizeobjPage },
      { name: 'settings', path: '/links', component: SettingsPage },
      { name: 'links', path: '/links', component: LinksPage },
    ],
  },
];
export default routes;
