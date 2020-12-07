<template>
    <el-dialog
      title="卖出申购计算器"
      :visible.sync="visible"
      width="340px"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      >
      <el-form label-width="100px">
        <el-form-item label="卖出数量(股)"
        :rules="[
        { type: 'number', message: '卖出数量必须为数字'}
        ]">
          <el-input type="number" v-model.number="form.amount" autocomplete="off" @input="onAmountChanged"></el-input>
        </el-form-item>
        <el-form-item label="申购金额">
            <el-input type="number" v-model.number="form.money" autocomplete="off" @input="onMoneyChanged"></el-input>
        </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="triggerCalculator(false)">完成</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'calculator',
  props: {
      visible: Boolean,
      triggerCalculator: Function,
      tableData: Array
  },
  data(){
      return {
          form:{
              amount: 0,
              money: 0
          }
      }
  },
  methods:{
      onAmountChanged(amount){
          this.form.money = parseInt(amount * this.tableData[0].ag_fund_valuation * 1.01)
      },
      onMoneyChanged(money){
          this.form.amount = parseInt(money / 1.01 / this.tableData[0].ag_fund_valuation)
      }
  }
}
</script>

<style scoped>
 
</style>
