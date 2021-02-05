<template>
  <div id="app">
    <el-container>
        <el-header>白银基金套利工具</el-header>
      <el-main>
        <el-form :inline="true" :model="setting" class="form-inline">
          <el-form-item label="数据条数">
            <el-select class="limit-select" v-model="setting.limit" placeholder="数据条数">
              <el-option v-for="i in 10" :key="i"  :label="10*i" :value="10*i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="list" style="width: 100%" size='small'>
          <el-table-column prop="date" label="日期"> </el-table-column>
          <el-table-column
            prop="ag_future_previous_settlement_price"
            label="期货昨结算"
          >
          </el-table-column>
          <el-table-column prop="ag_future_averge_price" label="期货均价">
          </el-table-column>
          <el-table-column prop="ag_future_price" label="期货现价">
          </el-table-column>
          <el-table-column prop="ag_future_distance" label="现均差价">
          </el-table-column>
          <el-table-column
            prop="ag_fund_previous_net_value"
            label="基金昨天净值"
          >
          </el-table-column>
          <el-table-column prop="ag_fund_price" label="基金收盘价">
          </el-table-column>
          <el-table-column prop="ag_fund_cap" label="基金规模(万份)">
          </el-table-column>
          <el-table-column prop="ag_fund_valuation" label="今日基金估值">
          </el-table-column>
          <el-table-column prop="ag_fund_net_value" label="基金今天净值">
          </el-table-column>
          <el-table-column
            prop="ag_fund_valuation_premium"
            label="今日估算溢价"
          >
          </el-table-column>
          <el-table-column prop="ag_fund_actual_premium" label="今日实际溢价">
          </el-table-column>
          <el-table-column prop="valuation_difference" label="误差">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>



<script>
import { Message } from "element-ui";
export default {
  name: "History",
  data() {
    return {
      list: [],
      setting:{
        limit: 10
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onSubmit(){
       this.fetchData();
    },
    fetchData() {
      fetch(`/api/get_ag_history?limit=${this.setting.limit}`)
        .then((response) => response.json())
        .then((data) => {
          this.list = data.map((item) => {
            const ag_future_distance =
              item.ag_future_price - item.ag_future_averge_price;
            const ag_fund_valuation =
              Math.round(
                item.ag_fund_previous_net_value *
                  (item.ag_future_averge_price /
                    item.ag_future_previous_settlement_price) *
                  10e3
              ) / 10e3;
            const ag_fund_valuation_premium =
              Math.round((item.ag_fund_price / ag_fund_valuation - 1) * 10000) /
                100 +
              "%";
            const ag_fund_actual_premium = item.ag_fund_net_value
              ? Math.round(
                  (item.ag_fund_price / item.ag_fund_net_value - 1) * 10000
                ) /
                  100 +
                "%"
              : "-";
            const valuation_difference = item.ag_fund_net_value
              ? Math.round(
                  (parseFloat(ag_fund_actual_premium) -
                    parseFloat(ag_fund_valuation_premium)) *
                    100
                ) /
                  100 +
                "%"
              : "-";
            return Object.assign(item, {
              ag_fund_net_value: item.ag_fund_net_value || "-",
              ag_future_distance,
              ag_fund_valuation,
              ag_fund_valuation_premium,
              ag_fund_actual_premium,
              valuation_difference,
            });
          });
           Message({
            message:`共获取了${this.list.length}条数据`,
            center: true,
            type: 'success',
            duration: 2000
            })
        });
    },
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-header {
  background-color: #409eff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.form-inline{
  text-align: left;
}
.limit-select{
  width: 8em;
}
</style>
