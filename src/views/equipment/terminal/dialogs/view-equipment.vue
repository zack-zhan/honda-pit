<template>
  <div class="dialogBox">
    <div>设备编号：<span>{{data.deviceNo}}</span></div>
    <div>设备名称：<span>{{data.terminalName}}</span></div>
    <div>设备描述：<span>{{data.description}}</span></div>
    <div>位置：<span>{{data.position}}</span></div>
    <div>启用状态：<span :class="data.enableStatus === 1?'blue':'red'">{{data.enableStatus === 1?'启用':'禁用'}}</span></div>
    <div>DTU地址：<span>{{data.dtuAddress}}</span></div>
  </div>
</template>

<script>
import { GetTerminalInfo } from '@/service/equipment'
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
        terminalID: this.id
      }
      GetTerminalInfo(params)
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
  div{
    margin-bottom: 16px;
    color:rgba(0,0,0,0.45);
    span{
      color: #000;
    }
    .red{
      color: #CA001C;
    }
    .blue{
      color: #1890FF;
    }
  }
}
</style>
