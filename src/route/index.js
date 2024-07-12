import VueRouter from "vue-router";

import ClassHome from "../components/class.vue";
import Wage from "../components/wage.vue";
import DailyClass from "../components/daily-class.vue";
import LessonRecord from "../components/lesson-record.vue";

const routes = [
  { path: "/", component: ClassHome },
  { path: "/wage", component: Wage },
  { path: "/daily-class", component: DailyClass },
  { path: "/lesson-record", component: LessonRecord },
];

const router = new VueRouter({
  routes,
});

export default router;
