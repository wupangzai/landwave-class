import VueRouter from "vue-router";

import ClassHome from "../components/class.vue";
import Wage from "../components/wage.vue";
import DailyClass from "../components/daily-class.vue";
import LessonRecord from "../components/lesson-record.vue";
import ClassIntro from "../components/class-intro.vue";
import WorkArrangement from "../components/work-arrangement.vue";
import WorkArrangementCurrent from "../components/work-arrangement-current.vue";

const routes = [
  { path: "/", component: ClassHome },
  { path: "/wage", component: Wage },
  { path: "/daily-class", component: DailyClass },
  { path: "/lesson-record", component: LessonRecord },
  { path: "/class-intro", component: ClassIntro },
  { path: "/work-arrangement", component: WorkArrangement },
  { path: "/work-arrangement-current", component: WorkArrangementCurrent },
];

const router = new VueRouter({
  routes,
});

export default router;
