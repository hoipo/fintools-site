<template>
  <div id="app">
     <el-container>
      <el-header>白银基金套利工具</el-header>
      
      <el-main>
        <el-row type="flex" justify="space-between">
          <el-col :span=8 class="updatetime">
            数据更新于：{{time}}
          </el-col>
          <el-col :span=8 class="autoupdate-switch">
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
    <el-col :span="10" :xs="{span: 22}">
      <el-card class="box-card">
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
    <el-button @click="setSubscribe" type="primary" round>订阅提醒</el-button>
      </el-main>
    </el-container>
     <el-dialog
      title="设置提醒"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <el-form label-width="80px">
        <el-form-item label="溢价阈值">
          <el-input-number
        class="tips-input"
        v-model="subscribe.upper"
         :precision="1" 
         :step="0.1" 
         :max="10" 
         :min="0"
         :disabled="!subscribe.on"
         ></el-input-number> %
      </el-form-item>
        <el-form-item label="折价阈值">
         <el-input-number
      class="tips-input"
        v-model="subscribe.lower"
         :precision="1" 
         :step="0.1" 
         :max="0" 
         :min="-10"
         :disabled="!subscribe.on"
         ></el-input-number> %
      </el-form-item>
        <el-form-item label="开关">
         <el-switch
          v-model="subscribe.on">
        </el-switch>
      </el-form-item>
    </el-form>
   
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">完成</el-button>
      </span>
    </el-dialog>
  </div>

  
</template>



<script>
import { Message } from "element-ui";
export default {
  name: 'App',
  data() {
        return {
          subscribe: {
            on: window.localStorage.getItem('subscribe') === '1' ? true : false,
            upper: window.localStorage.getItem('upper') ? Number(window.localStorage.getItem('upper')) : 1,
            lower: window.localStorage.getItem('upper') ? Number(window.localStorage.getItem('lower')) : -1
          },
          dialogVisible: false,
          tableData: [],
          premium: '-',
          tips: '-',
          autoUpdate: window.localStorage.getItem('autoUpdate') === '1' ? true : false,
          time: '-'
        }
      },
  mounted(){
    this.fetchData()
    setInterval(() => {
      if (this.autoUpdate) this.fetchData()
    }, 30000);
    window.sound = new Audio();
                window.sound.src = require('./assets/notice.mp3')
  },
  methods:{
    popNotice(msg) {
            if (Notification.permission === "granted") {
                new Notification(msg, {
                    body: `操作：${this.tips}`,
                    icon: require('./assets/notice.png')
                });
                
                window.sound.play()
            }    
    },
    setSubscribe(){
      if (window.Notification) {
          switch (Notification.permission) {
            case "granted":
              this.dialogVisible = true
              break;
          case "denied":
              alert('浏览器禁止了Notification提示，请授权')
              break;
            default:
              Notification.requestPermission().then(() => {
                this.setSubscribe()
              });
              break;
          }
    } else {
        alert('浏览器不支持Notification');    
    }
    },
    fetchData(){
      fetch('http://119.27.188.244/api/get_live_data_of_ag')
      .then(response => response.json())
      .then(({
        date,
        ag_future_previous_settlement_price,
        ag_future_price,
        ag_fund_net_value,
        ag_future_averge_price,
        ag_fund_price,
        time
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
        if (time) {
          this.time = time
        }
        if (this.tableData.length === 0) {
          this.tableData.push(data)
        } else {
          this.tableData.splice(0,1, data)
          Message({
            message:'数据已自动更新',
            center: true,
            type: 'success',
            duration: 1000
            })
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
        // 弹出提醒
        if (this.subscribe.on) {
          if (parseFloat(ag_fund_valuation_premium) >= this.subscribe.upper) {
            this.popNotice(
              `溢价已达${ag_fund_valuation_premium}`
              )
          } else if (parseFloat(ag_fund_valuation_premium) <= this.subscribe.lower) {
            this.popNotice(
              `折价已达${ag_fund_valuation_premium}`
              )
          }
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
    },
    'subscribe.on': function (newValue) {
       if (newValue) {
        window.localStorage.setItem('subscribe', '1')
      } else {
        window.localStorage.setItem('subscribe', '0')
      }
    },
    dialogVisible: function (newValue) {
      if (!newValue) {
        window.localStorage.setItem('upper', this.subscribe.upper)
        window.localStorage.setItem('lower', this.subscribe.lower)
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
.updatetime{
  text-align: left;
  font-size: 13px;
}
.autoupdate-switch{
  text-align: right;
}
.box-card{
  margin-bottom: 15px;
}
.el-form-item__content{
  text-align: left;
}
</style>
