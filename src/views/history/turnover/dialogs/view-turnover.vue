<template>
  <div class="dialogBox">
    <div class="left fl">
      <div>姓名：<span>{{data.name}}</span></div>
      <div>公司：<span>{{data.constructionEnterprises}}</span></div>
      <div>作业项目：<span>{{data.jobItems}}</span></div>
      <br>
      <div>刷卡位置：<span>{{data.position}}</span></div>
      <div>预期开始时间：<span>{{data.jobStartTime}}</span></div>
      <div>氧气浓度：<span>{{data.oxygen}}</span></div>
      <br>
      <div>授权人：<span>{{data.authorizer}}</span></div>
    </div>
    <div class="right fr">
      <div>手机号：<span>{{data.cellphone}}</span></div>
      <div>地坑名称：<span>{{data.pitName}}</span></div>
      <div style="margin-bottom:73px"></div>
      <div>刷卡状态：<span>{{data.entryType}}</span></div>
      <div>预期结束时间：<span>{{data.jobEndTime}}</span></div>
      <div>刷卡时间：<span>{{data.entryLeaveTime}}</span></div>
    </div>
  </div>
</template>

<script>
import { GetAccessControlInfo } from '@/service/history'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      data: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.list()
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      const params = {
        id: this.id
      }
      GetAccessControlInfo(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.data = res.body
          }
        })
    }
  },
  mounted () {
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.dialogBox{
  margin-left: 30px;
  overflow: hidden;
  .left,.right{
    width: 50%;
  }
  div{
    margin-bottom: 16px;
    color:rgba(0,0,0,0.45);
    span{
      color: #000;
    }
  }
}
</style>
