<template>
  <div id="wage">
    <div class="data-source">
      <el-input
        placeholder="MetaBase Input(a month) 自己去下载一个月的！！！！"
        v-model="metaBaseInput"
        type="textarea"
        class="wage-input"
      ></el-input>

      <el-select
        v-model="CAName"
        placeholder="请选择CA"
        style="margin-top: 30px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- <el-input
        style="margin-top: 30px"
        placeholder="CA"
        v-model="CAName"
        class="wage-input"
      ></el-input> -->
      <div>
        <el-select
          v-model="level"
          placeholder="请选择职级"
          style="margin-top: 30px"
        >
          <el-option
            v-for="item in ['P1', 'P2', 'P3']"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <!-- <el-input
        style="margin-top: 30px"
        placeholder="职级"
        v-model="level"
        class="wage-input"
      ></el-input> -->
      <el-button @click="clickFn" style="margin-top: 40px" type="primary"
        >获取窝囊费</el-button
      >
    </div>
    <div class="class-member">
      <el-card class="box-card box-card-container">
        <div slot="header" class="clearfix">
          <span>自己的班课学生</span>
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
    <div class="member-list">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>奴役慰劳费</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >Disabled</el-button
          >
        </div>
        <div>
          <div>
            VIP辅练总时长： <el-tag>{{ VIPTotalHours }}</el-tag>
          </div>
          <div>
            VIP课消统计：
            <el-tag class="des-tag" type="danger">{{
              1 * VIPTotalHours * LevelMap[level]
            }}</el-tag>
          </div>

          <div style="margin-top: 20px">
            班课辅练总时长： <el-tag>{{ classTotalHours }}</el-tag>
          </div>
          <div>
            班级课消统计：
            <el-tag class="des-tag" type="danger">{{
              0.5 * classTotalHours * LevelMap[level]
            }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>
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
        {
          value: "胡庭玥",
          label: "胡庭玥",
        },
      ],
      classMember: {
        吴彬: {
          YSQ2JCRG24310: ["殷家家", "王子权", "张展诰", "李旭"],
          YSQ3TGRG24321: [
            "张展诰",
            "何子杰",
            "李旭",
            "崔馨迪",
            "高天成",
            "汤立轩",
          ],
          YSQ3QHRG24342: ["高天成	", "丁一帆", "吴悠"],
          YSQ3TGRG24285: ["朱珺婷", "孙梓涵", "殷家家", "宋新晴", "许一诺"],
          YSQ3TGRG24378: ["赵逸明", "姜越宸", "陈佳语", "郝伟如", "杜艾宸"],
        },
        刘维倩: {
          YSQ3JCRG24322: [
            "朱唯萱",
            "李俊豪",
            "赵晴雨",
            "赵玥铭",
            "赵玥萱",
            "刘子宁",
          ],
          YSQ3TGRG24309: ["孙子络", "方思晨"],
          YSQ3QHRG24294: [
            "王卓",
            "张睿宇",
            "陈睿灏",
            "戴志臣",
            "sunny yang",
            "陶禹辰",
          ],
          YSQ3JCRG24382: ["程梓豪", "孙明泽", "储慧恩", "顾宸翰"],
        },
        董洁: {
          YSQ2JCRG24152: [
            "李滨桉",
            "方明恺",
            "陆奕鳞",
            "张涵",
            "韩译瑶",
            "彭炜宸",
            "钟赡予",
            "蔡烨然",
          ],
          YSQ2TGRG24169U: [
            "范诗琦",
            "郑子杰",
            "田保鑫",
            "江伊婷",
            "殷樱",
            "张涵骏",
            "张卜豪",
            "陈歆赟",
            "赵依黎",
          ],
          YSQ3YBRG2304: [
            "周士钦",
            "莫鑫楠",
            "陈思源",
            "范思晟",
            "杨伊涵",
            "毛欣霆",
            "宋慧仪",
            "战嘉",
            "余润泽",
            "李嘉乐",
          ],
          YSQ1TGRG24125U: ["陈铭馨", "郑翔文", "沈嘉伟", "杨妍婷", "顾昊霖"],
          YSQ2QHRG24231U: [
            "江伊婷",
            "包天琦",
            "张卜豪",
            "陈欣赟",
            "俞心洁",
            "周骏杰",
            "陈哲宇",
            "郑煜",
            "许雪儿",
          ],
          YSQ1YBRG24215: ["鲍凯琛", "郑伊辰", "钱欣妍", "徐秦瑜涵", "徐安娜"],
          YSQ2JCRG24160: [
            "吴熠凡",
            "戴子涵",
            "茅欣远",
            "丁小峰",
            "叶昕媛",
            "朱啸宇",
          ],
        },
        王南飞: {
          YSQ3CCRG24298: [
            "李嘉倩",
            "陈洪晔",
            "潘岳",
            "雍可欣",
            "曹琳雯",
            "徐心怡",
            "梅宇轩",
          ],
          YSQ3QHRG24288: ["朱瑾", "杨王雨涵", "吴悠然", "宋欣洋", "徐楷汶"],
          YSQ3TGRG24278: [
            "刘景风",
            "夏露",
            "袁欣荣",
            "李佑君",
            "杨致懿",
            "胡家毓",
          ],
          YSQ3JCRG24271: [
            "庄子墨",
            "李璐",
            "郭珈言",
            "李昀霖",
            "吴戟",
            "杭沪宁·",
            "Sigrid",
          ],
        },
        胡庭玥: {
          YSQ3JCRG24361: [
            "鲍凯琛",
            "高圣研",
            "刘佳梦",
            "沈思若",
            "陈佳语",
            "潘籽城",
          ],
          YSQ3FCW24379D: [
            "王钰涵",
            "吕诗语",
            "周骏杰",
            "关优娴",
            "骆雨樱",
            "邢辰",
            "林璘",
            "王紫玄Tania",
          ],
          YSQ3FCW24380D: [
            "王钰涵",
            "吕诗语",
            "周骏杰",
            "关优娴",
            "骆雨樱",
            "周宗霖",
            "董洺铭",
            "王紫玄Tania",
          ],
        },
      },
      CAName: "",
      level: "",
      LevelMap: {
        P1: 3,
        P2: 4,
        P3: 5,
      },
      validDataList: [],
      VIPTotalHours: 0,
      classTotalHours: 0,
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
              this.classTotalHours += item.duringHour;
            });
          } else {
            list.push({
              ...value,
              stuType: "VIP学员",
              stuName: item.stuOrClass,
              classNo: "",
              pricePay: 1 * item.duringHour * this.LevelMap[this.level],
            });
            this.VIPTotalHours += item.duringHour;
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
        { wch: 15 }, // 第一列宽50个字符宽度单位
        { wch: 20 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第三列宽100个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 25 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 15 }, // 第二列宽75个字符宽度单位
        { wch: 10 }, // 第二列宽75个字符宽度单位
      ];

      const keys = Object.keys(worksheet);
      keys.pop(); // 去除特殊值
      keys.pop();
      keys.forEach((key, index) => {
        if (worksheet[key]) {
          worksheet[key].s = {}; // 预设 s
        }
      });

      const headers = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"]; // 设置表头颜色
      headers.forEach((header) => {
        worksheet[header].s.fill = {
          fgColor: { rgb: "4BACC6" },
        };
        worksheet[header].s.alignment = {
          horizontal: "center",
          vertical: "center",
        };
        worksheet[header].s.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
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
      saveAs(dataBlob, "Excel-课消统计.xlsx");

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
  padding: 10px;

  .class-member {
    margin-left: 10px;
    flex: 1;
  }

  .member-list {
    margin-left: 30px;
    flex: 1;
  }

  .class-member {
    height: 100%;
  }
  .wage-input {
    display: block;
    width: 320px;
  }
  .des-tag {
    margin-left: 16px;
    margin-top: 5px;
  }
  .box-card-container {
    height: 90vh;
    overflow-y: auto;
  }
}
</style>
