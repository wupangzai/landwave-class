<template>
  <div id="work-arrangement">
    <!-- <el-input v-model="weekdayArrange" placeholder="请输入内容"></el-input> -->
    <!-- <el-button @click="clickFn"> clickFn </el-button> -->
    <el-card class="box-card" v-for="(day, index) in weekdayList" :key="index">
      <div slot="header" class="clearfix">
        <span>{{ weekMap[index] }}</span>
        <el-button
          style="float: right; padding: 3px 0; color: red"
          type="text"
          >{{ day }}</el-button
        >
      </div>
      <div
        v-for="option in options"
        :key="option.value"
        class="text item"
        style="margin-bottom: 15px"
      >
        <el-tag :type="getCAColor(option.value)">
          {{ option.value }}
          共{{ handleCAToClass(index, option.value).length }}节课程</el-tag
        >
        <div
          v-for="(lesson, i) in handleCAToClass(index, option.value)"
          :key="i"
          style="font-size: 12px"
        >
          <div>
            {{ lesson.lessonTime
            }}<span style="color: #409eff"> {{ lesson.stuOrClass }} </span>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div>请输入自己的中文名字（输入一次即可）</div>
      <br />
      <el-input v-model="dialogCA"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "work-arrangement",
  data() {
    return {
      dialogVisible: false,

      metaBaseInput: "",
      weekdayArrange: "",
      options: [
        {
          value: "董洁",
          label: "董洁",
        },
        {
          value: "王南飞",
          label: "王南飞",
        },
        {
          value: "吴彬",
          label: "吴彬",
        },
        {
          value: "王淑贤",
          label: "王淑贤",
        },
        {
          value: "刘维倩",
          label: "刘维倩",
        },
      ],
      weekdayList: [],
      renderList: [], // 二维数组 [[]]
      weekMap: {
        0: "周一",
        1: "周二",
        2: "周三",
        3: "周四",
        4: "周五",
        5: "周六",
        6: "周日",
      },
    };
  },
  methods: {
    getNextWeekday() {
      let currentWeekDay = moment().format("dddd"); // 获取当前是周几

      let obj = {};

      let nextMonday = "";
      let nextSunday = "";

      if (currentWeekDay === "Sunday") {
        nextMonday = moment().add(1, "day").format("YYYY-MM-DD");
        nextSunday = moment().add(7, "day").format("YYYY-MM-DD");
      } else {
        nextMonday = moment().day(1).add(1, "weeks").format("YYYY-MM-DD");
        nextSunday = moment().day(7).add(1, "weeks").format("YYYY-MM-DD");
      }

      obj.date = `${moment(nextMonday).format("YYYY-MM-DD")}~${moment(
        nextSunday
      ).format("YYYY-MM-DD")}`;

      this.weekdayArrange = obj.date;
      console.log(this.weekdayArrange);
      // console.log(moment(last_monday).add(1, "day").format("YYYY-MM-DD"));
      const n = moment(nextSunday).diff(moment(nextMonday), "days") + 1;
      let temp = moment(nextMonday).subtract(1, "days").format("YYYY-M-D");
      Array.from({ length: n }, (_, i) => i + 1).forEach((item) => {
        this.weekdayList.push(moment(temp).add(1, "day").format("YYYY-M-D"));
        temp = moment(temp).add(1, "day").format("YYYY-M-D");
      });
    },
    async getData() {
      const res = await axios.get("/myclass/json", {
        params: {
          parameters: JSON.stringify([
            {
              type: "category",
              value: ["半海人广"],
              id: "e7ab001d-adfb-44aa-7cd3-96ee5f8d0dc2",
              target: ["variable", ["template-tag", "dept"]],
            },
            {
              type: "date/all-options",
              value: this.weekdayArrange,
              id: "953e6c0e-7467-721c-8065-fa3451526c25",
              target: ["dimension", ["template-tag", "date"]],
            },
            {
              type: "category",
              value: null,
              id: "627547e3-e078-8cd7-1c44-0038eba685e3",
              target: ["variable", ["template-tag", "stuName"]],
            },
          ]),
        },
      });
      this.metaBaseInput = JSON.stringify(res.data);
      //   console.log(res.data);
    },
    handleData() {
      const dataAfterParase = JSON.parse(this.metaBaseInput); // 解析json 数据
      const dataAfterTranslate = dataAfterParase.map((item) => {
        return {
          time: moment(item.start).format("YYYY-M-D"),
          subject: item["课程"],
          stuOrClass: item["学生/班级"],
          teacher: item["教师"],
          CAName: item["助教"],
          lessonTime: `${item.start.slice(-5)}-${item.end.slice(-5)}`,
        };
      }); // 映射时间，等信息
      //   console.log("dataAfterTranslate", dataAfterTranslate);
      this.weekdayList.forEach((day, index) => {
        // console.log(day);
        this.$set(
          this.renderList,
          index,
          dataAfterTranslate.filter((item) => {
            return item.time === day;
          })
        );
        // this.renderList[index] = dataAfterTranslate.filter((item) => {
        //   return item.time === day;
        // });
      });
      //   console.log("renderlist", this.renderList);
    },
    sortByPropertyOrder(arr, property) {
      const groups = arr?.reduce((acc, obj) => {
        const key = obj[property];
        acc[key] = acc[key] || [];
        acc[key].push(obj);
        return acc;
      }, {});

      return groups
        ? Object.keys(groups).reduce((acc, key) => {
            return acc.concat(groups[key]);
          }, [])
        : [];
    },
    handleCAToClass(index, CAName) {
      const transferListByName = this.sortByPropertyOrder(
        this.renderList[index],
        "stuOrClass"
      );
      const sortListByCAName = transferListByName.filter((item) => {
        return item["CAName"] === CAName;
      }); // 将学生放到一起
      return sortListByCAName;
    },
    async clickFn() {
      this.getNextWeekday();
      await this.getData();
      this.handleData();
    },
    getCAColor(ca) {
      return ca === localStorage.getItem("CAForArrangement")
        ? "success"
        : "info";
    },
    dialogClose() {
      localStorage.setItem("CAForArrangement", this.dialogCA);
      this.dialogVisible = false;
    },
  },
  async mounted() {
    this.clickFn();
  },
  created() {
    if (!localStorage.getItem("CAForArrangement")) {
      this.dialogVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
#work-arrangement {
  width: 100%;
  //   padding: 5px;

  /* height: 100vh; */
  height: 95vh;
  overflow-y: scroll;

  margin-left: -10px;
  display: flex;
  .box-card {
    width: 180px;
    height: max-content;
  }
}
</style>
