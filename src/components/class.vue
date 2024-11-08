<template>
  <div id="class-home">
    <div>
      <input id="message" v-model="classList" />
      <el-button type="success" @click="handler">下载课程表</el-button>
      <div>
        <el-tag type="danger" style="margin-top: 10px"
          >不用再去MetaBase下载课表了呢，亲</el-tag
        >

        <el-link type="danger" disabled class="info"
          >叠个甲先，仅供参考</el-link
        >
      </div>

      <!-- <div class="wage">
        <el-button type="primary" @click="toWagePage" disabled>
          绩效统计（disabled now）
        </el-button>
      </div> -->
      <!-- <div class="daily-class" style="margin-top: 30px">
        <el-button type="danger" @click="toDailyPage"> 日常课表 </el-button>
      </div> -->
      <!-- <div class="daily-class" style="margin-top: 30px">
        <el-button type="info" @click="toLessonRecordPage">
          课程反馈发送记录
        </el-button>
      </div>
      <h1>伟大的性格，无需多言</h1> -->
    </div>

    <el-card class="box-card" v-if="tipsVisible">
      <h3 v-if="count">
        总计有<el-tag>{{ count }}</el-tag
        >条课程
      </h3>
      <h3 v-if="studentNotInRenGuang > 0">
        其中
        <el-tag type="success">{{ count - studentNotInRenGuang }}</el-tag>
        条课程在本校区上课，<el-tag type="danger">
          {{ studentNotInRenGuang }}</el-tag
        >条课程不在半海人广,分别是
        <div
          class="not-in-place"
          v-for="(item, index) in studentNotInRenGuangNameList"
          :key="index"
        >
          <el-tag type="danger">{{
            `${item.time} - ${item.student} - ${item.subject}-${item.studentClassPlace}`
          }}</el-tag>
        </div>
      </h3>
      <h3 v-if="count > 0 && studentNotInRenGuang <= 0">
        所有学生都在半海人广校区上课<i
          class="el-icon-success"
          style="color: green"
        ></i>
      </h3>
      <h3>
        拥有两条课程以上的学生是：
        <el-tag
          class="not-in-place"
          v-for="(item, index) in moreThanTwoClassStudentList"
          :key="index"
          >{{ item[0].student }}</el-tag
        >
      </h3>
    </el-card>

    <el-card class="box-card2" v-if="tipsVisible">
      <el-tag type="danger" class="not-in-place"
        >仅！供！参！考！记！得！二！次！确！认！！！</el-tag
      >
      <el-tag type="info" class="not-in-place"
        >下载的课表根据排课网站的JSON文件，字段自己挖的，如果那边开发改了则失效哦~</el-tag
      >
      <el-tag type="info" class="not-in-place"
        >下载的excel修改为按照排课表的顺序，方便一次复制全部，并且把助教映射上去了</el-tag
      >
      <el-tag type="info" class="not-in-place"
        >统计了一下上课校区不在半海人广的学生，并给出名单</el-tag
      >
      <el-tag type="info" class="not-in-place"
        >如果学生在当天不止一节课，excel中则把他们排在一起，并给出了学生名单</el-tag
      >
    </el-card>
  </div>
</template>

<script>
// import * as XLSX from 'xlsx/xlsx.mjs'
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import _ from "lodash";
import axios from "axios";

