import VueRouter from "vue-router";

import ClassHome from "../components/class.vue";
import Wage from "../components/wage.vue";
import DailyClass from '../components/daily-class.vue'

const routes = [
  { path: "/", component: ClassHome },
  { path: "/wage", component: Wage },
  { path: "/daily-class", component: DailyClass },
];

const router = new VueRouter({
  routes, 
});

export default router;
