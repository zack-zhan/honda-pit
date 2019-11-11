<template>
  <div class="container">
    <div class="titlebar">
      <div><span>门禁管理</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>作业登记</span></div>
      <div>作业登记</div>
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
      </a-row>
      <a-row style="margin-top:24px;">
        <a-col :span="6">
          <span>公司名称：</span>
          <a-input placeholder="单行输入" v-model="constructionEnterprises" />
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
          <a-button style="margin-left:5px" @click="reset">重置</a-button>
        </a-col>
      </a-row>
      <a-button class="btn" style="margin-top:24px">
        <router-link to="/addWorkorder">＋ 添加工单</router-link>
      </a-button>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="jobRegistrationID"
        @change="onChange"
        :pagination="{
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
      >
        <template slot="completeStatus" slot-scope="text">
          <div>
            <i :class="text.completeStatus==='完成'?'gray':'blue'"></i>
            {{text.completeStatus}}
          </div>
        </template>
        <template slot="action" slot-scope="text,record">
          <div class="action">
            <span v-if="text.completeStatus!=='完成'">
              <a href="javascript:;" @click="edit(text,record,)">编辑</a>
              <a-divider type="vertical" />
            </span>
            <a href="javascript:;" @click="view(text,record,)">查看</a>
            <span v-if="text.completeStatus!=='完成'">
              <a-divider type="vertical" />
              <a-popconfirm title="您确定要删除吗?" @confirm="del(text,record)" okText="确定" cancelText="取消">
                <a href="javascript:;" class="del">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { GetJobRegistrationPageList, DelJobRegistration } from '@/service/forbid'
import { GetPitList } from '@/service/equipment'

import { AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'

moment.locale('zh-cn')
export default {
  data () {
    return {
      zhCN,

      columns: [{
        title: '作业项目',
        dataIndex: 'jobItems'
      }, {
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '公司名称',
        dataIndex: 'constructionEnterprises'
      }, {
        title: '紧急联系电话',
        dataIndex: 'cellPhone'
      }, {
        title: '人数',
        dataIndex: 'staffTotal'
      }, {
        title: '登记时间',
        dataIndex: 'registrationTime'
      }, {
        title: '工作状态',
        scopedSlots: { customRender: 'completeStatus' }
      }, {
        title: '操作',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],
      pitData: [
        {pitID: '', pitName: '请选择'}
      ],

      currentPage: 1,
      pageSize: 10,
      total: 0,

      pitID: '',
      jobItems: '',
      constructionEnterprises: '',
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
    Warning
  },
  methods: {
    // 获取列表
    list () {
      const params = {
        pitID: this.pitID,
        jobItems: this.jobItems,
        constructionEnterprises: this.constructionEnterprises,
        jobStartTime: this.jobStartTime,
        jobEndTime: this.jobEndTime,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      GetJobRegistrationPageList(params)
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
      this.jobStartTime = ''
      this.jobEndTime = ''
      this.date = []
      this.list()
    },

    // 编辑
    edit (row) {
      this.$router.push({path: '/editWorkorder', query: {id: row.jobRegistrationID}})
    },
    // 查看
    view (row) {
      this.$router.push({path: '/viewWorkorder', query: {id: row.jobRegistrationID}})
    },
    // 删除
    del (row) {
      const params = {
        jobRegistrationID: row.jobRegistrationID
      }
      DelJobRegistration(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.$message.success('删除成功')
            this.list()
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
  i{
    display: inline-block;
    width:6px;
    height:6px;
    border-radius: 100%;
    margin-right: 8px;
  }
  .gray{
    background:rgba(0,0,0,0.25);
  }
  .blue{
    background:rgba(24,144,255,1);
  }
  .action{
    color: #1890FF;
    .del{
      color: #CA001C;
    }
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
