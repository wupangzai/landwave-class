<template>
  <div id="daily-class">
    <div class="data-source">
      <el-input
        placeholder="MetaBase Data"
        v-model="metaBaseInput"
        class="data-input"
      ></el-input>
      <!-- <el-input
        placeholder="CA"
        v-model="CAName"
        style="margin-top: 20px"
        class="data-input"
      ></el-input> -->

      <div style="margin-top: 20px; width: 280px">
        <el-select v-model="CAName" placeholder="请选择" style="width: 280px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <el-button type="primary" style="margin-top: 20px" @click="clickFn">
        获取上课提醒
      </el-button>
    </div>
    <div class="copy-area">
      <el-card class="box-card-daily">
        <div slot="header" class="clearfix">
          <span>上课提醒</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          >
        </div>
        <div class="box-card-remind-container">
          <div v-for="(item, index) in renderList" :key="index" class="">
            <el-card class="box-card-remind">
              <div slot="header" class="clearfix">
                <span style="font-weight: bold">{{ item.stuOrClass }}</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="copyToClipBoard(item)"
                  >复制✔</el-button
                >
              </div>
              <div class="copy-text">
                <div>☀【明日课程提醒】</div>
                <div>上课时间：{{ item.time }}</div>
                <div>上课科目：{{ item.subject }}@{{ item.teacher }}</div>
                <div>授课方式：线下</div>
                <div>上课地址：半海人广校区（汉口路300号解放大厦4楼）</div>
                <div>上课教室：</div>
                <div>以上是明天的课程提醒，请查收哈🌹</div>
              </div>
            </el-card>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DailyClass",
  data() {
    return {
      metaBaseInput: "",
      CAName: "吴彬",
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
      ],
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
      renderList: [],
    };
  },
  methods: {
    clickFn() {
      const dataAfterParase = JSON.parse(this.metaBaseInput);
      const listAfterFilterByCA = dataAfterParase.filter((item) => {
        return item["助教"] === this.CAName;
      });
      console.log(listAfterFilterByCA);
      const dataAfterSorted = this.sortByPropertyOrder(
        listAfterFilterByCA,
        "学生/班级"
      );

      this.renderList = dataAfterSorted.map((item) => {
        return {
          time: `${item.start.slice(-5)}-${item.end.slice(-5)}`,
          subject: item["课程"],
          stuOrClass: item["学生/班级"],
          teacher: item["教师"],
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
    async copyToClipBoard(item) {
      const text = `☀【明日课程提醒】\n上课时间：${item.time}\n上课科目：${item.subject}@${item.teacher}\n授课方式：线下\n上课地址：半海人广校区（汉口路300号解放大厦4楼）\n上课教室：\n以上是明天的课程提醒，请查收哈`;
      // await navigator.clipboard.writeText(text);
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
      copyToClipboard(text);
      this.$message.success("复制成功");
    },
  },
  async created() {
    axios
      .get(
        "/class/json?parameters=%5B%7B%22type%22%3A%22category%22%2C%22value%22%3A%5B%22%E5%8D%8A%E6%B5%B7%E4%BA%BA%E5%B9%BF%22%5D%2C%22id%22%3A%22e7ab001d-adfb-44aa-7cd3-96ee5f8d0dc2%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22dept%22%5D%5D%7D%2C%7B%22type%22%3A%22date%2Fall-options%22%2C%22value%22%3A%22next1days%22%2C%22id%22%3A%22953e6c0e-7467-721c-8065-fa3451526c25%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22date%22%5D%5D%7D%2C%7B%22type%22%3A%22category%22%2C%22value%22%3Anull%2C%22id%22%3A%22627547e3-e078-8cd7-1c44-0038eba685e3%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22stuName%22%5D%5D%7D%5D&format_rows=true"
      )
      .then((response) => {
        this.metaBaseInput = JSON.stringify(response.data);
        this.$message.success("自动获取明日课表成功~");
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
#daily-class {
  width: 100%;
  height: 96vh;
  display: flex;
  .box-card-daily {
    width: 80%;
    overflow-y: auto;
    height: 98%;

    .box-card-remind-container {
      padding-left: 55px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      // justify-content: center;
    }
    .box-card-remind {
      width: 320px;
      margin: 30px;
      height: 300px;
      // flex: 0.5;
    }
  }
  .data-input {
    display: block;
    width: 280px;
  }
}
.copy-area {
  margin-left: 80px;
  flex: 1;
}
</style>
