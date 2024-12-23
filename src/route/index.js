import VueRouter from "vue-router";

import ClassHome from "../components/class.vue";
import ClassSelect from "../components/class-select.vue";
import Wage from "../components/wage.vue";
import DailyClass from "../components/daily-class.vue";
import LessonRecord from "../components/lesson-record.vue";
import ClassIntro from "../components/class-intro.vue";
import WorkArrangement from "../components/work-arrangement.vue";
import WorkArrangementCurrent from "../components/work-arrangement-current.vue";
import CrmEmbed from "../components/crm-embed.vue";
import Ielts from "../components/ielts.vue";
import ClassTest from "../components/class-test.vue";
import Chart from "../components/chart.vue";
import IeltsAssignment from "../components/ielts-assignment.vue";

const routes = [
  { path: "/", component: ClassHome },
  { path: "/class-select", component: ClassSelect },

  { path: "/wage", component: Wage },
  { path: "/daily-class", component: DailyClass },
  { path: "/lesson-record", component: LessonRecord },
  { path: "/class-intro", component: ClassIntro },
  { path: "/work-arrangement", component: WorkArrangement },
  { path: "/work-arrangement-current", component: WorkArrangementCurrent },
  { path: "/crm", component: CrmEmbed },
  { path: "/ielts", component: Ielts },
  { path: "/class-test", component: ClassTest },
  { path: "/chart", component: Chart },
  { path: "/ielts-assignment", component: IeltsAssignment },
];

const router = new VueRouter({
  routes,
});

export default router;
