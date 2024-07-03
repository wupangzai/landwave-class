import VueRouter from "vue-router";

import ClassHome from "../components/class.vue";
import Wage from "../components/wage.vue";

const routes = [
  { path: "/", component: ClassHome },
  { path: "/wage", component: Wage },
];

const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
});

export default router;
