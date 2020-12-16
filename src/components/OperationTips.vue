<template>
    <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="10" :xs="{span: 22}">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>操作提示</span>
        </div>
        <div :class="['premium', (premium[0]==='-')?'red':'green']">
          溢价: {{premium}}
        </div>
        <div class="realtime-premium">
          <el-tooltip effect="dark" content="实验性功能，公式为：期货现价 / 期货昨天结算价 * 基金昨天净值" placement="top">
            <i class="el-icon-info" />
          </el-tooltip>
    盘中期货映射估值: <span>{{future_mapping_valuation}} {{future_mapping_valuation_premium}}</span>
        </div>
         <div class="tips">
          操作: {{tips}}
        </div>
    </el-card>
      </el-col>
  </el-row>
</template>

<script>
export default {
  name: "operation-tips",
  props: {
    premium: String,
    future_mapping_valuation: Number,
    future_mapping_valuation_premium: String,
    tips: String,
  }
};
</script>

<style scoped>
.row-bg {
  margin-top: 30px;
}
.box-card {
  margin-bottom: 15px;
}
.premium {
  font-size: 40px;
  font-weight: bold;
  line-height: 2;
}
.tips {
  font-size: 28px;
  font-weight: bold;
  line-height: 2;
}
.red {
  color: #f56c6c;
}
.green {
  color: #67c23a;
}
.realtime-premium {
  font-size: 20px;
  color: dimgray;
}
.realtime-premium > span {
  font-weight: bold;
}
.realtime-premium > i {
  margin-right: 2px;
}
</style>
