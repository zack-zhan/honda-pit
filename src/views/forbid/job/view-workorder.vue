<template>
  <div class="container">
    <div class="titlebar">
      <div>
        <span>门禁管理</span>&nbsp;&nbsp;/&nbsp;&nbsp;
        <span><router-link to="/job">作业登记</router-link></span>&nbsp;&nbsp;/&nbsp;&nbsp;
        <span>查看工单</span>
      </div>
      <div>工单登记</div>
    </div>
    <div class="message">
      <div class="title">作业信息</div>
      <a-row style="padding: 24px 32px;">
        <a-col :span="6">
          <span>作业项目：{{jobItems}}</span>
        </a-col>
        <a-col :span="8">
          <span>作业时间：{{jobTime}}</span>
        </a-col>
        <a-col :span="6">
          <span>地坑选择：{{pitName}}</span>
        </a-col>
      </a-row>
      <a-row style="padding: 0px 32px">
        <a-col :span="6">
          <span>施工公司：{{constructionEnterprises}}</span>
        </a-col>
        <a-col :span="8">
          <span>紧急联系电话：{{cellPhone}}</span>
        </a-col>
        <a-col :span="6">
          <span>状态：<span class="blue">{{completeStatus === 1?'完成':'未完成'}}</span></span>
        </a-col>
      </a-row>
    </div>
    <div class="table">
      <div class="title">人员列表</div>
      <div class="total">
        <a-icon type="info-circle" class="icon" />已选择<span class="textBlue"> {{selectedRowKeys.length}} </span>项
        <span style="margin-left:20px;">总计：</span>{{data.length}} 项<span class="cancel" @click="cancel">批量销卡</span>
      </div>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="staffID"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.cancelCard === 1
            }
          })
        }"
        :pagination="false"
      >
        <template slot="isExpires" slot-scope="text">
          <div>
            <i :class="text.isExpires==='超时'?'red':'blue'"></i>
            {{text.isExpires}}
          </div>
        </template>
        <template slot="action" slot-scope="text,record">
          <div class="action">
            <a href="javascript:;" @click="cancel(text,record)" v-if="text.cancelCard === 0">销卡</a>
            <a href="javascript:;" style="color:rgba(0,0,0,0.25);" v-else>已销卡</a>
          </div>
        </template>
      </a-table>
    </div>
    <div class="footer">
      <div class="btnBox">
        <a-button style="margin-right:5px;"><router-link to="/job">关闭</router-link></a-button>
        <a-button class="btn" :disabled="disabled"><router-link to="/job">完成</router-link></a-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { GetJobRegistrationInfo, JobRegistrationCancel } from '@/service/forbid'
export default {
  data () {
    return {
      columns: [{
        title: '姓名',
        dataIndex: 'staffName'
      }, {
        title: '卡号',
        dataIndex: 'cardNo'
      }, {
        title: '进入时间',
        dataIndex: 'entryTime'
      }, {
        title: '离开时间',
        dataIndex: 'leaveTime'
      }, {
        title: '是否超时',
        scopedSlots: { customRender: 'isExpires' }
      }, {
        title: '操作',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],
      selectedRowKeys: [],

      jobItems: '',
      jobTime: '',
      pitName: '',
      constructionEnterprises: '',
      cellPhone: '',
      completeStatus: ''
    }
  },
  computed: {
    disabled () {
      let disabled = false
      this.data.map(item => {
        if (item.cancelCard === 0) {
          disabled = true
        }
      })
      return disabled
    }
  },
  methods: {
    // 获取详情
    list () {
      const params = {
        jobRegistrationID: this.$route.query.id
      }
      GetJobRegistrationInfo(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.jobItems = res.body.jobItems
            this.jobTime = moment(res.body.jobStartTime).format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment(res.body.jobEndTime).format('YYYY-MM-DD HH:mm:ss')
            this.pitName = res.body.pitName
            this.constructionEnterprises = res.body.constructionEnterprises
            this.cellPhone = res.body.cellPhone
            this.completeStatus = res.body.completeStatus
            this.data = res.body.staffList
          }
        })
    },

    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    // 销卡
    cancel (row) {
      let ids = []
      if (row.staffID) {
        ids.push(row.staffID)
      } else {
        ids = this.selectedRowKeys
      }
      const params = {
        jobRegistrationID: this.$route.query.id,
        staffIDs: ids,
        compel: 0
      }
      if (params.staffIDs.length > 0) {
        var that = this
        JobRegistrationCancel(params)
          .then(res => {
            if (res.errorCode === 200) {
              that.$message.success('销卡成功')
              that.list()
              that.selectedRowKeys = []
            } else if (res.errorCode === 201) {
              that.$confirm({
                title: '人员作业中，是否强制执行销卡',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  params.compel = 1
                  JobRegistrationCancel(params)
                    .then(res => {
                      if (res.errorCode === 200) {
                        that.$message.success('销卡成功')
                        that.list()
                        that.selectedRowKeys = []
                      }
                    })
                },
                onCancel () {}
              })
            }
          })
      }
    }
  },
  mounted () {
    this.list()
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
    span{
      font-family:PingFangSC;
      font-weight:400;
      color:rgba(0,0,0,0.45);
      line-height:22px;
      cursor: pointer;
    }
    span:nth-child(3){
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
.message,.table{
  margin: 24px;
  background: #fff;
  padding-bottom: 24px;
  .title{
    font-size:16px;
    font-family:PingFangSC;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    line-height:24px;
    padding: 16px 0 15px 32px;
    border-bottom: 1px solid rgba(233,233,233,1);
  }
  .textBlue{
    color: #1890FF;
  }
  .action{
    color: #CA001C;
  }
}

.table{
  margin-bottom: 80px;
  .total{
    margin: 16px 32px;
    height: 40px;
    line-height: 40px;
    background:rgba(230,247,255,1);
    border-radius:4px;
    border:1px solid rgba(186,231,255,1);
    i{
      display: inline-block;
      width:6px;
      height:6px;
      border-radius: 100%;
      margin-right: 8px;
    }
    .red{
      background:rgba(245,34,45,1);
    }
    .blue{
      background:rgba(24,144,255,1);
    }
    .icon{
      color:#1890FF;
      margin: 0 10px
    }
    .cancel{
      margin-left:20px;
      color:#CA001C;
      cursor: pointer;
    }
  }
}
.footer{
  width: 100%;
  height:56px;
  line-height: 56px;
  background:rgba(255,255,255,1);
  box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
  position: fixed;
  bottom: 0;
  .btnBox{
    position: absolute;
    right: 280px;
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
  margin: 0px 32px 24px 32px;
}
.container >>> .ant-input,.ant-select{
  width: calc(100% - 150px);
}
.container >>> .ant-calendar-picker{
  width: calc(100% - 122px);
}
.container >>> .ant-calendar-picker .ant-input{
  width: 100%;
}
</style>
