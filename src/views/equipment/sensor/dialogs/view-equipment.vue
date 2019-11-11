<template>
  <div class="dialogBox">
    <div>设备编号：<span>{{data.deviceNo}}</span></div>
    <div>设备名称：<span>{{data.sensorName}}</span></div>
    <div>设备类型：<span>{{data.sensorType === 1?'氧气含量传感器':'温湿度传感器'}}</span></div>
    <div v-if="data.sensorType === 1">
      <div>报警阀值上限：<span>{{data.thresholdMax}}</span></div>
      <div>报警阀值下限：<span>{{data.thresholdMin}}</span></div>
      <div>校正系数：<span>{{data.checkValue}}</span></div>
    </div>
    <div v-else>
      <div>温度阀值上限：<span>{{data.thresholdMax}}</span></div>
      <div>温度阀值下限：<span>{{data.thresholdMin}}</span></div>
      <div>温度校正系数：<span>{{data.checkValue}}</span></div>
      <div>湿度阀值上限：<span>{{data.thresholdMax2}}</span></div>
      <div>湿度阀值下限：<span>{{data.thresholdMin2}}</span></div>
      <div>湿度校正系数：<span>{{data.checkValue2}}</span></div>
    </div>
    <div>网络地址：<span>{{data.networkAddress}}</span></div>
    <div>采集时间：<span>{{data.acquisitionInterval}}分钟</span></div>
    <div>启用状态：<span :class="data.enableStatus === 0?'red':'blue'">{{data.enableStatus === 0?'禁用':'启用'}}</span></div>
  </div>
</template>

<script>
import { GetSensorInfo } from '@/service/equipment'
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
        sensorID: this.id
      }
      GetSensorInfo(params)
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
