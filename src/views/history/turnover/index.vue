<template>
  <div class="container">
    <div class="titlebar">
      <div><span>历史记录</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>门禁进出记录</span></div>
      <div>门禁进出记录</div>
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
          <span>作业项目：</span>
          <a-input placeholder="单行输入" v-model="jobItems" />
        </a-col>
        <a-col :span="6">
          <span>公司名称：</span>
          <a-input placeholder="单行输入" v-model="constructionEnterprises" />
        </a-col>
      </a-row>
      <a-row style="margin-top:24px;">
        <a-col :span="6">
          <span>姓名输入：</span>
          <a-input placeholder="单行输入" v-model="name"/>
        </a-col>
        <a-col :span="10">
          <span>作业时间：</span>
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
        rowKey="id"
        @change="onChange"
        :pagination="{
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
      >
        <template slot="action" slot-scope="text,record">
          <div class="action">
            <a href="javascript:;" @click="view(text,record,)">查看</a>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 查看详情弹框组件 -->
    <a-modal
      title="查看详情"
      v-model="viewTurnoverVisible"
      width="641px"
    >
      <template slot="footer">
        <a-button key="back" @click="viewTurnoverVisible = false">取消</a-button>
      </template>
      <viewTurnover :id="id" :visible="viewTurnoverVisible"></viewTurnover>
    </a-modal>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import viewTurnover from './dialogs/view-turnover'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { GetAccessControlPageList } from '@/service/history'
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
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '作业项目',
        dataIndex: 'jobItems'
      }, {
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '氧气浓度',
        dataIndex: 'oxygen'
      }, {
        title: '刷卡位置',
        dataIndex: 'position'
      }, {
        title: ' 刷卡时间',
        dataIndex: 'entryLeaveTime'
      }, {
        title: '刷卡状态',
        dataIndex: 'entryType'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],
      pitData: [
        {pitID: '', pitName: '请选择'}
      ],

      viewTurnoverVisible: false,
      id: '',

      currentPage: 1,
      pageSize: 10,
      total: 0,

      pitID: '',
      jobItems: '',
      constructionEnterprises: '',
      name: '',
      jobStartTime: '',
      jobEndTime: '',
      date: [],

      show: false,
      alarm: null,
      alarmMsg: '',
      recordIDs: []
    }
  },
  components: {
    viewTurnover,
    Warning
  },
  methods: {
    // 获取列表
    list () {
      const params = {
        pitID: this.pitID,
        jobItems: this.jobItems,
        constructionEnterprises: this.constructionEnterprises,
        name: this.name,
        jobStartTime: this.jobStartTime,
        jobEndTime: this.jobEndTime,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      GetAccessControlPageList(params)
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
      this.jobStartTime = dateString[0]
      this.jobEndTime = dateString[1]
    },
    // 查询
    search () {
      this.currentPage = 1
      this.list()
    },
    // 重置
    reset () {
      this.pitID = ''
      this.jobItems = ''
      this.constructionEnterprises = ''
      this.name = ''
      this.jobStartTime = ''
      this.jobEndTime = ''
      this.date = []
      this.list()
    },
    // 导出
    download () {
      const params = {
        pitID: this.pitID,
        jobItems: this.jobItems,
        constructionEnterprises: this.constructionEnterprises,
        name: this.name,
        jobStartTime: this.jobStartTime,
        jobEndTime: this.jobEndTime
      }
      window.location.href = `http://192.168.0.105:5000/api/Excel/GetAccessControlList?${qs.stringify(params)}`
    },

    // 查看
    view (row) {
      this.viewTurnoverVisible = true
      this.id = row.id
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
  .action{
    color: #1890FF;
  }
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
