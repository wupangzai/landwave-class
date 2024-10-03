<template>
  <div id="crm-embed">
    <el-dialog title="登录CRM系统" :visible.sync="dialogVisible" width="30%">
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
    <el-tabs type="border-card" class="border-card-mine">
      <el-tab-pane label="模板下载">
        <div class="download-area">
          <div class="info-form">
            <div>
              <el-tag> 👇生成学员信息表 </el-tag>
              <el-tag type="info">
                <a href="/学员信息表-template.xlsx" download
                  >点击下载学员信息表模板文件</a
                >
              </el-tag>
            </div>
            <div>
              <el-upload
                class="upload-demo"
                drag
                action=""
                :on-error="fileChangeInfo"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
            </div>
            <div v-for="info in tagList" :key="info" style="margin: 10px 0px">
              <el-tag type="warning"> {{ info }} </el-tag>
            </div>

            <el-input
              v-model="className"
              style="margin: 10px 0px; width: 350px"
            >
              <template slot="prepend">班级名称</template>
            </el-input>
            <div>
              <el-button @click="fetch" type="danger">偷取班级数据</el-button>
            </div>
          </div>
          <div class="sign-form">
            <div>
              <el-tag> 👇生成签到表 </el-tag>
              <el-tag type="info">
                <a href="/学生签到表-template.xlsx" download
                  >点击下载学员签到表模板文件</a
                >
              </el-tag>
            </div>
            <div>
              <el-upload
                class="upload-demo"
                drag
                action=""
                :on-error="fileChangeSign"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
            </div>
          </div>
          <div class="teacher-feedback">
            <div class="">
              <div>
                <el-tag>👇生成教师反馈表</el-tag>
                <el-tag type="info">
                  <a href="/学员打分表-template.xlsx" download
                    >点击下载学员打分表模板文件</a
                  >
                </el-tag>
              </div>
            </div>
            <div>
              <el-upload
                class="upload-demo"
                drag
                action=""
                :on-error="fileChange"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
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
      tagList: [
        "① 先登录",
        "② 输入班级编号，最好具体一点，只输入后面几位会有别的校区重复的",
        "③ 点击偷取班级数据，开偷,弹出提示框就是偷到了",
        "④ 上传对应模板到指定位置即可",
      ],
    };
  },
  computed: {},
  methods: {
    async validateToken() {
      try {
        const res = await instance.get(
          "/crm/notifications?user_id=1799&is_read=0&per_page=99&page=1"
        );
        if (res?.response?.status === 401) {
          this.$message.error("身份验证过期，请重新登录");

          this.dialogVisible = true;
        }
      } catch (e) {
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
      if (this.token) {
        this.$message.success("登录成功");
      } else {
        this.$$message.error("登录错误，maybe是密码错误");
      }
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
        saveAs(blob, `${this.courseDetail.product_name}教师反馈表.xlsx`);
      });
    },
    async fileChangeSign(e, file) {
      const stream = file.raw.stream();

      const workbook = new Excel.Workbook();

      // 读取文件
      const res = await workbook.xlsx.read(stream);
      // 获取第一个工作
      const worksheet = workbook.getWorksheet(1);
      console.log("worksheet", workbook);
      const memberList = this.courseDetail.valid_student_names.split(",");
      const dayList = this.courseDetail.course_schedulings.map((item) => {
        return moment(item.start).format("YYYY-MM-DD");
      });
      console.log("memberList", memberList);
      console.log("dayList", [...new Set(dayList.sort())]);

      const excelSpace = [
        "B4",
        "E4",
        "H4",
        "B16",
        "E16",
        "H16",
        "B28",
        "E28",
        "H28",
        "B41",
        "E41",
        "H41",
        "B54",
        "E54",
        "H54",
        "B65",
        "E65",
        "H65",
      ];

      const data = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (cell.address === "D1") {
            cell.value = `${this.courseDetail.product_short_name}-${this.courseDetail.product_name}`;
          }
          if (cell.address === "A3") {
            cell.value = this.courseDetail.product_name;
          }
          if (cell.address === "B3") {
            cell.value = this.courseDetail.class_adviser_name;
          }
          if (cell.address === "D3") {
            cell.value = memberList.length;
          }

          // 处理日期
          [...new Set(dayList.sort())].forEach((item, index) => {
            if (cell.address === excelSpace[index]) {
              cell.value = item;
            }
          });

          // 处理学生名字
          const excelNameSpace = [
            ["A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"],
            [
              "A18",
              "A19",
              "A20",
              "A21",
              "A22",
              "A23",
              "A24",
              "A25",
              "A26",
              "A27",
            ],
            [
              "A30",
              "A31",
              "A32",
              "A33",
              "A34",
              "A35",
              "A36",
              "A37",
              "A38",
              "A39",
            ],
            [
              "A43",
              "A44",
              "A45",
              "A46",
              "A47",
              "A48",
              "A49",
              "A50",
              "A51",
              "A52",
            ],
            ["A56", "A57", "A58", "A59", "A60", "A61", "A62", "A63", "A64"],
            ["A67", "A68", "A69", "A70", "A71", "A72", "A73", "A74", "A75"],
          ];
          excelNameSpace.forEach((item, index) => {
            memberList.forEach((member, no) => {
              if (cell.address === excelNameSpace[index][no]) {
                cell.value = member;
              }
            });
          });
        });
        data.push(rowData);
      });
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "" });
        saveAs(blob, `${this.courseDetail.product_name}签到表.xlsx`);
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
      console.log("res", res);
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
    async fileChangeInfo(e, file) {
      const stream = file.raw.stream();

      const workbook = new Excel.Workbook();

      // 读取文件
      const res = await workbook.xlsx.read(stream);
      // 获取第一个工作
      const worksheet = workbook.getWorksheet("学生信息表");

      const refundStudentList = this.courseDetail.refund_student_names
        ? this.courseDetail.refund_student_names.split(",")
        : [];

      const vaildMemberList = this.courseDetail.students
        .map((stu) => {
          const isRefunded = refundStudentList.find(
            (name) => name === stu.student.name
          );
          if (!isRefunded) {
            return {
              name: stu.student.name,
              consultant: stu.student.present_owner_name,
              classNo: this.courseDetail.product_name,
              CA: this.courseDetail.class_adviser_name,
              title: `${moment(this.courseDetail.start).format("Y")}${
                this.courseDetail.product_short_name
              }-${this.courseDetail.product_name}`,
            };
          }
        })
        .filter((item) => item);

      const excelSpace = [
        ["B3", "D3", "E3", "G3"],
        ["B4", "D4", "E4", "G4"],
        ["B5", "D5", "E5", "G5"],
        ["B6", "D6", "E6", "G6"],
        ["B7", "D7", "E7", "G7"],
        ["B8", "D8", "E8", "G8"],
        ["B9", "D9", "E9", "G9"],
        ["B10", "D10", "E10", "G10"],
        ["B11", "D11", "E11", "G11"],
        ["B12", "D12", "E12", "G12"],
      ];
      const data = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (cell.address === "C1") {
            cell.value = `${moment(this.courseDetail.start).format("M-D")}${
              this.courseDetail.product_short_name
            }.${this.courseDetail.product_name}`;
          }

          vaildMemberList.forEach((member, index) => {
            if (cell.address === excelSpace[index][0]) {
              cell.value = member.name;
            }
            if (cell.address === excelSpace[index][1]) {
              cell.value = member.CA;
            }
            if (cell.address === excelSpace[index][2]) {
              cell.value = member.consultant;
            }
            if (cell.address === excelSpace[index][3]) {
              cell.value = member.classNo;
            }
          });
        });
        data.push(rowData);
      });
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "" });
        saveAs(blob, `${this.courseDetail.product_name}学员信息表.xlsx`);
      });
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
  display: flex;
  padding: 5px;
  .border-card-mine {
    width: 100%;
  }
  .download-area {
    width: 100%;

    // overflow: auto;
    display: flex;
  }

  .teacher-feedback {
    flex: 1;
  }
  .sign-form {
    flex: 1;
  }
  .info-form {
    flex: 1;
  }
}
</style>
