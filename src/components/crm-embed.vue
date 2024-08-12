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
    <input type="file" @change="fileChange" />上传
  </div>
</template>

<script>
import instance from "../api";
import XLSX from "xlsx-js-style";

export default {
  name: "crm-embed",
  data() {
    return {
      dialogVisible: false,
      account: "",
      password: "",
      token: "",
    };
  },
  computed: {},
  methods: {
    async validateToken() {},
    async getToken() {
      const res = await instance.post("/crm/pub/login", {
        org_id: 5,
        username: this.account,
        password: this.password,
      });
      this.token = res.access_token;
      localStorage.setItem("token", this.token);
      console.log("token", this.token);
    },
    fileChange(event) {
      console.log(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        if (this.rABS) {
          this.wb = XLSX.read(btoa(fixdata(data)), {
            type: "base64",
          });
        } else {
          this.wb = XLSX.read(data, {
            type: "binary",
          });
        }
        const excelJson = XLSX.utils.sheet_to_json(
          this.wb.Sheets[this.wb.SheetNames[0]]
        );
        console.log(excelJson);
        // this.getTableData(excelJson);
        XLSX.writeFile(this.wb, "output.xlsx");
      };
      if (this.rABS) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsBinaryString(file);
      }
    },
    fixdata(data) {
      let o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
  },

  created() {},
};
</script>

<style lang="less" scoped>
#crm-embed {
  width: 100%;
  /* height: 100vh; */
  overflow: auto;
  display: flex;
}
</style>
