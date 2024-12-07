<template>
  <div id="chart">
    <div id="container">
      <el-button @click="run">123</el-button>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import $ from "jquery";
import a from "./life-expectancy-table.json";
export default {
  name: "Chart",
  data() {
    return {
      myChart: "",
    };
  },
  methods: {
    run(_rawData) {
      let option = {
        title: {
          text: "班课学生统计",
          subtext: "Fake Data",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            console.log(params[0].name);
            const memberMap = {
              "24225(6分)": {
                count: 3,
                test: 2,
                achieve: "0    (5.5)",
                fund: "1人 周骏杰",
                highscore: "",
              },
              "24201U(6.5分)": {
                count: 6,
                test: 4,
                achieve: "1人 7.5 6.0 6.0 5.5",
                fund: "0",
                highscore: "1人 - 虞泊轩 7.5",
              },
              "24256(5.5分)": {
                count: 4,
                test: 1,
                achieve: "1人 邵凯祺（5.5）",
                fund: "1人 张子珺",
                highscore: "",
              },
              "24142(预备)": {
                count: 7,
                test: 0,
                achieve: "0",
                fund: "1人 许金睿东",
                highscore: "",
              },
              "24303(5.5-6精品)": {
                count: 5,
                test: 1,
                achieve: "1人 钱旌弘（6.0）",
                fund: "0",
                highscore: "",
              },
              "24179U(6分)": {
                count: 4,
                test: 1,
                achieve: "0人 金诗萍（5.5）",
                fund: "0",
                highscore: "",
              },
              "24310(5.5分)": {
                count: 4,
                test: 0,
                achieve: "0",
                fund: "2人 李旭、殷家家",
                highscore: "",
              },
              "24321(6分)": {
                count: 6,
                test: 2,
                achieve: "0  何子杰（5.0）、张展诰（4.5）",
                fund: "0",
                highscore: "",
              },
              "24342(6.5分)": {
                count: 4,
                test: 2,
                achieve: "1人  吴悠（7.5），高天成（5.5）",
                fund: "1人 丁一帆",
                highscore: "1人 吴悠（9/9/6.5/6 --> 7.5）",
              },
              "24285(6分)": {
                count: 5,
                test: 0,
                achieve: "0",
                fund: "0",
                highscore: "",
              },
              "24378(6分)": {
                count: 5,
                test: 0,
                achieve: "0",
                fund: "0",
                highscore: "",
              },
            };
            return `<div class="item">


            <div><span class="circle">◉</span><span>班级人数：${
              memberMap[params[0].name]?.count
            }</span> </div> \n
            <div><span class="circle">◉</span><span>考试人数：${
              memberMap[params[0].name]?.test
            }</span> </div> \n
            <div><span class="circle">◉</span><span>出分人数：${
              memberMap[params[0].name]?.achieve
            }</span> </div> \n
            <div><span class="circle">◉</span><span>续费人数：${
              memberMap[params[0].name]?.fund
            }</span> </div> \n
            <div><span class="circle">◉</span><span>高分人数：${
              memberMap[params[0].name]?.highscore
            }</span> </div> \n


            </div>`;
          },
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          //   boundaryGap: false,

          // prettier-ignore
          data: ['24225(6分)', '24201U(6.5分)', '24256(5.5分)', '24142(预备)', '24303(5.5-6精品)','24179U(6分)', '24310(5.5分)', '24321(6分)','24342(6.5分)', '24285(6分)','24378(6分)'],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 人",
          },
          axisPointer: {
            snap: true,
          },
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [
            {
              lte: 6,
              color: "green",
            },
            {
              gt: 6,
              lte: 8,
              color: "red",
            },
            {
              gt: 8,
              lte: 14,
              color: "green",
            },
            {
              gt: 14,
              lte: 17,
              color: "red",
            },
            {
              gt: 17,
              color: "green",
            },
          ],
        },

        series: [
          {
            name: "人数",
            type: "line",

            smooth: true,
            // prettier-ignore
            data: [{value: 3}, {value: 6}, {value: 4}, {value: 7}, {value: 5}, {value: 4}, {value: 4}, {value: 6}, {value: 4}, {value: 5}, {value: 5}],
            markArea: {
              itemStyle: {
                color: "rgba(255, 173, 177, 0.4)",
              },
              data: [
                [
                  {
                    name: "Morning Peak",
                    xAxis: "07:30",
                  },
                  {
                    xAxis: "10:00",
                  },
                ],
                [
                  {
                    name: "Evening Peak",
                    xAxis: "17:30",
                  },
                  {
                    xAxis: "21:15",
                  },
                ],
              ],
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
  },
  mounted() {
    var dom = document.getElementById("container");
    this.myChart = echarts.init(dom, null, {
      renderer: "canvas",
      useDirtyRect: false,
    });
    this.myChart.on("click", "series.line", function (params) {
      console.log(params);
    });

    this.run(a);
  },
};
</script>

<style>
#chart {
  width: 100%;
  padding: 10px;

  /* height: 100vh; */
}
#container {
  /* width: 500px;
  height: 500px; */
  width: 100%;
  height: 600px;
}
.circle {
  color: green;
  display: inline-block;
  font-size: 16px;
  text-align: center;
  margin-right: 3px;
}
.item {
  /* display: flex; */
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
