<template>
  <div class="container">
    <div class="titlebar">
      <div><span>设备管理</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>设备编组</span></div>
      <div>设备编组</div>
    </div>
    <div class="table">
      <a-button class="btn" @click="addMarshallingVisible = true">＋ 添加编组</a-button>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="groupId"
        @change="onChange"
        :pagination="{
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
      >
        <template slot="state" slot-scope="text">
          <div>
            <i :class="text.state==='禁用'?'red':'blue'"></i>
            {{text.state}}
          </div>
        </template>
        <template slot="action" slot-scope="text,record">
          <div class="action">
            <a href="javascript:;" @click="edit(text,record,)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="view(text,record,)">查看</a>
            <a-divider type="vertical" />
            <a-popconfirm title="您确定要删除吗?" @confirm="del(text,record)" okText="确定" cancelText="取消">
              <a href="javascript:;" class="del">删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 添加编组弹框组件 -->
    <a-modal
      title="添加编组"
      v-model="addMarshallingVisible"
      width="652px"
      :closable="false"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="back" @click="cancel">取消</a-button>
        <a-button class="btn" @click="step = 1" v-if="step === 0">下一步</a-button>
        <a-button class="btn" @click="step = 0" v-if="step === 1">上一步</a-button>
        <a-button key="submit" class="btn" @click="addSave = !addSave" v-if="step === 1">保存</a-button>
      </template>
      <AddMarshalling :step="step" :save="addSave" :visible="addMarshallingVisible" @success="success"></AddMarshalling>
    </a-modal>
    <!-- 编辑编组弹框组件 -->
    <a-modal
      title="编辑编组"
      v-model="editMarshallingVisible"
      width="652px"
      :closable="false"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="back" @click="cancel">取消</a-button>
        <a-button class="btn" @click="step = 1" v-if="step === 0">下一步</a-button>
        <a-button class="btn" @click="step = 0" v-if="step === 1">上一步</a-button>
        <a-button key="submit" class="btn" @click="editSave = !editSave" v-if="step === 1">保存</a-button>
      </template>
      <EditMarshalling :step="step" :id="id" :save="editSave" :visible="editMarshallingVisible" @success="success"></EditMarshalling>
    </a-modal>
    <!-- 查看编组弹框组件 -->
    <a-modal
      title="查看编组"
      v-model="viewMarshallingVisible"
      okText="保存"
      cancelText="取消"
      width="437px"
    >
      <template slot="footer">
        <a-button @click="cancel">取消</a-button>
      </template>
      <ViewMarshalling :id="id" :visible="viewMarshallingVisible"></ViewMarshalling>
    </a-modal>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import AddMarshalling from './dialogs/add-marshalling'
import EditMarshalling from './dialogs/edit-marshalling'
import ViewMarshalling from './dialogs/view-marshalling'
import { GetDeviceGroupPageList, DelDeviceGroup } from '@/service/equipment'

import { AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'
export default {
  data () {
    return {
      columns: [{
        title: '编组名称',
        dataIndex: 'deviceGroupName'
      }, {
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '修改时间',
        dataIndex: 'updateStr'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],

      addMarshallingVisible: false,
      editMarshallingVisible: false,
      viewMarshallingVisible: false,
      step: 0,
      addSave: false,
      editSave: false,
      id: 0,

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
    AddMarshalling,
    EditMarshalling,
    ViewMarshalling,
    Warning
  },
  methods: {
    // 获取列表
    list () {
      const params = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      GetDeviceGroupPageList(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.total = res.body.dataTotal
            this.data = res.body.dtoList
          }
        })
    },

    // 编辑
    edit (row) {
      this.editMarshallingVisible = true
      this.id = row.groupId
    },
    // 查看
    view (row) {
      this.viewMarshallingVisible = true
      this.id = row.groupId
    },
    // 删除
    del (row) {
      const params = {
        deviceGroupID: row.groupId
      }
      DelDeviceGroup(params)
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
    // 取消
    cancel () {
      this.addMarshallingVisible = false
      this.editMarshallingVisible = false
      this.step = 0
      this.viewMarshallingVisible = false
    },
    // 成功操作
    success () {
      this.addMarshallingVisible = false
      this.editMarshallingVisible = false
      this.step = 0
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
</style>
