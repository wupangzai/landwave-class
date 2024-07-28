<template>
  <div id="app">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      @select="selectMenu"
    >
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu> -->
      <el-menu-item index="1">
        <i class="el-icon-s-operation"> </i>
        <span slot="title">教室表下载</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-position"></i>
        <span slot="title">上课提醒</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">课程反馈记录</span>
      </el-menu-item>
      <el-menu-item index="4" disabled>
        <i class="el-icon-money"></i>
        <span slot="title">绩效统计</span>
      </el-menu-item>
    </el-menu>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isCollapse: true,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    selectMenu(index) {
      console.log(index);
      switch (index) {
        case "1":
          this.$router.push("./");
          break;
        case "2":
          this.$router.push("./daily-class");
          break;
        case "3":
          this.$router.push("./lesson-record");
          break;
        case "4":
          this.$router.push("./wage");
          break;
      }
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
};
</script>

<style>
#app {
  width: 100%;
  /* height: 100vh; */
  overflow: auto;
  display: flex;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
