<template>
  <div class="container">
    <div class="titlebar">
      <div><span>设备管理</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>报警记录</span></div>
      <div>报警记录</div>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="key"
        @change="onChange"
        :pagination="{
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
      >
        <template slot="alarmMsg" slot-scope="text">
          <div style="color:#F5222D">
            {{text.alarmMsg}}
          </div>
        </template>
      </a-table>
    </div>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import { GetAlarmPageList } from '@/service/equipment'

import { AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'
export default {
  data () {
    return {
      columns: [{
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '报警类型',
        dataIndex: 'alarmType'
      }, {
        title: '告警信息',
        scopedSlots: { customRender: 'alarmMsg' }
      }, {
        title: '状态',
        dataIndex: 'alarmStatus'
      }, {
        title: '告警时间',
        dataIndex: 'updateStr'
      }],
      data: [],

      currentPage: 1,
      pageSize: 10,
      total: 0,

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
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      GetAlarmPageList(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.total = res.body.dataTotal
            this.data = res.body.dtoList
          }
        })
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
</style>
