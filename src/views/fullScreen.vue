<template>
  <div class="container">
    <div class="time">
      当前时间:{{formatTime}}
      <a-button class="fr">
        <router-link to="/">关闭</router-link>
      </a-button>
    </div>
    <a-row :gutter="24" style="color:#fff;">
      <a-col :span="8">
        <div class="box green_box" style="background:rgba(47,194,91,0.2)">
          <div class="title"><img src="../assets/images/能源管理库-66能源图标-氧气.png" alt="">氧气含量</div>
          <div class="piece">
            <div v-for="item in oxygenGroup" :key="item.index">
              <span>{{item.pitName}}:</span>
              <span>{{item.collectionData}}</span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="box yellow_box" style="background:rgba(250,204,20,0.2);">
          <div class="title"><img src="../assets/images/温度.png" alt="">温度</div>
          <div class="piece">
            <div v-for="item in temperatureGroup" :key="item.index">
              <span>{{item.pitName}}:</span>
              <span>{{item.collectionData}}</span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="box blue_box" style="background:rgba(24,144,255,0.2);">
          <div class="title"><img src="../assets/images/湿度.png" alt="">湿度</div>
          <div class="piece">
            <div v-for="item in humidityGroup" :key="item.index">
              <span>{{item.pitName}}:</span>
              <span>{{item.collectionData}}</span>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="table">
      <a-table
        :columns="columns"
        :dataSource="data"
      >
        <template slot="areaStatus" slot-scope="text">
          <div>
            <i :class="text.areaStatus==='禁入'?'red':'green'"></i>
            {{text.areaStatus}}
          </div>
        </template>
        <template slot="jobStatus" slot-scope="text">
          <div>
            <i :class="text.jobStatus==='超时'?'red':'blue'"></i>
            {{text.jobStatus}}
          </div>
        </template>
      </a-table>
    </div>

    <!-- 报警组件 -->
    <Warning v-if="show" :message="alarmMsg" @close="closeAlarm"></Warning>
  </div>
</template>

<script>
import moment from 'moment'

import { Index, AlaramAlert, CloseAlaramAlert } from '@/service/monitoring'
import Warning from '@/components/warning'
export default {
  data () {
    return {
      columns: [{
        title: '地坑名称',
        dataIndex: 'pitName'
      }, {
        title: '区域状态',
        scopedSlots: { customRender: 'areaStatus' }
      }, {
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '作业项目',
        dataIndex: 'jobItems'
      }, {
        title: '进入时间',
        dataIndex: 'entryTime'
      }, {
        title: '作业时长',
        dataIndex: 'jobInteral'
      }, {
        title: '作业状态',
        scopedSlots: { customRender: 'jobStatus' }
      }],
      data: [],

      formatTime: '',

      oxygenGroup: [],
      temperatureGroup: [],
      humidityGroup: [],

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
    // 获取实时时间
    getDate () {
      setInterval(() => {
        this.formatTime = moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },
    // 获取列表
    list () {
      Index()
        .then(res => {
          if (res.errorCode === 200) {
            this.data = res.body.jobRegistrations
            this.oxygenGroup = res.body.oxygenGroup
            this.temperatureGroup = res.body.temperatureGroup
            this.humidityGroup = res.body.humidityGroup
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
    this.getDate()
    this.list()

    this.alarm = setInterval(() => {
      this.list()
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
.container{
  width: 100%;
  background: #000;
  padding: 24px;
  min-height: 100vh;
  .time{
    font-size:16px;
    font-family:PingFangSC;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:22px;
    margin-bottom: 24px;
  }
  .box{
    border-radius:2px;
    padding: 24px;
    .title{
      height: 30px;
      font-size:18px;
      font-family:PingFangSC;
      font-weight:400;
      line-height:30px;
      img{
        margin-right: 9px;
      }
    }
    .piece{
      margin-top: 24px;
      div{
        display: inline-block;
        font-size:22px;
        font-family:PingFangSC;
        font-weight:400;
        line-height:30px;
        span:nth-child(2){
          color: #D4D7D9;
        }
      }
      div:nth-child(odd){
        margin-right: 48px;
      }
    }
  }
  .green_box{
    .title{
      color: #2FC25B;
    }
    .piece{
      div{
        span:nth-child(1){
          color: #2FC25B;
        }
      }
    }
  }
  .yellow_box{
    .title{
      color: #FACC14;
    }
    .piece{
      div{
        span:nth-child(1){
          color: #FACC14;
        }
      }
    }
  }
  .blue_box{
    .title{
      color: #1890FF;
    }
    .piece{
      div{
        span:nth-child(1){
          color: #1890FF;
        }
      }
      div:nth-child(odd){
        margin-right: 17px;
      }
    }
  }
  .table{
    margin-top: 32px;
    padding: 24px 32px;
    background:rgba(255,255,255,0.06);
    border-radius:2px;
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
    .green{
      background:rgba(47,194,91,1);
    }
    .blue{
      background:rgba(24,144,255,1);
    }
  }
}
</style>

<style scoped>
.table >>> .ant-table-thead{
  border-radius:4px 4px 0px 0px;
}
.table >>> .ant-table-thead th{
  background:rgba(250,250,250,0.06);
  font-family:PingFangSC;
  font-weight:500;
  color:rgba(212,215,217,1);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.table >>> .ant-table-tbody td{
  font-family:PingFangSC;
  font-weight:400;
  color:rgba(212,215,217,1);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.table >>> .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
  background: none;
}
.table >>> .ant-table-placeholder {
  background:rgba(250,250,250,0.06);
  border-bottom-color: rgba(250,250,250,0.06);
  color: #fff;
}
</style>
