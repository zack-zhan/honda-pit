<template>
  <div class="container">
    <div class="titlebar">
      <div><span>历史记录</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>地坑采集记录</span></div>
      <div>地坑采集记录</div>
    </div>
    <div class="table">
      <a-row>
        <a-col :span="6">
          <span>地坑名称：</span>
          <a-select placeholder="请选择" v-model="pitID">
            <a-select-option v-for="item in pitData" :key="item.pitID" :value="item.pitID">{{item.pitName}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <span>设备类型：</span>
          <a-select placeholder="请选择" v-model="sensorType">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="1">氧气含量传感器</a-select-option>
            <a-select-option :value="2">温湿度传感器</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="margin-top:24px;">
        <a-col :span="6">
          <span>采集类型：</span>
          <a-select placeholder="请选择" v-model="collectionType">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="1">氧气含量</a-select-option>
            <a-select-option :value="2">温度</a-select-option>
            <a-select-option :value="3">湿度</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="10">
          <span>采集时间：</span>
          <a-locale-provider :locale="zhCN">
            <a-range-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              @change="selectDate"
              v-model="date"
            />
          </a-locale-provider>
        </a-col>
        <a-col :span="4">
          <a-button class="btn" @click="search">查询</a-button>
          <a-button style="margin:0 5px" @click="download">导出</a-button>
          <a-button @click="reset">重置</a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="collectionRecordID"
        @change="onChange"
        :pagination="{
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
      />
    </div>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { GetCollectionPageList } from '@/service/history'
import { GetPitList } from '@/service/equipment'

import { AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'
import qs from 'qs'

moment.locale('zh-cn')
export default {
  data () {
    return {
      zhCN,

      columns: [{
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '类型',
        dataIndex: 'sensorType'
      }, {
        title: '采集类型',
        dataIndex: 'collectionType'
      }, {
        title: '采集数据',
        dataIndex: 'collectedData'
      }, {
        title: '校正系数',
        dataIndex: 'checkValue'
      }, {
        title: '采集时间',
        dataIndex: 'collectionTime'
      }],
      data: [],
      pitData: [
        {pitID: '', pitName: '请选择'}
      ],

      currentPage: 1,
      pageSize: 10,
      total: 0,

      pitID: '',
      sensorType: '',
      collectionType: '',
      collectionBeginTime: '',
      collectionEndTime: '',
      date: [],

      show: false,
      alarm: null,
      alarmMsg: '',
      recordIDs: []
    }
  },
  components: {
    Warning
  },
  methods: {
    // 获取列表
    list () {
      const params = {
        pitID: this.pitID,
        sensorType: this.sensorType,
        collectionType: this.collectionType,
        collectionBeginTime: this.collectionBeginTime,
        collectionEndTime: this.collectionEndTime,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      GetCollectionPageList(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.total = res.body.dataTotal
            this.data = res.body.dtoList
          }
        })
    },
    // 获取地坑列表
    pitList () {
      GetPitList()
        .then(res => {
          if (res.errorCode === 200) {
            res.body.pits.map(item => {
              this.pitData.push(item)
            })
          }
        })
    },
    selectDate (date, dateString) {
      console.log(date, dateString)
      this.date = date
      this.collectionBeginTime = dateString[0]
      this.collectionEndTime = dateString[1]
    },
    // 查询
    search () {
      this.currentPage = 1
      this.list()
    },
    // 重置
    reset () {
      this.pitID = ''
      this.sensorType = ''
      this.collectionType = ''
      this.collectionBeginTime = ''
      this.collectionEndTime = ''
      this.date = []
      this.list()
    },
    // 导出
    download () {
      const params = {
        pitID: this.pitID,
        sensorType: this.sensorType,
        collectionType: this.collectionType,
        collectionBeginTime: this.collectionBeginTime,
        collectionEndTime: this.collectionEndTime
      }
      window.location.href = `http://192.168.0.105:5000/api/Excel/GetCollectionList?${qs.stringify(params)}`
    },

    // 分页、筛选、排序
    onChange (pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter)
      this.currentPage = pagination.current
      this.pageSize = pagination.pageSize
      this.list()
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
    this.list()
    this.pitList()

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
.table{
  margin: 24px;
  padding: 24px 32px;
  background: #fff;
}
.btn{
  background:rgba(202,0,28,1);
  color: #fff;
}
.btn:hover, .btn:focus{
  background: rgba(202,0,28,1);
  border-color: #CA001C;
  color: #fff;
}
</style>

<style scoped>
.table >>> .ant-table {
  margin-top: 24px;
}
.container >>> .ant-input,.ant-select{
  width: calc(100% - 122px);
  margin-right: 48px;
}
.container >>> .ant-calendar-picker{
  width: calc(100% - 122px);
}
.container >>> .ant-calendar-picker .ant-input{
  width: 100%;
}
</style>
