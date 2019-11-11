<template>
  <div class="container">
    <div class="titlebar">
      <div><span>设备管理</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span>地坑管理</span></div>
      <div>地坑管理</div>
    </div>
    <div class="table">
      <a-button class="btn" @click="addPitVisible = true">＋ 添加地坑</a-button>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="pitID"
        @change="onChange"
        :pagination="{
          total: total,
          current: currentPage,
          pageSize: pageSize
        }"
      >
        <template slot="enableStatusStr" slot-scope="text">
          <div>
            <i :class="text.enableStatusStr==='禁用'?'red':'blue'"></i>
            {{text.enableStatusStr}}
          </div>
        </template>
        <template slot="action" slot-scope="text,record">
          <div class="action">
            <a href="javascript:;" @click="edit(text,record,)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="您确定要删除吗?" @confirm="del(text,record)" okText="确定" cancelText="取消">
              <a href="javascript:;" class="del">删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 添加地坑弹框组件 -->
    <a-modal
      title="添加地坑"
      v-model="addPitVisible"
      width="437px"
    >
      <template slot="footer">
        <a-button key="back" @click="addPitVisible = false">取消</a-button>
        <a-button key="submit" class="btn" @click="addSave = !addSave">保存</a-button>
      </template>
      <AddPit :save="addSave" :visible="addPitVisible" @success="success"></AddPit>
    </a-modal>
    <!-- 编辑地坑弹框组件 -->
    <a-modal
      title="编辑地坑"
      v-model="editPitVisible"
      @ok="save = !save"
      okText="保存"
      cancelText="取消"
      width="437px"
    >
      <template slot="footer">
        <a-button key="back" @click="editPitVisible = false">取消</a-button>
        <a-button key="submit" class="btn" @click="editSave = !editSave">保存</a-button>
      </template>
      <EditPit :save="editSave" :id="id" :visible="editPitVisible" @success="success"></EditPit>
    </a-modal>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import AddPit from './dialogs/add-pit'
import EditPit from './dialogs/edit-pit'
import { GetPitPageList, DelPit } from '@/service/equipment'

import { AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'
export default {
  data () {
    return {
      columns: [{
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '描述',
        dataIndex: 'description'
      }, {
        title: '状态',
        scopedSlots: { customRender: 'enableStatusStr' }
      }, {
        title: '修改时间',
        dataIndex: 'update'
      }, {
        title: '操作',
        scopedSlots: { customRender: 'action' }
      }],
      data: [],

      addPitVisible: false,
      editPitVisible: false,
      addSave: false,
      editSave: false,
      id: '',

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
    AddPit,
    EditPit,
    Warning
  },
  methods: {
    // 获取列表
    list () {
      const params = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }
      GetPitPageList(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.total = res.body.dataTotal
            this.data = res.body.dtoList
          }
        })
    },

    // 编辑
    edit (row) {
      this.id = row.pitID
      this.editPitVisible = true
    },
    // 删除
    del (row) {
      const params = {
        pitID: row.pitID
      }
      DelPit(params)
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
    // 成功操作
    success () {
      this.addPitVisible = false
      this.editPitVisible = false
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
