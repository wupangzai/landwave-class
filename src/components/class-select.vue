<template>
  <div id="demo-select">
    <div class="select-area">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>VIP学生</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >{{ VIPList.length }}条记录</el-button
          >
        </div>
        <div v-for="(stu, index) in VIPList" :key="index" class="text item">
          <el-tag
            :type="getColor(VIPList, stu.stuOrClass) >= 2 ? 'success' : ''"
          >
            <span>{{ stu.time }}</span>
            <span style="margin-left: 10px">{{ stu.subject }}</span>
            <span style="margin-left: 10px">{{ stu.teacher }}</span>
            <span style="margin-left: 10px">{{ stu.stuOrClass }}</span>
            <span style="margin-left: 10px">{{ getCAEnName(stu.CA) }}</span>
          </el-tag>
          <el-tag
            style="margin-left: 10px"
            v-if="stu.studentClassPlace !== '半海人广旗舰'"
            type="danger"
            >{{ stu.studentClassPlace }}</el-tag
          >
          <el-tag
            style="margin-left: 10px"
            v-if="stu.studentServePlace !== '半海人广旗舰'"
            type="danger"
            >非本校区学生-{{ stu.studentServePlace }}</el-tag
          >
          <el-select
            v-model="stu.classroom"
            placeholder="请选择"
            class="selector"
            size="mini"
            @change="change"
          >
            <el-option
              v-for="item in classroomOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.tip
              }}</span>
            </el-option>
          </el-select>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>班课</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >{{ classList.length }}条记录</el-button
          >
        </div>
        <div v-for="(stu, index) in classList" :key="index" class="text item">
          <el-tag type="warning">
            <span>{{ stu.time }}</span>
            <span style="margin-left: 10px">{{ stu.subject }}</span>
            <span style="margin-left: 10px">{{ stu.teacher }}</span>
            <span style="margin-left: 10px">{{ stu.stuOrClass }}</span>
            <span style="margin-left: 10px">{{ getCAEnName(stu.CA) }}</span>
          </el-tag>
          <el-tag
            style="margin-left: 10px"
            v-if="stu.studentClassPlace !== '半海人广旗舰'"
            type="danger"
            >{{ stu.studentClassPlace }}</el-tag
          >
          <el-tag
            style="margin-left: 10px"
            v-if="stu.studentClassPlace !== '半海人广旗舰'"
            type="danger"
            >非本校区学生-{{ stu.studentServePlace }}</el-tag
          >
          <el-select
            v-model="stu.classroom"
            placeholder="请选择"
            class="selector"
            size="mini"
            @change="change"
          >
            <el-option
              v-for="item in classroomOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.tip
              }}</span>
            </el-option>
          </el-select>
        </div>
      </el-card>
    </div>
    <div class="data-area">
      <el-card class="box-card-data box-card">
        <div slot="header" class="clearfix">
          <span
            style="text-align: center; display: inline-block; width: 100%"
            >{{ nextDay }}</span
          >
        </div>
        <div class="data-container">
          <div class="left-class">
            <div class="cell" v-for="room in renderLeft" :key="room.label">
              <div class="room">{{ room.label }}</div>
              <div class="chamber">
                <div
                  class="chamber-cell"
                  :class="getRoomStu(room.label).length <= 1 ? 'onlyone' : ''"
                  v-for="(stu, index) in getRoomStu(room.label)"
                  :key="index"
                >
                  <span style="margin-left: 5px">{{ stu.time }}</span>
                  <span
                    style="
                      display: inline-block;
                      width: 285px;
                      margin-left: 25px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    >{{ stu.subject }}</span
                  >
                  <span style="margin-left: 15px">{{ stu.teacher }}</span>
                  <span style="margin-left: 15px">{{ stu.stuOrClass }}</span>
                  <span style="margin-left: 15px">{{
                    getCAEnName(stu.CA)
                  }}</span>
                </div>
                <!-- <div class="chamber-cell">123</div>
                <div class="chamber-cell">123</div>
                <div class="chamber-cell-end">123</div> -->
              </div>
            </div>
          </div>
          <div class="left-class">
            <div class="cell" v-for="room in renderRigth" :key="room.label">
              <div class="room">{{ room.label }}</div>
              <div class="chamber">
                <div
                  class="chamber-cell"
                  :class="getRoomStu(room.label).length <= 1 ? 'onlyone' : ''"
                  v-for="(stu, index) in getRoomStu(room.label)"
                  :key="index"
                >
                  <span style="margin-left: 5px">{{ stu.time }}</span>
                  <span
                    style="
                      display: inline-block;
                      width: 285px;
                      margin-left: 25px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    >{{ stu.subject }}</span
                  >
                  <span style="margin-left: 15px">{{ stu.teacher }}</span>
                  <span style="margin-left: 15px">{{ stu.stuOrClass }}</span>
                  <span style="margin-left: 15px">{{
                    getCAEnName(stu.CA)
                  }}</span>
                </div>
                <!-- <div class="chamber-cell">123</div>
                <div class="chamber-cell">123</div>
                <div class="chamber-cell-end">123</div> -->
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="upload">
      <div>
        <el-upload
          class="upload-demo"
          drag
          action=""
          :on-error="fileChangeInfo"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import instance from "../api";
