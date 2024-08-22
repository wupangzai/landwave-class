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
    <el-button @click="fetch">handler</el-button>
  </div>
</template>

<script>
import instance from "../api";

const Excel = require("exceljs");

export default {
  name: "crm-embed",
  data() {
    return {
      dialogVisible: false,
      account: "",
      password: "",
      token: "",
      className: "",
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
            cell.value = "TEST NAME";
          }

          if (cell.address === "E4") {
            // 课程名称
            cell.value = "TEST CLASS";
          }
          if (cell.address === "E5") {
            // 上课时间
            cell.value = "TEST TIME";
          }
          if (cell.address === "J5") {
            // 学服姓名
            cell.value = "TEST TIME";
          }
          rowData[cell.value] = cell.value;
          console.log(cell, cell.value);
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
        url: "/crm/class-list?queryValue=24310&start_before=&start_after=&not_full=false&study_centers[]=17&large_than_three=false&order=start_asc&production_type=class&sort=-created_at&skip_acl=true&page=1",
        // data: {
        //   queryValue: this.className,
        //   start_before: "",
        //   start_after: "",
        //   not_full: "",
        //   ["study_centers[]"]: 17,
        //   large_than_three: false,
        //   order: "start_asc",
        //   production_type: "class",
        //   sort: "-created_at",
        //   skip_ac: true,
        //   page: 1,
        // },
      });
      console.log("res", res);
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
