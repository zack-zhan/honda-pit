<template>
  <div class="container">
    <div class="titlebar">
      <div><span>历史记录</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>地坑采集曲线图</span></div>
      <div>地坑采集曲线图</div>
    </div>
    <div class="chartBox">
      <a-locale-provider :locale="zhCN" style="margin-bottom:24px;">
        <a-range-picker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          @change="onChange"
        />
      </a-locale-provider>
      <div class="chart" ref="chart1"></div>
      <div class="chart" ref="chart2"></div>
      <div class="chart" ref="chart3"></div>
    </div>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { GetCollectionLine } from '@/service/history'

import { AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'

moment.locale('zh-cn')
var echarts = require('echarts')
export default {
  data () {
    return {
      zhCN,

      beginTime: '',
      endTime: '',

      data1: [],
      data2: [],
      data3: [],
      series1: [],
      series2: [],
      series3: [],

      show: false,
      alarm: null,
      alarmMsg: '',
      recordIDs: []
    }
  },
  components: {
    Warning
  },
  computed: {
    option1 () {
      const that = this
      return {
        // 默认色板
        color: ['#55CFD2', '#BFAEE1', '#7DC0F0'],
        title: {
          text: '氧气浓度',
          textStyle: {
            color: '#50ADDA'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: that.data1.legent
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.data1.axis
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: that.series1
      }
    },
    option2 () {
      const that = this
      return {
        // 默认色板
        color: ['#55CFD2', '#BFAEE1', '#7DC0F0'],
        title: {
          text: '温度监控',
          textStyle: {
            color: '#50ADDA'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: that.data2.legent
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.data2.axis
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} ℃'
          }
        },
        series: that.series2
      }
    },
    option3 () {
      const that = this
      return {
        // 默认色板
        color: ['#55CFD2', '#BFAEE1', '#7DC0F0'],
        title: {
          text: '湿度监控',
          textStyle: {
            color: '#50ADDA'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: that.data3.legent
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.data3.axis
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %RH'
          }
        },
        series: that.series3
      }
    }
  },
  methods: {
    onChange (date, dateString) {
      console.log(date, dateString)
      this.beginTime = dateString[0]
      this.endTime = dateString[1]
      this.list()
    },
    // 获取列表
    list () {
      const params = {
        beginTime: this.beginTime,
        endTime: this.endTime
      }
      GetCollectionLine(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.data1 = res.body.lines[0]
            this.data2 = res.body.lines[1]
            this.data3 = res.body.lines[2]
            this.series1 = []
            this.series2 = []
            this.series3 = []
            this.data1.collectionDatas.map(item => {
              this.series1.push({
                name: item.pitName,
                type: 'line',
                data: item.datas
              })
            })
            this.data2.collectionDatas.map(item => {
              this.series2.push({
                name: item.pitName,
                type: 'line',
                data: item.datas
              })
            })
            this.data3.collectionDatas.map(item => {
              this.series3.push({
                name: item.pitName,
                type: 'line',
                data: item.datas
              })
            })
            echarts.init(this.$refs.chart1).setOption(this.option1)
            echarts.init(this.$refs.chart2).setOption(this.option2)
            echarts.init(this.$refs.chart3).setOption(this.option3)
          }
        })
    },

    // 获取监控
    getAlaram () {
      AlaramAlert()
        .then(res => {
          if (res.errorCode === 200) {
            this.recordIDs = []
            if (res.body.length === 1) {
              this.show = true
              res.body.map((item, index) => {
                this.recordIDs.push(item.recordID)
                this.alarmMsg = item.alarmMsg
              })
            } else if (res.body.length > 1) {
              this.show = true
              res.body.map((item, index) => {
                this.recordIDs.push(item.recordID)
                if (index === res.body.length - 1) {
                  this.alarmMsg = item.alarmMsg
                }
              })
            } else {
              this.show = false
            }
          }
        })
    },
    // 关闭监控
    closeAlarm () {
      const params = {
        recordIDs: this.recordIDs
      }
      CloseAlaramAlert(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.show = false
          }
        })
    }
  },
  mounted () {
    this.beginTime = moment().format('YYYY-MM-DD') + ' 00:00:00'
    const date = new Date()
    const Y = date.getFullYear()
    let M = date.getMonth() + 1
    M = M < 10 ? ('0' + M) : M
    let D = date.getDate()
    D = D < 10 ? ('0' + D) : D
    this.endTime = Y + '-' + M + '-' + D + ' 23:59:59'
    this.list()

    this.alarm = setInterval(() => {
      this.getAlaram()
    }, 5000)
  },
  beforeDestroy () {
    if (this.alarm) { // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.alarm) // 关闭
    }
  }
}
</script>

<style lang="scss" scoped>
.titlebar{
  height: 98px;
  background: #fff;
  margin-top: 1px;
  padding-left: 32px;
  div:nth-child(1){
    padding: 16px 0;
    span:nth-child(1){
      font-family:PingFangSC;
      font-weight:400;
      color:rgba(0,0,0,0.45);
      line-height:22px;
    }
    span:nth-child(2){
      font-family:PingFangSC;
      font-weight:400;
      color:rgba(0,0,0,0.65);
      line-height:22px;
    }
  }
  div:nth-child(2){
    font-size:20px;
    font-family:PingFangSC;
    font-weight:500;
    color:#000000;
    line-height:28px;
  }
}
.chartBox{
  margin: 24px;
  padding: 24px 32px;
  background: #fff;
  .chart{
    width: 100%;
    height: 332px;
    padding-top: 10px;
    margin-bottom: 24px;
  }
}
</style>
