<template>
  <div id="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-input
          style="width: 60%"
          v-model="inputValue"
          placeholder="输入内容，点击右侧按钮或Enter保存"
          @change="addTask"
        ></el-input>
        <el-button
          style="padding: 3px 0; margin-left: 10px"
          type="text"
          @click="addTask"
          >Add-Task</el-button
        >
        <el-button
          style="margin-top: 1px; float: right; color: red"
          type="text"
          @click="addTask"
          >删除全部</el-button
        >
      </div>
      <div v-for="(task, index) in renderValue" :key="index" class="text item">
        <div class="line">
          <el-checkbox v-model="task.completed"></el-checkbox>
          <div
            class="text"
            v-if="!task.editing"
            :class="task.completed ? 'task-completed' : ''"
          >
            {{ task.value }}
          </div>
          <el-input
            class="text"
            v-model="task.value"
            v-else
            placeholder="请输入内容"
            @change="onblur(index)"
          ></el-input>
          <div>
            <span style="font-size: 12px; color: #ccc; padding-right: 5px">{{
              task.createTime
            }}</span>
            <i
              class="el-icon-edit"
              style="color: red; cursor: pointer; padding: 0 5px"
              @click="editTask(index)"
            ></i>
            <i
              class="el-icon-delete"
              style="color: red; cursor: pointer"
              @click="deleteTask(index)"
            ></i>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Chart",
  data() {
    return {
      inputValue: "",
      renderValue: [],
    };
  },
  methods: {
    addTask(event) {
      console.log("enter");
      if (this.inputValue) {
        this.renderValue.unshift({
          value: this.inputValue,
          createTime: moment().format("YYYY-MM-DD HH:MM"),
          editing: false,
          completed: false,
        });
        this.inputValue = "";
      } else {
        this.$message.error("请输入内容");
      }
    },
    editTask(index) {
      this.renderValue.splice(index, 1, {
        ...this.renderValue[index],
        editing: !this.renderValue[index].editing,
      });
    },
    onblur(index) {
      console.log("object");
      this.renderValue.splice(index, 1, {
        ...this.renderValue[index],
        editing: false,
        value: this.renderValue[index].value,
      });
    },
    deleteTask(index) {
      this.renderValue.splice(index, 1);
      this.$message.success("删除成功");
    },
    deleteAllTask() {
      this.renderValue = [];
      this.$message.success("删除成功");
    },
  },
  watch: {
    renderValue: {
      handler(n, o) {
        localStorage.setItem("todoList", JSON.stringify(this.renderValue));
      },

      deep: true,
    },
  },
  mounted() {
    const localStorageValue = localStorage.getItem("todoList");
    this.renderValue = localStorageValue ? JSON.parse(localStorageValue) : [];
  },
};
</script>

<style>
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
</style>

<style lang="less" scoped>
#container {
  /* width: 500px;
  height: 500px; */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box-card {
  margin-top: 10px;
  width: 60%;

  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;

    border-bottom: 1px solid #ccc;

    .text {
      white-space: normal;
      overflow-wrap: break-word;
      width: 80%;
    }
    .task-completed {
      text-decoration: line-through;
      color: #ccc;
    }
  }
}
</style>
