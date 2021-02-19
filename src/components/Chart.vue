<template>
    <el-col :span="14" :xs="{span: 22}"><div ref="chart" class="chart-container"></div></el-col>
</template>

<script>
const echarts = require("echarts");
let data = [];
export default {
  name: "Chart",
  props: {},
  data() {
    return {
        legendSetting: window.localStorage.getItem("legendSetting") ? JSON.parse(window.localStorage.getItem("legendSetting")) : {'基金价格': true,'基金估值': true, '基金映射价': true, '基金净值': true, '期货前结算价': false,'期货均价': false,'期货现价': false},
        boundary: {
        set min(value) {
            if (value > (this._min || 1)) {
            return;
            }
            this._min = value;
            window.myChart.setOption({
            yAxis: [
                {
                min: (
                    data[data.length - 1].ag_fund_previous_net_value * value
                ).toFixed(3),
                },
                {
                min: (
                    data[data.length - 1].ag_future_previous_settlement_price *
                    value
                ).toFixed(3),
                },
            ],
            });
        },
        get min() {
            return this._min || 1;
        },
        set max(value) {
            if (value < (this._max || 1)) {
            return;
            }
            this._max = value;
            window.myChart.setOption({
            yAxis: [
                {
                max: (
                    data[data.length - 1].ag_fund_previous_net_value * value
                ).toFixed(3),
                },
                {
                max: (
                    data[data.length - 1].ag_future_previous_settlement_price *
                    value
                ).toFixed(3),
                },
            ],
            });
        },
        get max() {
            return this._max || 1;
        },
        },
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    adjustBoundary(data) {
      const {
        ag_fund_previous_net_value,
        ag_future_previous_settlement_price,
      } = data[data.length - 1];

      // 计算并设置最小值
      this.boundary.min =
        Math.min(...data.map((x) => x.ag_fund_price)) /
        ag_fund_previous_net_value;
      this.boundary.min =
        Math.min(...data.map((x) => x.future_mapping_valuation)) /
        ag_fund_previous_net_value;
      this.boundary.min =
        Math.min(...data.map((x) => x.ag_fund_valuation)) /
        ag_fund_previous_net_value;

      this.boundary.min =
        Math.min(...data.map((x) => x.ag_future_averge_price)) /
        ag_future_previous_settlement_price;
      this.boundary.min =
        Math.min(...data.map((x) => x.ag_future_price)) /
        ag_future_previous_settlement_price;
      // 计算并设置最小值 结束

      // 计算并设置最大值
      this.boundary.max =
        Math.max(...data.map((x) => x.ag_fund_price)) /
        ag_fund_previous_net_value;
      this.boundary.max =
        Math.max(...data.map((x) => x.future_mapping_valuation)) /
        ag_fund_previous_net_value;
      this.boundary.max =
        Math.max(...data.map((x) => x.ag_fund_valuation)) /
        ag_fund_previous_net_value;

      this.boundary.max =
        Math.max(...data.map((x) => x.ag_future_averge_price)) /
        ag_future_previous_settlement_price;
      this.boundary.max =
        Math.max(...data.map((x) => x.ag_future_price)) /
        ag_future_previous_settlement_price;
      //  // 计算并设置最大值 结束
    },
    initChart() {
      const myChart = echarts.init(this.$refs.chart);
      window.myChart = myChart;
      const date = new Date();
      fetch(
        `${window.location.host.includes('localhost') ? 'http://localhost:5000' : ''}/api/get_tick_data?date=${date.getFullYear()}-${((date.getMonth() + 1) < 10) ? ('0'+ (date.getMonth() + 1)) : (date.getMonth() + 1)}-${(date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate()}`
      )
        .then((response) => response.json())
        .then((d) => {
          // 数据去重，删除time字段重复的数据
          data = d.reduce((cur, next) => {
            if (cur.length === 0 || cur[cur.length - 1].time !== next.time) {
              next.ag_fund_valuation =
                Math.round(
                  next.ag_fund_previous_net_value *
                    (next.ag_future_averge_price /
                      next.ag_future_previous_settlement_price) *
                    10e3
                ) / 10e3;
              next.future_mapping_valuation =
                Math.round(
                  (next.ag_future_price /
                    next.ag_future_previous_settlement_price) *
                    next.ag_fund_previous_net_value *
                    10e3
                ) / 10e3;
              cur.push(next);
            }
            return cur;
          }, []);
          // 数据去重结束

          myChart.setOption({
            legend: {
              show: "true",
              orient: 'horizontal',
              bottom: 0,
              selected: this.legendSetting,
              selectorLabel: {
                show: true,
              },
            },
            title: {
              text: "实时趋势(Beta)",
            },
            grid: {
              bottom: "22%",
               left: 40,
               right: 40
            },
            // axisPointer:{
            //     show: true
            // },
            tooltip: {
              trigger: "axis",
              showContent: true,
            },
            dataset: {
              source: data,
            },
            xAxis: { type: "category" },
            yAxis: [
              {
                name: "基金价格",
                type: "value",
                min: "dataMin",
                max: "dataMax",
              },
              {
                name: "期货价格",
                type: "value",
                min: "dataMin",
                max: "dataMax",
              },
            ],
            series: [
              {
                name: "基金价格",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "ag_fund_price" },
                showSymbol: false,
              },
              {
                name: "基金估值",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "ag_fund_valuation" },
                showSymbol: false,
              },
              {
                name: "基金映射价",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "future_mapping_valuation" },
                showSymbol: false,
              },
              {
                name: "基金净值",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "ag_fund_previous_net_value" },
                showSymbol: false,
              },
              {
                name: "期货前结算价",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "ag_future_previous_settlement_price" },
                showSymbol: false,
                yAxisIndex: 1,
              },
              {
                name: "期货均价",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "ag_future_averge_price" },
                showSymbol: false,
                yAxisIndex: 1,
              },
              {
                name: "期货现价",
                type: "line",
                smooth: true,
                encode: { x: "time", y: "ag_future_price" },
                showSymbol: false,
                yAxisIndex: 1,
              },
            ],
          });

            myChart.on('legendselectchanged', 'legend', function (e) {
                window.localStorage.setItem('legendSetting', JSON.stringify(e.selected))
            })

          this.adjustBoundary(data);
          this.updateChart();
        });
    },
    addDataToChart(d) {
      if (d.time === data[data.length - 1].time) return;
      d.ag_fund_valuation =
        Math.round(
          d.ag_fund_previous_net_value *
            (d.ag_future_averge_price / d.ag_future_previous_settlement_price) *
            10e3
        ) / 10e3;
      d.future_mapping_valuation =
        Math.round(
          (d.ag_future_price / d.ag_future_previous_settlement_price) *
            d.ag_fund_previous_net_value *
            10e3
        ) / 10e3;
      delete d.is_market_open_time;
      data.push(d);
      window.myChart.setOption({
        dataset: {
          source: data,
        },
      });
    },
    updateChart() {
      fetch(`${window.location.host.includes('localhost') ? 'http://localhost' : ''}/api/get_tick_data_one`)
        .then((response) => response.json())
        .then((d) => {
          if (d.is_market_open_time) {
            this.addDataToChart(d);
            setTimeout(() => {
              this.updateChart();
            }, 30000);
          }
        });
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  /* background-color: bisque; */
  width: 640px;
  height: 400px;
  margin: 0 auto;
}

@media screen and (max-width: 700px) {
  .chart-container {
    width: 100%;
    margin: 0;
  }
}
</style>
