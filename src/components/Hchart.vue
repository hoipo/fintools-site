<template>
  <div id="chart-container" class="chart-container" width="600" height="400"></div>
</template>

<script>
const Highcharts = require('highcharts');  
require('highcharts/modules/exporting')(Highcharts); 
export default {
  name: "Hchart",
  props: {},
  data() {
    return {};
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      fetch("/api/get_tick_data?date=2020-12-23")
        .then((response) => response.json())
        .then((data) => {
          // 数据去重
          data = data.reduce((cur, next) => {
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
          console.log(data);

          Highcharts.chart('chart-container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Fruit Consumption'
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        });

});
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  /* background-color: bisque; */
  width: 600px;
  height: 400px;
}
</style>
