<template>
  <div id="app">
     <el-container>
      <el-header>白银基金套利工具</el-header>
      <el-main>
        <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="ag_future_previous_settlement_price"
        label="期货昨结算">
        </el-table-column>
      <el-table-column
        prop="ag_future_averge_price"
        label="期货均价">
      </el-table-column>
      <el-table-column
        prop="ag_future_price"
        label="期货现价">
      </el-table-column>
       <el-table-column
        prop="ag_future_distance"
        label="现均差价">
      </el-table-column>
       <el-table-column
        prop="ag_fund_net_value"
        label="基金昨天净值">
      </el-table-column>
      <el-table-column
        prop="ag_fund_price"
        label="基金现价">
      </el-table-column>
      <el-table-column
        prop="ag_fund_valuation"
        label="今日基金估值">
      </el-table-column>
       <el-table-column
        prop="ag_fund_valuation_premium"
        label="今日估算溢价">
      </el-table-column>
    </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
        return {
          tableData: []
        }
      },
  mounted(){
    fetch('http://119.27.188.244/api/get_live_data_of_ag')
      .then(response => response.json())
      .then(({
        date,
        ag_future_previous_settlement_price,
        ag_future_price,
        ag_fund_net_value,
        ag_future_averge_price,
        ag_fund_price
        }) => {
         const ag_fund_valuation = Math.round((ag_fund_net_value*(ag_future_averge_price/ag_future_previous_settlement_price)) * 10e3) / 10e3
         const ag_fund_valuation_premium = Math.round((ag_fund_price/ag_fund_valuation - 1) * 10000)/100 + '%'
        this.tableData.push({
          date,
          ag_future_previous_settlement_price,
          ag_future_averge_price,
          ag_future_price,
          ag_future_distance: ag_future_price - ag_future_previous_settlement_price,
          ag_fund_net_value,
          ag_fund_price,
          ag_fund_valuation,
          ag_fund_valuation_premium,
        })
      })
  }
}
</script>

<style>
html, body{
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
    background-color: #409EFF;
    color: #FFF;
    text-align: center;
    line-height: 60px;
  }
</style>