export default {
  name: "App",
  components: {},
  data() {
    return {
      classList: "",
      personMap: [
        {
          name: "董洁",
          EName: "Jade",
        },
        {
          name: "王南飞",
          EName: "Winnie",
        },
        {
          name: "吴静",
          EName: "Wendy",
        },
        {
          name: "吴彬",
          EName: "Anan",
        },
        {
          name: "刘维倩",
          EName: "Quincy",
        },
        {
          name: "王淑贤",
          EName: "Yilia",
        },
        {
          name: "吴凡",
          EName: "吴凡",
        },
        {
          name: "许鹏",
          EName: "许鹏",
        },
        {
          name: "胡庭玥",
          EName: "Rebeca",
        },
      ],
      count: 0,
      studentNotInRenGuang: 0,
      studentNotInRenGuangNameList: [],
      tipsVisible: false,
      renderList: [],
      moreThanTwoList: [],
      jsonData: "",
    };
  },
  methods: {
    handleListToExcel(list) {
      return list.map((item, index) => {
        return {
          time: `${item.start.slice(-5)}-${item.end.slice(-5)}`,
          subject: item["课程"],
          teacher: item["教师"],
          student: item["学生/班级"],
          SA: this.personMap.find((person) => person.name === item["助教"])
            ? this.personMap.find((person) => person.name === item["助教"])
                .EName
            : "",
          todaySA: this.personMap.find((person) => person.name === item["助教"])
            ? this.personMap.find((person) => person.name === item["助教"])
                .EName
            : "",
          studentClassPlace: item["上课校区"],
          studentServePlace: item["学生服务校区"],
        };
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
    test(list) {
      const listAfterSwitchKey = list.map((item, index) => {
        return {
          time: `${item.start.slice(-5)}-${item.end.slice(-5)}`,
          subject: item["课程"],
          teacher: item["教师"],
          student: item["学生/班级"],
          SA: this.personMap.find((person) => person.name === item["助教"])
            ? this.personMap.find((person) => person.name === item["助教"])
                .EName
            : "",
          todaySA: this.personMap.find((person) => person.name === item["助教"])
            ? this.personMap.find((person) => person.name === item["助教"])
                .EName
            : "",
          studentClassPlace: item["上课校区"],
        };
      });
    },
    handler() {
      if (!this.classList) {
        this.$message.error("请输入课程-Json流格式");
        return;
      }
      this.tipsVisible = true;
      this.exportToExcel();
    },
    groupedByProperty(array) {
      return array.reduce((acc, obj) => {
        const key = obj.student;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    },
    exportToExcel() {
      const listAfterParse = JSON.parse(this.classList);
      const listAfterTranslate = this.handleListToExcel(listAfterParse);

      listAfterTranslate.forEach((item, index) => {
        if (item.studentClassPlace !== "半海人广") {
          this.studentNotInRenGuang++;
          this.studentNotInRenGuangNameList.push(item);
        }
      });

      const sortedClassList = this.sortByPropertyOrder(
        listAfterTranslate,
        "student"
      );

      this.renderList = Object.values(this.groupedByProperty(sortedClassList));

      // 假设你有一个表格数据的数组
      const data = [
        [
          "上课时间",
          "科目",
          "老师",
          "学生",
          "主带SA",
          "今日SA",
          "上课校区",
          "补充说明",
        ],
      ];

      sortedClassList.forEach((item, index) => {
        const ps = item.SA ? "" : "非本校区学生--" + item.studentServePlace;
        data.push([
          item.time,
          item.subject,
          item.teacher,
          item.student,
          item.SA,
          item.todaySA,
          item.studentClassPlace,
          ps,
        ]);
      });
      this.count = data.length - 1;

      // 将数据转换为工作表
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      worksheet["!cols"] = [
        { wch: 20 }, // 第一列宽50个字符宽度单位
        { wch: 30 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第三列宽100个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 30 }, // 第二列宽75个字符宽度单位
      ];

      const keys = Object.keys(worksheet);
      keys.pop(); // 去除特殊值
      keys.pop();
      keys.forEach((key, index) => {
        if (worksheet[key]) {
          worksheet[key].s = {}; // 预设 s
        }
      });

      const headers = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"]; // 设置表头颜色
      headers.forEach((header) => {
        worksheet[header].s.fill = {
          fgColor: { rgb: "C6E0B4" },
        };
      });

      // 设置单元格样式
      keys.forEach((key, index) => {
        if (worksheet[key]) {
          worksheet[key].s.font = {
            name: "宋体",
            sz: 12,
          };
        }
      });

      keys.forEach((key, index) => {
        if (/^G/.test(key) && key !== "G1") {
          if (worksheet[key].v !== "半海人广")
            worksheet[key].s.fill = {
              fgColor: { rgb: "F56C6C" },
            };
        }
      });

      keys.forEach((key, index) => {
        if (/^H/.test(key) && key !== "H1") {
          if (worksheet[key].v)
            worksheet[key].s.fill = {
              fgColor: { rgb: "E6A23C" },
            };
        }
      });

      console.log(worksheet);

      // 创建工作簿并添加工作表
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // 生成Excel文件
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 使用blob和FileReader创建一个Blob URL
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      const blobUrl = window.URL.createObjectURL(dataBlob);

      // 使用filesaver.js保存文件
      saveAs(dataBlob, "Excel-课表转换.xlsx");

      // 清理
      window.URL.revokeObjectURL(blobUrl);

      this.$message.success("下载中...请等待文件下载完成");
    },
    toWagePage() {
      this.$router.push("./wage");
    },
    toDailyPage() {
      this.$router.push("./daily-class");
    },
    toLessonRecordPage() {
      this.$router.push("./lesson-record");
    },
  },
  async created() {
    axios
      .get(
        "/myclass/json?parameters=%5B%7B%22type%22%3A%22category%22%2C%22value%22%3A%5B%22%E5%8D%8A%E6%B5%B7%E4%BA%BA%E5%B9%BF%22%5D%2C%22id%22%3A%22e7ab001d-adfb-44aa-7cd3-96ee5f8d0dc2%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22dept%22%5D%5D%7D%2C%7B%22type%22%3A%22date%2Fall-options%22%2C%22value%22%3A%22next1days%22%2C%22id%22%3A%22953e6c0e-7467-721c-8065-fa3451526c25%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22date%22%5D%5D%7D%2C%7B%22type%22%3A%22category%22%2C%22value%22%3Anull%2C%22id%22%3A%22627547e3-e078-8cd7-1c44-0038eba685e3%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22stuName%22%5D%5D%7D%5D&format_rows=true"
      )
      .then((response) => {
        this.classList = JSON.stringify(response.data);
        this.$message.success("自动获取明日课表成功~");
      })
      .catch((error) => {
        console.error(error);
      });
  },
  computed: {
    moreThanTwoClassStudentList() {
      return this.renderList.filter((item) => {
        return item.length > 1;
      });
    },
  },
};
</script>

<style>
#class-home {
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  display: flex;
  padding: 10px;
}
#message {
  display: block;
  width: 400px;
  height: 200px;
  margin-bottom: 10px;
}
.not-in-place {
  margin: 5px;
}
.box-card {
  width: 480px;
  margin-left: 25px;
}
.box-card2 {
  width: 480px;
  margin-left: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  font-size: 12px;
  margin-left: 10px;
}
.wage {
  margin-top: 35px;
}
</style>
