import { RouteRecordRaw } from 'vue-router';
import IndexPage from '../pages/IndexPage.vue';
import PakPage from '../pages/PakPage.vue';
import AutoPakPage from '../pages/AutoPakPage.vue';
import LinksPage from '../pages/LinksPage.vue';

const routes: RouteRecordRaw[] = [
  { name: 'top', path: '/', component: IndexPage },
  { name: 'pak', path: '/pak', component: PakPage },
  { name: 'autoPak', path: '/autoPak', component: AutoPakPage },
  { name: 'links', path: '/links', component: LinksPage },
];

export default routes;
