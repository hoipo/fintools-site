<template>
  <div id="app">
     <el-container>
      <el-header>白银基金套利工具</el-header>
      
      <el-main>
        <el-row type="flex" justify="end">
          <el-col :span=4>
            <el-switch
              v-model="autoUpdate"
              active-text="自动刷新">
            </el-switch>
          </el-col>
        </el-row>
      

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
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="12">
      <el-card class="box-card grid-content bg-purple">
        <div slot="header" class="clearfix">
          <span>操作提示</span>
        </div>
        <div :class="['premium', (premium[0]==='-')?'red':'green']">
          溢价: {{premium}}
        </div>
         <div class="tips">
          操作: {{tips}}
        </div>
    </el-card>
      </el-col>
  </el-row>
    

      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
        return {
          tableData: [],
          premium: '-',
          tips: '-',
          autoUpdate: window.localStorage.getItem('autoUpdate') === '1' ? true : false
        }
      },
  mounted(){
    this.fetchData()
    setInterval(() => {
      if (this.autoUpdate) this.fetchData()
    }, 10000);
  },
  methods:{
    fetchData(){
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
         const data = {
            date,
            ag_future_previous_settlement_price,
            ag_future_averge_price,
            ag_future_price,
            ag_future_distance: ag_future_price - ag_future_averge_price,
            ag_fund_net_value,
            ag_fund_price,
            ag_fund_valuation,
            ag_fund_valuation_premium,
          }
        if (this.tableData.length === 0) {
          this.tableData.push(data)
        } else {
          this.tableData.splice(0,1, data)
        }
        this.premium = ag_fund_valuation_premium
        if (parseFloat(ag_fund_valuation_premium) >= 0.5) {
          this.tips = "卖出+申购"
        } else if (parseFloat(ag_fund_valuation_premium) <= -2) {
          this.tips = "买入+赎回(不满7天也赎回)"
        } else if (parseFloat(ag_fund_valuation_premium) <= -1) {
          this.tips = "买入+赎回(满7天才赎回)"
        } else {
          this.tips = "无操作"
        }
      })
    }
  },
  watch: {
    autoUpdate: function (newValue) {
      if (newValue) {
        window.localStorage.setItem('autoUpdate', '1')
      } else {
        window.localStorage.setItem('autoUpdate', '0')
      }
    }
  },
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
    clear: both
  }

  .row-bg{
    margin-top: 30px;
  }
  .premium{
    font-size: 40px;
    font-weight: bold;
    line-height: 2;
  }
  .tips{
    font-size: 28px;
    font-weight: bold;
    line-height: 2;
  }
  .red{
    color: #F56C6C;
  }
  .green{
    color: #67C23A;
  }

</style>
