<template>
  <div id="wage">
    <div class="data-source">
      <el-input
        placeholder="MetaBase Input(a month)"
        v-model="metaBaseInput"
      ></el-input>
      <el-input
        style="margin-top: 30px"
        placeholder="CA"
        v-model="CAName"
      ></el-input>
      <el-input
        style="margin-top: 30px"
        placeholder="职级"
        v-model="level"
      ></el-input>
      <el-button @click="clickFn" style="margin-top: 40px">handler</el-button>
    </div>
    <div class="class-member">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>自己的班课成员</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >Disabled</el-button
          >
        </div>
        <div
          v-for="(value, key) in classMember[CAName]"
          class="text item"
          :key="key"
        >
          <el-tag>{{ key }}</el-tag>
          <div
            v-for="stu in value"
            :key="stu"
            style="margin: 8px; color: #666; font-size: 12px"
          >
            {{ stu }}
          </div>
        </div>
      </el-card>
    </div>
    <div class="member-list">456</div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
export default {
  name: "Wage",
  data() {
    return {
      metaBaseInput: "",
      classMember: {
        吴彬: {
          YSQ1TGRG24225: [
            "赵雨斌",
            "周骏杰",
            "李广新",
            "侯以凡",
            "姚逸菲",
            "许雪儿",
          ],
          YSQ2QHRG24201U: [
            "屈恺婷",
            "彭梓坚",
            "孙佩琪",
            "虞博轩",
            "强宇豪",
            "韩浩天",
          ],
        },
      },
      CAName: "吴彬",
      level: "P1",
      LevelMap: {
        P1: 3,
        P2: 4,
        P3: 5,
      },
      validDataList: [],
    };
  },
  methods: {
    clickFn() {
      const dataAfterParase = JSON.parse(this.metaBaseInput);
      this.validDataList = dataAfterParase.map((item) => {
        return {
          CAName: item["助教"],
          stuOrClass: item["学生/班级"],
          date: moment(item["start"], "YYYY-MM-DD").format("YYYY-MM-DD"),
          duringHour: moment
            .duration(moment(item.end).diff(moment(item.start)))
            .asHours(),
        };
      });

      this.exportToExcel();
    },

    handleListToExcel() {
      const list = [];

      this.validDataList
        .filter((item) => item.CAName === this.CAName)
        .map((item) => {
          const value = {
            CAname: this.CAName,
            classDate: item.date,
            level: this.level,
            hourPrice: this.LevelMap[this.level],
            duringHour: item.duringHour,
          };

          const isClass = Object.keys(this.classMember[this.CAName]).includes(
            item.stuOrClass
          );
          if (isClass) {
            this.classMember[this.CAName][item.stuOrClass].forEach((member) => {
              list.push({
                ...value,
                stuType: "班级学员",
                stuName: member,
                classNo: item.stuOrClass,
                pricePay: 0.5 * item.duringHour * this.LevelMap[this.level],
              });
            });
          } else {
            list.push({
              ...value,
              stuType: "VIP学员",
              stuName: item.stuOrClass,
              classNo: "",
              pricePay: 1 * item.duringHour * this.LevelMap[this.level],
            });
          }
        });
      return list;
    },

    exportToExcel() {
      const dataSource = this.handleListToExcel();

      // 假设你有一个表格数据的数组
      const data = [
        [
          "助教姓名",
          "带教日期",
          "学员类别",
          "学生姓名",
          "班级编号",
          "职级",
          "每小时服务奖金",
          "授课课时",
          "服务课消",
        ],
      ];
      dataSource.forEach((item) => {
        data.push([
          item.CAname,
          item.classDate,
          item.stuType,
          item.stuName,
          item.classNo,
          item.level,
          item.hourPrice,
          item.duringHour,
          item.pricePay,
        ]);
      });

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

      //   keys.forEach((key, index) => {
      //     if (/^G/.test(key) && key !== "G1") {
      //       if (worksheet[key].v !== "半海人广")
      //         worksheet[key].s.fill = {
      //           fgColor: { rgb: "F56C6C" },
      //         };
      //     }
      //   });

      //   keys.forEach((key, index) => {
      //     if (/^H/.test(key) && key !== "H1") {
      //       if (worksheet[key].v)
      //         worksheet[key].s.fill = {
      //           fgColor: { rgb: "E6A23C" },
      //         };
      //     }
      //   });

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
  },
};
</script>

<style lang="less">
#wage {
  width: 100%;
  display: flex;

  .class-member {
    margin-left: 50px;
    flex: 1;
  }

  .member-list {
    margin-left: 50px;
    flex: 1;
  }

  .class-member {
    height: 100%;
  }
}
</style>
