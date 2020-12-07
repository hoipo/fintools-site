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
         <div class="tips">
          操作: {{tips}}
        </div>
    </el-card>
      </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'operation-tips',
  props: {
    premium: String,
    tips: String,
  }
}
</script>

<style scoped>
  .row-bg{
    margin-top: 30px;
  }
  .box-card{
  margin-bottom: 15px;
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
