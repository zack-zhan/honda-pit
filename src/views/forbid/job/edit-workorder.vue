<template>
  <div class="container">
    <div class="titlebar">
      <div>
        <span>门禁管理</span>&nbsp;&nbsp;/&nbsp;&nbsp;
        <span><router-link to="/job">作业登记</router-link></span>&nbsp;&nbsp;/&nbsp;&nbsp;
        <span>添加工单</span>
      </div>
      <div>工单登记</div>
    </div>
    <div class="message">
      <div class="title">作业信息</div>
      <a-row style="padding: 24px 32px;">
        <a-col :span="6">
          <span>作业项目：</span>
          <a-input placeholder="请输入" v-model="jobItems" />
        </a-col>
        <a-col :span="10">
          <span>作业时间：</span>
          <a-locale-provider :locale="zhCN">
            <a-range-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              @change="selectDate"
              v-model="jobTime"
            />
          </a-locale-provider>
        </a-col>
        <a-col :span="6">
          <span>地坑选择：</span>
          <a-select placeholder="请选择" v-model="pitID" @change="handleChange">
            <a-select-option v-for="item in pitData" :key="item.pitID" :value="item.pitID">{{item.pitName}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="padding: 0px 32px">
        <a-col :span="6">
          <span>施工公司：</span>
          <a-input placeholder="请输入" v-model="constructionEnterprises" />
        </a-col>
        <a-col :span="8">
          <span>紧急联系电话：</span>
          <a-input placeholder="请输入" v-model="cellPhone" />
        </a-col>
      </a-row>
    </div>
    <div class="table">
      <div class="title">人员列表</div>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="cardNo"
        :pagination="false"
      >
        <template slot="action" slot-scope="text, record,index">
          <div class="action">
            <a-divider type="vertical" />
            <a-popconfirm title="您确定要删除吗?" @confirm="del(text,record,index)" okText="确定" cancelText="取消">
              <a href="javascript:;" class="del">删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
      <div class="add" @click="addMemberVisible = true">＋ 新增成员</div>
    </div>
    <div class="footer">
      <div class="btnBox">
        <a-button style="margin-right:5px;"><router-link to="/job">取消</router-link></a-button>
        <a-button class="btn" @click="submit">提交</a-button>
      </div>
    </div>

    <!-- 添加人员弹框组件 -->
    <a-modal
      title="添加人员"
      v-model="addMemberVisible"
      width="437px"
    >
      <a-form
        :form="form"
        @submit="handleSubmit"
        class="form"
      >
        <a-form-item
          label="姓名："
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'staffName',
              {rules: [{ required: true, message: '请输入' }]}
            ]"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          label="卡号："
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'cardNo',
              {rules: [{ required: true, message: '请输入' }]}
            ]"
            placeholder="请输入"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="addMemberVisible = false">取消</a-button>
        <a-button key="submit" class="btn" @click="save">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

import { GetJobRegistrationInfo, UpdateJobRegistration } from '@/service/forbid'
import { GetPitList } from '@/service/equipment'

moment.locale('zh-cn')
export default {
  data () {
    return {
      zhCN,

      columns: [{
        title: '姓名',
        dataIndex: 'staffName'
      }, {
        title: '卡号',
        dataIndex: 'cardNo'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],
      pitData: [],
      detailData: [],

      addMemberVisible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      currentPage: 1,
      pageSize: 10,
      total: 30,

      jobItems: '',
      jobStartTime: '',
      jobEndTime: '',
      pitID: '',
      constructionEnterprises: '',
      cellPhone: '',

      jobTime: []
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

            const jobTime = []
            jobTime.push(moment(new Date(res.body.jobStartTime)))
            jobTime.push(moment(new Date(res.body.jobEndTime)))
            this.jobTime = jobTime
            this.jobStartTime = moment(res.body.jobStartTime).format('YYYY-MM-DD HH:mm:ss')
            this.jobEndTime = moment(res.body.jobEndTime).format('YYYY-MM-DD HH:mm:ss')
            console.log(this.jobStartTime, '0--')
            console.log(this.jobEndTime, '0--')

            this.pitID = res.body.pitID
            this.constructionEnterprises = res.body.constructionEnterprises
            this.cellPhone = res.body.cellPhone
            this.data = res.body.staffList
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
      this.jobStartTime = dateString[0]
      this.jobEndTime = dateString[1]
    },
    handleChange (value) {
      console.log(`selected ${value}`)
      this.pitID = value
    },
    // 保存添加人员
    save () {
      this.handleSubmit()
    },
    handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          // let isPush = true
          // this.data.map(item => {
          //   if (item.cardNo === values.cardNo) {
          //     this.$message.error('卡号重复')
          //     isPush = false
          //   }
          // })
          // if (isPush) {
          this.data.push(values)
          this.addMemberVisible = false
          this.form = this.$form.createForm(this)
          // }
        }
      })
    },
    // 删除
    del (text, record, index) {
      this.data.splice(index, 1)
    },

    submit () {
      const params = {
        jobRegistrationID: this.$route.query.id,
        jobItems: this.jobItems,
        jobStartTime: this.jobStartTime,
        jobEndTime: this.jobEndTime,
        pitID: this.pitID,
        constructionEnterprises: this.constructionEnterprises,
        cellPhone: this.cellPhone,
        staffList: this.data
      }
      UpdateJobRegistration(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.$message.success('保存成功')
            this.$router.push('/job')
          }
        })
    }
  },
  mounted () {
    this.pitList()
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
  .action{
    color: #CA001C;
  }
  .add{
    margin: 0 32px;
    border-radius:4px;
    border:1px dashed rgba(217,217,217,1);
    height: 32px;
    line-height:32px;
    text-align: center;
    font-size:14px;
    font-family:PingFangSC;
    font-weight:400;
    color:rgba(0,0,0,0.65);
    cursor: pointer;
  }
}
.table{
  margin-bottom: 80px;
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
  margin: 24px 32px;
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
.form >>> .ant-input{
  width: 244px;
}
.form >>> .ant-select{
  width: 244px;
}
</style>
