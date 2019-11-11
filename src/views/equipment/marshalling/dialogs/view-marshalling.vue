<template>
  <div class="dialogBox">
    <div>编组名称：<span>{{data.deviceGroupName}}</span></div>
    <div>地坑选择：<span>{{data.pitName}}</span></div>
    <div>
      已选设备：<span v-for="(item,index) in selectData" :key="index">{{item}}<br></span>
    </div>
    <div>
      终端主机：<span>{{terminal}}</span>
    </div>
  </div>
</template>

<script>
import { GetDeviceGroupInfo } from '@/service/equipment'
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
      data: [],
      selectData: [],
      terminal: ''
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
        deviceGroupID: this.id
      }
      GetDeviceGroupInfo(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.data = res.body
            this.selectData = []
            res.body.sensorList.map(item => {
              this.selectData.push(item.sensorName)
            })
            res.body.terminalList.map(item => {
              if (item.isHost === 1) {
                this.terminal = item.terminalName
              } else {
                this.selectData.push(item.terminalName)
              }
            })
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
      margin-left: 70px;
    }
    span:nth-child(1){
      margin-left: 0px;
    }
  }
}
</style>
