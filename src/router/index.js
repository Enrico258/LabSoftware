import { createRouter, createWebHistory } from 'vue-router';
import TelaBusca from '@/telaBusca.vue';
import TelaResultados from '@/telaResultados.vue';

const routes = [
  {
    path: '/',
    name: 'TelaBusca',
    component: TelaBusca
  },
  {
    path: '/telaResultados',
    name: 'TelaResultados',
    component: TelaResultados
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
