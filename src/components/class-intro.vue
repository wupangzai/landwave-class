<template>
  <div id="class-intro">
    <div class="data-input">
      <div style="width: 280px">
        <el-select v-model="CAName" placeholder="请选择" style="width: 280px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="to-top">
        <el-radio v-model="classOrStu" label="stu">一对一</el-radio>

        <el-radio v-model="classOrStu" label="class">班课</el-radio>
      </div>
      <el-input
        v-model="name"
        placeholder="学生姓名"
        class="to-top"
        v-if="classOrStu === 'stu'"
      ></el-input>
      <el-input
        v-model="consult"
        placeholder="顾问姓名"
        class="to-top"
        v-if="classOrStu === 'stu'"
      ></el-input>
      <el-input
        v-model="date"
        placeholder="开课时间"
        class="to-top"
        v-if="classOrStu === 'stu'"
      ></el-input>
      <div class="to-top" v-if="classOrStu === 'stu'">
        <el-radio v-model="type" label="offline">线下</el-radio>
        <el-radio v-model="type" label="online">线上</el-radio>
      </div>
      <div class="to-top" v-if="classOrStu === 'stu'">
        <el-radio v-model="groupType" label="in">内部群</el-radio>
        <el-radio v-model="groupType" label="out">学习群</el-radio>
      </div>
      <el-button class="to-top" @click="clickFn"> Click To </el-button>
    </div>
    <div class="card-content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span> <el-tag type="danger">Only IELTS</el-tag> </span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          >
        </div>
        <!-- 一对一，内部 -->
        <div v-if="classOrStu === 'stu' && groupType === 'in'">
          <el-tag type="danger">1</el-tag>
          <div>
            各位老师好，本群是{{ name }}雅思一对一的内部沟通群，我是班主任{{
              CAName
            }}（{{ getEName }}），学生首次开课时间为{{
              date
            }}，以下是学生的课表，请各位老师知晓[玫瑰]
          </div>
          <el-tag type="danger" class="border-text">2</el-tag>
          <div></div>
          <img src="../assets/kebiao-demo.png" class="img" />

          <div></div>
          <el-tag type="danger" class="border-text"
            >3: 记得补充@{{ consult }} 顾问老师</el-tag
          >

          <div>
            辛苦顾问@{{ consult }} 老师按照模版先介绍一下学生基本信息~谢谢[玫瑰]
          </div>
          <el-tag type="danger" class="border-text">4</el-tag>

          <div>
            学生： <br />
            学校： <br />
            年级： <br />
            上次考试时间： <br />
            模考成绩或入学基础： <br />
            目标分数：<br />
            下次考试日期： <br />
            合计所报课程： <br />
            特殊情况备注：
          </div>
        </div>
        <!-- 一对一，学习群 -->
        <div v-show="classOrStu === 'stu' && groupType === 'out'">
          <el-tag type="danger">1</el-tag>
          <div>
            各位老师好，本群是{{ name }}雅思一对一的学习群，我是班主任{{
              CAName
            }}（{{ getEName }}），学生首次开课时间为{{ date }}，辛苦顾问@{{
              consult
            }}
            老师邀请学生和家长进群~
          </div>
          <el-tag type="danger" class="border-text">2</el-tag>
          <div>
            {{ name }}同学以及家长，你们好🌛<br /><br />

            &nbsp;&nbsp;&nbsp;&nbsp; 欢迎加入澜大半海开启雅思学习之旅！<br /><br />

            &nbsp;&nbsp;&nbsp;&nbsp;我是澜大半海人广校区的学管/班主任老师{{
              CAName
            }}（{{ getEName }}）,
            &nbsp;&nbsp;&nbsp;&nbsp;后续会负责你的课程跟踪、课后自习监督辅练等，有什么疑问，欢迎随时与我联系！<br /><br />

            &nbsp;&nbsp;&nbsp;&nbsp;课后我们将在本群进行课堂学情反馈，给到教师建议及课堂作业，课后我们也会有相应的学习任务需要完成。请记得关注本群消息喔！<br /><br />

            &nbsp;&nbsp;&nbsp;&nbsp;为了帮助你达成学习目标，希望在同学自身的主观能动发挥下以及咱们老师的共同努力下，帮助你取得良好的学习效果，实现你的目标！一起加油！<br /><br />
          </div>
          <el-tag type="danger" class="border-text"
            >3: 记得补充@顾问老师</el-tag
          >
          <div>
            我们的群内由以下的老师组成，望你悉知[玫瑰] <br /><br />

            1⃣全体助教老师 <br /><br />

            2⃣雅思总监老师：于瑶老师 @于瑶 <br /><br />

            3⃣澜大半海人广校区校长老师： @许奕琳 <br /><br />

            4⃣️顾问老师 @{{ consult }} <br /><br />

            5⃣️授课老师 <br /><br />

            各位老师会一起为你答疑解惑哟~
          </div>
          <el-tag type="danger" class="border-text">4</el-tag>
          <div></div>
          <img src="../assets/vip线下.png" class="img" style="height: 600px" />
          <div>【澜大半海教育-注意事项】如上↑</div>
          <div>
            <el-tag type="danger" class="border-text">5</el-tag>
            <div>【半海人广-校区地址】如下👇🏻</div>
            <img
              src="../assets/school-address.png"
              class="img"
              style="height: 300px"
            />
          </div>
          <div id="map-1" style="width: 400px; height: 400px" ref="map"></div>
          <el-tag type="danger" class="border-text">6</el-tag>
          <div></div>
          <img src="../assets/kebiao-demo.png" class="img" />
          <div>
            以上是{{ name }}的【课表】，请保存并按时出勤！<br /><br />

            如需请假，为了避免影响课时，请务必按【注意事项】中规定的请假流程，至少提前24小时联系班主任进行请假哦，方便进行内部流程调整~
          </div>
          <el-tag type="danger" class="border-text">7</el-tag>
          <div>
            ✨温馨提示：<br /><br />

            ⚠为了学习效率的提高及咱们学习目标的达成，请尽量不要携带除了手机以外的娱乐电子设备（比如PAD&电脑），如需要携带，我们也会视情况进行电子设备的管理哦~
          </div>
          <el-tag type="danger" class="border-text">8</el-tag>
          <div>
            明日到了解放大厦一楼之后，需要先登记一下自己的访客信息，或者说来4楼，报我们的访客密码：888，就会放行哦！
            后面我会给孩子发放通行证哒~
          </div>
          <el-tag type="danger" class="border-text">9</el-tag>

          <div>
            以上就是我们的开班介绍，🌹祝{{
              name
            }}在澜大半海人广校区学习愉快[太阳]
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
//引入
import Clipboard from "clipboard";
export default {
  name: "ClassIntro",
  data() {
    return {
      CAName: "吴彬",
      consult: "",
      options: [
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
      ],
      name: "",
      type: "offline",
      groupType: "in",
      classOrStu: "stu",
      date: "",
    };
  },
  methods: {
    clickFn() {},

    copy(textToCopy) {
      function copyToClipboard(textToCopy) {
        // navigator clipboard 需要https等安全上下文
        if (navigator.clipboard && window.isSecureContext) {
          // navigator clipboard 向剪贴板写文本
          return navigator.clipboard.writeText(textToCopy);
        } else {
          // 创建text area
          let textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          // 使text area不在viewport，同时设置不可见
          textArea.style.position = "absolute";
          textArea.style.opacity = 0;
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand("copy") ? res() : rej();
            textArea.remove();
          });
        }
      }
    },
    initMap() {
      console.log("qq", qq.maps);
      console.log("dom", document.getElementById("map-1"));
      console.log("ref", this.$refs);
      var center = new qq.maps.LatLng(31.235824, 121.484456); // 设定中心点坐标
      var map = new qq.maps.Map(document.getElementById("map-1"), {
        // 创建地图实例
        center: center,
        zoom: 14,
      });
      // 创建标记
      var marker = new qq.maps.Marker({
        position: center,
        map: map,
      });
    },
  },
  computed: {
    getEName() {
      return this.options.find((item) => item.value === this.CAName).label;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
};
</script>

<style lang="less" scoped>
#class-intro {
  width: 100%;
  display: flex;

  .to-top {
    margin-top: 25px;
  }

  .data-input {
    width: 280px;
  }

  .card-content {
    width: 100%;
  }

  .box-card {
    margin-left: 150px;
    flex: 1;
    width: 700px;
    height: 95vh;
    overflow-y: auto;
  }
  .img {
    margin-top: 5px;
    margin-bottom: 20px;
    border: dotted 1px #ccc;
    width: 500px;
    height: 400px;
  }
  .border-text {
    // border: dotted 1px #ccc;
    margin: 20px 0;
  }
}
</style>
