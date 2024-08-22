<template>
  <div id="crm-embed">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>请登录</span><br />
      <el-input v-model="account" style="margin-top: 10px">
        <template slot="prepend">账号：</template>
      </el-input>
      <el-input v-model="password" style="margin-top: 10px" type="password">
        <template slot="prepend">密码：</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getToken">确 定</el-button>
      </span>
    </el-dialog>
    <div>
      <el-input v-model="className" style="margin: 10px 0px; width: 350px">
        <template slot="prepend">班级名称</template>
      </el-input>
    </div>
    <div>
      <el-upload class="upload-demo" drag action="" :on-error="fileChange">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <el-button @click="fetch">获取数据</el-button>
  </div>
</template>

<script>
import instance from "../api";
import moment from "moment";

const Excel = require("exceljs");

export default {
  name: "crm-embed",
  data() {
    return {
      dialogVisible: localStorage.getItem("token") ? false : true,
      account: "",
      password: "",
      token: "",
      className: "",
      courseId: "",
      courseDetail: {},
      teacherCourseMap: {},
    };
  },
  computed: {},
  methods: {
    async validateToken() {
      try {
        await instance.get(
          "/crm/notifications?user_id=1799&is_read=0&per_page=99&page=1"
        );
      } catch (e) {
        this.dialogVisible = true;
        console.log(e);
      }
    },
    async getToken() {
      const res = await instance.post("/crm/pub/login", {
        org_id: 5,
        username: this.account,
        password: this.password,
      });
      this.token = res.access_token;
      localStorage.setItem("token", this.token);
      console.log("token", this.token);
      this.dialogVisible = false;
    },
    async fileChange(e, file) {
      const stream = file.raw.stream();

      const workbook = new Excel.Workbook();

      // 读取文件
      const res = await workbook.xlsx.read(stream);
      // 获取第一个工作
      const worksheet = workbook.getWorksheet(1);

      const data = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (cell.address === "C4") {
            // 学生姓名
            cell.value = "";
          }

          if (cell.address === "E4") {
            // 课程名称
            cell.value = this.courseDetail.product_name;
          }
          if (cell.address === "E5") {
            // 上课时间
            cell.value = `${moment(this.courseDetail.start).format(
              "YYYY-MM-DD"
            )}-${moment(this.courseDetail.end).format("YYYY-MM-DD")}`;
          }
          if (cell.address === "J5") {
            // 学服姓名
            cell.value = this.courseDetail.class_adviser_name;
          }

          const cellList = [
            {
              teacher: "C7",
              course: "F7",
            },
            {
              teacher: "C14",
              course: "F14",
            },
            {
              teacher: "C21",
              course: "F21",
            },
            {
              teacher: "C28",
              course: "F28",
            },
            {
              teacher: "C35",
              course: "F35",
            },
            {},
          ];

          this.teacherCourseMap.forEach((item, index) => {
            if (cell.address === cellList[index].teacher) {
              cell.value = item.teacher;
            }
            if (cell.address === cellList[index].course) {
              cell.value = item.course;
            }
          });

          rowData[cell.value] = cell.value;
        });
        data.push(rowData);
      });
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "" });
        saveAs(blob, "test.xlsx");
      });
    },
    async fetch() {
      const res = await instance({
        method: "GET",
        url: "/crm/class-list",
        params: {
          queryValue: this.className,
          start_before: "",
          start_after: "",
          not_full: "",
          ["study_centers[]"]: 17,
          large_than_three: false,
          order: "start_asc",
          production_type: "class",
          sort: "-created_at",
          skip_ac: true,
          page: 1,
        },
      });
      // console.log("res", res);
      this.courseId = res.list[0].id;

      await this.getCourseDetail();
    },
    async getCourseDetail() {
      const res = await instance({
        method: "GET",
        url: `/crm/classes/${this.courseId}?id=${this.courseId}&includes[]=courseSchedulings&includes[]=classStudents&includes[]=classItems.product&includes[]=classItems.courseSchedulings`,
      });
      this.courseDetail = res;

      this.teacherCourseMap = this.courseDetail.class_items.map((item) => {
        return {
          teacher: item.course_schedulings[0].teacher_name,
          course: item.name,
        };
      });
      this.$message.success("数据获取完毕，请上传excel模板文件");
      /**
       * class_adviser_name // 班主任名字
       * product_name  // =班级编号
       * product_short_name // 班级中文名字
       *
       *
       */
    },
  },

  created() {
    this.validateToken();
  },
};
</script>

<style lang="less" scoped>
#crm-embed {
  width: 100%;
  /* height: 100vh; */
  overflow: auto;
  // display: flex;
}
</style>
