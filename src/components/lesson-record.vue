<template>
  <div id="less-record">
    <div>
      <el-input
        placeholder="MetaBase Data"
        v-model="metaBaseInput"
        class="data-input"
      ></el-input>
      <div style="margin-top: 20px; width: 280px">
        <el-select
          v-model="CAName"
          placeholder="请选择"
          style="width: 280px"
          @change="changeCA"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button
        @click="clickFn"
        style="margin-top: 20px; width: 120px"
        type="primary"
        >查询</el-button
      >
    </div>

    <div class="student-list">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>昨日课程反馈记录</span>
          <el-button style="float: right; padding: 3px 0" type="text">{{
            yesterday
          }}</el-button>
        </div>
        <div
          v-for="(record, index) in renderList[yesterday]"
          :key="index"
          class="text item"
          style="margin-top: 20px"
        >
          <el-checkbox v-model="record.isSend" @change="changeCheckBox">
            <el-tag
              >{{ record.time }}
              <span style="margin-left: 10px">
                {{ record.stuOrClass }}
              </span>
              <span style="margin-left: 10px">
                {{ record.subject }}
              </span></el-tag
            >
          </el-checkbox>
        </div>
      </el-card>
    </div>

    <div class="student-list">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>今日课程反馈记录</span>
          <el-button style="float: right; padding: 3px 0" type="text">{{
            today
          }}</el-button>
        </div>
        <div
          v-for="(record, index) in renderList[today]"
          :key="index"
          class="text item"
          style="margin-top: 20px"
        >
          <el-checkbox v-model="record.isSend" @change="changeCheckBox">
            <el-tag type="warning"
              >{{ record.time }}
              <span style="margin-left: 10px">
                {{ record.stuOrClass }}
              </span>
              <span style="margin-left: 10px">
                {{ record.subject }}
              </span></el-tag
            >
          </el-checkbox>
        </div>
      </el-card>
    </div>
    <!-- <el-button @click="login">Login</el-button>
    <el-button @click="test">Test</el-button> -->
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import moment from "moment";
export default {
  name: "LessRecord",
  data() {
    return {
      token_type: "Bearer",
      access_token: "",
      CAName: "吴彬",
      metaBaseInput: "",
      today: "",
      yesterday: "",
      options: [
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
        {
          value: "董洁",
          label: "董洁",
        },
        {
          value: "王南飞",
          label: "王南飞",
        },
      ],
      lessonRecordList: [],
      lessonNextRecordList: [],
      metaBaseTodayInput: "",
      renderList: {},
    };
  },
  methods: {
    login() {
      const loginInfo = {
        org_id: 5,
        username: "13226212172",
        password: "wb524920.",
      };
      axios({
        method: "post",
        url: "/crm/pub/login",
        data: loginInfo,
      }).then((res) => {
        this.access_token = res.data.access_token;
        localStorage.setItem("access_token", this.access_token);
        console.log(this.access_token);
      });
    },
    test() {
      axios({
        method: "get",
        url: "/crm/course-schedulings",
        data: {
          queryValue: "施涵奕",
          page: 1,
          per_page: 15,
        },
        headers: {
          Authorization: `Bearer ${this.access_token}`,
        },
      }).then((res) => {
        console.log("test", res);
      });
    },
    sortByPropertyOrder(arr, property) {
      const groups = arr.reduce((acc, obj) => {
        const key = obj[property];
        acc[key] = acc[key] || [];
        acc[key].push(obj);
        return acc;
      }, {});

      return Object.keys(groups).reduce((acc, key) => {
        return acc.concat(groups[key]);
      }, []);
    },
    clickFn() {
      const dataAfterParase = JSON.parse(this.metaBaseInput);
      const dataAfterParaseT = JSON.parse(this.metaBaseTodayInput);

      const listAfterFilterByCA = dataAfterParase.filter((item) => {
        return item["助教"] === this.CAName;
      });
      const listAfterFilterByCAT = dataAfterParaseT.filter((item) => {
        return item["助教"] === this.CAName;
      });

      const dataAfterSorted = this.sortByPropertyOrder(
        listAfterFilterByCA,
        "学生/班级"
      );
      const dataAfterSortedT = this.sortByPropertyOrder(
        listAfterFilterByCAT,
        "学生/班级"
      );

      this.today = moment().format("YYYY-MM-DD");
      this.yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

      const transferY = dataAfterSorted.map((item) => {
        return {
          time: `${item.start.slice(-5)}-${item.end.slice(-5)}`,
          subject: item["课程"],
          stuOrClass: item["学生/班级"],
          teacher: item["教师"],
          isSend: item["isSend"] ? true : false,
        };
      });

      const transferT = dataAfterSortedT.map((item) => {
        return {
          time: `${item.start.slice(-5)}-${item.end.slice(-5)}`,
          subject: item["课程"],
          stuOrClass: item["学生/班级"],
          teacher: item["教师"],
          isSend: item["isSend"] ? true : false,
        };
      });

      if (!localStorage.getItem(`${this.CAName}lesson-course`)) {
        this.renderList = {
          [this.yesterday]: transferY,
          [this.today]: transferT,
        };
        localStorage.setItem(
          `${this.CAName}lesson-course`,
          JSON.stringify(this.renderList)
        );
      } else {
        const localData = JSON.parse(
          localStorage.getItem(`${this.CAName}lesson-course`)
        );
        this.renderList = {
          [this.yesterday]: localData[this.yesterday] ?? transferY,
          [this.today]: localData[this.today] ?? transferT,
        };
        localStorage.setItem(
          `${this.CAName}lesson-course`,
          JSON.stringify(this.renderList)
        );
        console.log("this.renderList", this.renderList);
      }
    },
    async getRecord() {
      const responseY = await axios.get(
        "/class/json?parameters=%5B%7B%22type%22%3A%22category%22%2C%22value%22%3A%5B%22%E5%8D%8A%E6%B5%B7%E4%BA%BA%E5%B9%BF%22%5D%2C%22id%22%3A%22e7ab001d-adfb-44aa-7cd3-96ee5f8d0dc2%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22dept%22%5D%5D%7D%2C%7B%22type%22%3A%22date%2Fall-options%22%2C%22value%22%3A%22past1days%22%2C%22id%22%3A%22953e6c0e-7467-721c-8065-fa3451526c25%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22date%22%5D%5D%7D%2C%7B%22type%22%3A%22category%22%2C%22value%22%3Anull%2C%22id%22%3A%22627547e3-e078-8cd7-1c44-0038eba685e3%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22stuName%22%5D%5D%7D%5D&format_rows=true"
      );

      const responseT = await axios.get(
        "/class/json?parameters=%5B%7B%22type%22%3A%22category%22%2C%22value%22%3A%5B%22%E5%8D%8A%E6%B5%B7%E4%BA%BA%E5%B9%BF%22%5D%2C%22id%22%3A%22e7ab001d-adfb-44aa-7cd3-96ee5f8d0dc2%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22dept%22%5D%5D%7D%2C%7B%22type%22%3A%22date%2Fall-options%22%2C%22value%22%3A%22thisday%22%2C%22id%22%3A%22953e6c0e-7467-721c-8065-fa3451526c25%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22date%22%5D%5D%7D%2C%7B%22type%22%3A%22category%22%2C%22value%22%3Anull%2C%22id%22%3A%22627547e3-e078-8cd7-1c44-0038eba685e3%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22stuName%22%5D%5D%7D%5D&format_rows=true"
      );

      this.metaBaseInput = JSON.stringify(responseY.data);
      this.metaBaseTodayInput = JSON.stringify(responseT.data);

      this.$message.success("自动获取昨日、今日课表成功~");
      this.clickFn();
    },
    changeCheckBox() {
      localStorage.setItem(
        `${this.CAName}lesson-course`,
        JSON.stringify(this.renderList)
      );
    },
    changeCA() {
      this.getRecord();
    },
  },

  async created() {
    await this.getRecord();
  },
};
</script>

<style lang="less" scoped>
#less-record {
  display: flex;
  padding: 10px;

  .data-input {
    display: block;
    width: 280px;
  }
  .student-list {
    margin-left: 50px;

    .box-card {
      height: 70vh;
      overflow: auto;
    }
  }
}
</style>