import moment from "moment";
import _ from "lodash";
const Excel = require("exceljs");

export default {
  name: "App",
  data() {
    return {
      metaBaseInput: "",
      renderList: [],
      classroomOptions: [
        {
          label: "VIP1",
          tip: "",
        },

        {
          label: "VIP2",
          tip: "有空调",
        },
        {
          label: "VIP3",
          tip: "",
        },
        {
          label: "VIP4",
          tip: "有空调",
        },
        {
          label: "VIP5",
        },
        {
          label: "VIP6",
          tip: "有空调",
        },
        {
          label: "VIP7",
          tip: "有空调",
        },
        {
          label: "VIP8",
          tip: "有空调",
        },
        {
          label: "VIP9",
        },
        {
          label: "VIP10",
        },
        {
          label: "VIP11",
        },
        {
          label: "VIP12",
        },
        {
          label: "教室1",
        },
        {
          label: "教室2",
        },
        {
          label: "教室3",
        },
        {
          label: "教室4",
        },
        {
          label: "教室5",
        },
        {
          label: "教室6",
        },
        {
          label: "教室7",
        },
        {
          label: "教室8",
        },
        {
          label: "办公室",
        },
        {
          label: "中转区",
        },
      ],
      renderLeft: [
        {
          label: "VIP1",
        },

        {
          label: "VIP2",
        },
        {
          label: "VIP3",
        },
        {
          label: "VIP4",
        },
        {
          label: "VIP5",
        },
        {
          label: "VIP6",
        },
        {
          label: "VIP7",
        },
        {
          label: "VIP8",
        },
        {
          label: "VIP9",
        },
        {
          label: "VIP10",
        },
        {
          label: "VIP11",
        },
        {
          label: "VIP12",
        },
      ],
      renderRigth: [
        {
          label: "教室1",
        },
        {
          label: "教室2",
        },
        {
          label: "教室3",
        },
        {
          label: "教室4",
        },
        {
          label: "教室5",
        },
        {
          label: "教室6",
        },
        {
          label: "教室7",
        },
        {
          label: "教室8",
        },
        {
          label: "办公室",
        },
        {
          label: "中转区",
        },
        {
          label: "  ",
        },
        {
          label: "   ",
        },
      ],
      VIPList: [],
      classList: [],
      nextDay: moment().add(1, "day").format("YYYY-MM-DD"),
      CAList: [
        {
          value: "吴彬",
          label: "Anan",
        },
        {
          value: "王淑贤",
          label: "Yilia",
        },
        {
          value: "刘维倩",
          label: "Quincy",
        },
        {
          value: "董洁",
          label: "Jade",
        },
        {
          value: "王南飞",
          label: "Winnie",
        },
        {
          name: "胡庭玥",
          EName: "Rebeca",
        },
      ],
      dayMap: [
        {
          num: 0,
          day: "Sunday",
        },
        {
          num: 1,
          day: "Monday",
        },
        {
          num: 2,
          day: "Tuesday",
        },
        {
          num: 3,
          day: "Wednesday",
        },
        {
          num: 4,
          day: "Thursday",
        },
        {
          num: 5,
          day: "Friday",
        },
        {
          num: 6,
          day: "Saturday",
        },
      ],
    };
  },
  methods: {
    async getDataBase() {
      const res = await instance.get(
        "/myclass/json?parameters=%5B%7B%22type%22%3A%22category%22%2C%22value%22%3A%5B%22%E5%8D%8A%E6%B5%B7%E4%BA%BA%E5%B9%BF%E6%97%97%E8%88%B0%22%5D%2C%22id%22%3A%22e7ab001d-adfb-44aa-7cd3-96ee5f8d0dc2%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22dept%22%5D%5D%7D%2C%7B%22type%22%3A%22date%2Fall-options%22%2C%22value%22%3A%22next1days%22%2C%22id%22%3A%22953e6c0e-7467-721c-8065-fa3451526c25%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22date%22%5D%5D%7D%2C%7B%22type%22%3A%22category%22%2C%22value%22%3Anull%2C%22id%22%3A%22627547e3-e078-8cd7-1c44-0038eba685e3%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22stuName%22%5D%5D%7D%5D"
      );
      this.metaBaseInput = JSON.stringify(res);
      this.$message.success("自动获取明日课表成功~");
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

    // 处理原始数据
    handleData() {
      const dataAfterParase = JSON.parse(this.metaBaseInput);

      this.date = moment().add(1, "days").format("YYYY.MM.DD");
      const dataAfterSorted = this.sortByPropertyOrder(
        dataAfterParase,
        "学生/班级"
      );

      this.renderList = dataAfterSorted.map((item) => {
        return {
          time: `${moment(item.start).format("HH:mm")}-${moment(
            item.end
          ).format("HH:mm")}`,
          subject: item["课程"],
          stuOrClass: item["学生/班级"],
          teacher: item["教师"],
          CA: item["助教"],
          studentClassPlace: item["上课校区"],
          studentServePlace: item["学生服务校区"],
        };
      });
      console.log("[  ] >", this.renderList);
    },

    // 分类，VIP还是班课
    sortVIPOrClass(stuOrClass) {
      return this.renderList.filter((item) => {
        if (stuOrClass === "class") {
          return item.stuOrClass.length >= 13;
        }
        return item.stuOrClass.length < 13;
      });
    },

    getVIPAndClassList() {
      this.VIPList = this.sortVIPOrClass("VIP");
      this.classList = this.sortVIPOrClass("class");
    },
    change() {
      console.log("[  ] >", this.VIPList);
    },
    getCAEnName(cnName) {
      return this.CAList.find((person) => person.value === cnName)?.label;
    },
    getRoomStu(room) {
      const list = [...this.VIPList, ...this.classList].filter((stu) => {
        return stu.classroom === room;
      });
      return _.sortBy(list, "time");
    },
    getColor(list, stuOrClass) {
      let count = 0;
      list.forEach((item) => {
        if (item.stuOrClass === stuOrClass) {
          count++;
        }
      });
      return count;
    },

    async fileChangeInfo(e, file) {
      const stream = file.raw.stream();

      const workbook = new Excel.Workbook();

      const sheetName = moment().add(1, "days").format("YYYY.M.D");

      // 读取文件
      const res = await workbook.xlsx.read(stream);
      // 获取第一个工作
      const worksheet = workbook.getWorksheet(sheetName);
      console.log("[ worksheet ] >", worksheet);

      const spaceMap = {
        VIP1: [
          ["B6", "C6", "D6", "E6", "F6", "G6"],
          ["B7", "C7", "D7", "E7", "F7", "G7"],
          ["B8", "C8", "D8", "E8", "F8", "G8"],
        ],
        VIP2: [
          ["B9", "C9", "D9", "E9", "F9", "G9"],
          ["B10", "C10", "D10", "E10", "F10", "G10"],
          ["B11", "C11", "D11", "E11", "F11", "G11"],
        ],
        VIP3: [
          ["B12", "C12", "D12", "E12", "F12", "G12"],
          ["B13", "C13", "D13", "E13", "F13", "G13"],
          ["B14", "C14", "D14", "E14", "F14", "G14"],
        ],
        VIP4: [
          ["B15", "C15", "D15", "E15", "F15", "G15"],
          ["B16", "C16", "D16", "E16", "F16", "G16"],
          ["B17", "C17", "D17", "E17", "F17", "G17"],
        ],
        VIP5: [
          ["B18", "C18", "D18", "E18", "F18", "G18"],
          ["B19", "C19", "D19", "E19", "F19", "G19"],
          ["B20", "C20", "D20", "E20", "F20", "G20"],
        ],
        VIP6: [
          ["B21", "C21", "D21", "E21", "F21", "G21"],
          ["B22", "C22", "D22", "E22", "F22", "G22"],
          ["B23", "C23", "D23", "E23", "F23", "G23"],
        ],
        VIP7: [
          ["B24", "C24", "D24", "E24", "F24", "G24"],
          ["B25", "C25", "D25", "E25", "F25", "G25"],
          ["B26", "C26", "D26", "E26", "F26", "G26"],
        ],
        VIP8: [
          ["B27", "C27", "D27", "E27", "F27", "G27"],
          ["B28", "C28", "D28", "E28", "F28", "G28"],
          ["B29", "C29", "D29", "E29", "F29", "G29"],
        ],
        VIP9: [
          ["B30", "C30", "D30", "E30", "F30", "G30"],
          ["B31", "C31", "D31", "E31", "F31", "G31"],
          ["B32", "C32", "D32", "E32", "F32", "G32"],
        ],
        VIP10: [
          ["B33", "C33", "D33", "E33", "F33", "G33"],
          ["B34", "C34", "D34", "E34", "F34", "G34"],
        ],
        VIP11: [
          ["B35", "C35", "D35", "E35", "F35", "G35"],
          ["B36", "C36", "D36", "E36", "F36", "G36"],
        ],
        VIP12: [
          ["B37", "C37", "D37", "E37", "F37", "G37"],
          ["B38", "C38", "D38", "E38", "F38", "G38"],
        ],
        教室1: [
          ["I6", "J6", "K6", "L6", "M6", "N6"],
          ["I7", "J7", "K7", "L7", "M7", "N7"],
          ["I8", "J8", "K8", "L8", "M8", "N8"],
        ],
        教室2: [
          ["I9", "J9", "K9", "L9", "M9", "N9"],
          ["I10", "J10", "K10", "L10", "M10", "N10"],
          ["I11", "J11", "K11", "L11", "M11", "N11"],
          ["I12", "J12", "K12", "L12", "M12", "N12"],
        ],
        教室3: [
          ["I13", "J13", "K13", "L13", "M13", "N13"],
          ["I14", "J14", "K14", "L14", "M14", "N14"],
          ["I15", "J15", "K15", "L15", "M15", "N15"],
          ["I16", "J16", "K16", "L16", "M16", "N16"],
        ],
        教室4: [
          ["I17", "J17", "K17", "L17", "M17", "N17"],
          ["I18", "J18", "K18", "L18", "M18", "N18"],
          ["I19", "J19", "K19", "L19", "M19", "N19"],
          ["I20", "J20", "K20", "L20", "M20", "N20"],
        ],
        教室5: [
          ["I21", "J21", "K21", "L21", "M21", "N21"],
          ["I22", "J22", "K22", "L22", "M22", "N22"],
          ["I23", "J23", "K23", "L23", "M23", "N23"],
          ["I24", "J24", "K24", "L24", "M24", "N24"],
        ],
        教室6: [
          ["I25", "J25", "K25", "L25", "M25", "N25"],
          ["I26", "J26", "K26", "L26", "M26", "N26"],
          ["I27", "J27", "K27", "L27", "M27", "N27"],
        ],
        教室7: [
          ["I28", "J28", "K28", "L28", "M28", "N28"],
          ["I29", "J29", "K29", "L29", "M29", "N29"],
          ["I30", "J30", "K30", "L30", "M30", "N30"],
          ["I31", "J31", "K31", "L31", "M31", "N31"],
        ],
        教室8: [
          ["I32", "J32", "K32", "L32", "M32", "N32"],
          ["I33", "J33", "K33", "L33", "M33", "N33"],
          ["I34", "J34", "K34", "L34", "M34", "N34"],
        ],
        办公室: [
          ["I35", "J35", "K35", "L35", "M35", "N35"],
          ["I36", "J36", "K36", "L36", "M36", "N36"],
          ["I37", "J37", "K37", "L37", "M37", "N37"],
        ],
        中转区: [
          ["I38", "J38", "K38", "L38", "M38", "N38"],
          ["I39", "J39", "K39", "L39", "M39", "N39"],
          ["I40", "J40", "K40", "L40", "M40", "N40"],
          ["I41", "J41", "K41", "L41", "M41", "N41"],
          ["I42", "J42", "K42", "L42", "M42", "N42"],
        ],
      };

      Object.keys(spaceMap).forEach((item, index) => {
        const list = [...this.VIPList, ...this.classList].filter((stu) => {
          return stu.classroom === item;
        });
        list.forEach((stu, i) => {
          worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
              spaceMap[item][i].forEach((space, cellIndex) => {
                if (cell.address === space) {
                  if (cellIndex === 0) {
                    cell.value = stu.time;
                  }
                  if (cellIndex === 1) {
                    cell.value = stu.subject;
                  }
                  if (cellIndex === 2) {
                    cell.value = stu.teacher;
                  }
                  if (cellIndex === 3) {
                    cell.value = stu.stuOrClass;
                  }
                  if (cellIndex === 4) {
                    cell.value = this.getCAEnName(stu.CA);
                  }
                  if (cellIndex === 5) {
                    cell.value = this.getCAEnName(stu.CA);
                  }
                }
              });
            });
          });
        });
        console.log("[ list ] >", list);
      });

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (cell.address === "A2") {
            // 日期修改
            cell.value = moment().add(1, "days").format("YYYY/M/D");
          }
          if (cell.address === "G2") {
            //星期修改
            cell.value = this.dayMap.find(
              (day) => day.num === moment().add(1, "days").day()
            ).day;
          }
        });
      });
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "" });
        saveAs(blob, `${moment().add(1, "days").format("M.D")}教室表.xlsx`);
      });
    },
  },
  async created() {
    await this.getDataBase(); // 获取数据
    this.handleData(); // 处理数据
    this.getVIPAndClassList();
    [38, 39, 40, 41, 42].forEach((item) => {
      console.log(
        `"I${item}","J${item}","K${item}","L${item}","M${item}","N${item}"`
      );
    });
  },
};
</script>

<style scoped lang="less">
#demo-select {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;
  .select-area {
    display: flex;

    .box-card {
      width: 45vw;
    }
  }

  .data-area {
    width: 100%;
    margin-top: 10px;

    .box-card {
      width: calc(90vw + 25px);
    }
    .data-container {
      display: flex;
      // font-size: 13px;

      .left-class {
        flex: 1;
        .cell {
          display: flex;
          height: 100px;
          border: 1px solid black;
          display: flex;
          align-items: center;
          .room {
            width: 70px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(147, 214, 147);
            border-right: 1px solid black;
          }
          .chamber {
            flex: 1;
            display: flex;
            flex-direction: column;

            .chamber-cell {
              border-bottom: 1px solid black;
              height: 25px;
              // line-height: 35px;
            }
            .onlyone {
              border-bottom: none;
            }

            .chamber-cell-end {
              border-bottom: none;
              height: 25px;
              // line-height: 35px;
            }
          }
        }
      }
      .right-class {
        flex: 1;
      }
    }
  }

  .upload-demo {
    margin-left: 25px;
  }
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.selector {
  width: 130px;
  height: 35px;
  margin-left: 10px;
}
</style>
