<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
    class="form"
  >
    <a-form-item
      label="编组名称："
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'deviceGroupName',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.deviceGroupName}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="地坑选择："
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
    <a-select
        v-decorator="[
          'pitID',
          {rules: [{ required: true, message: '请选择' }],initialValue: data.pitID}
        ]"
        placeholder="请选择"
      >
        <a-select-option v-for="item in pitData" :key="item.pitID" :value="item.pitID">{{item.pitName}}</a-select-option>
      </a-select>
    </a-form-item>
    <div class="step">
      <a-steps :current="step">
        <a-step title="设备选择"/>
        <a-step title="终端主机选择"/>
      </a-steps>
      <a-locale-provider :locale="zhCN" v-if="step === 0">
        <a-transfer
          :dataSource="mockData"
          :titles="['未选设备', '已选设备']"
          :targetKeys="targetKeys"
          @change="handleChange"
          :render="item=>item.title"
        />
      </a-locale-provider>
      <a-form-item
        label="终端主机："
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        v-else
      >
      <a-select
          v-decorator="[
            'terminalID',
            {rules: [{ required: true, message: '请选择' }],initialValue: isHost}
          ]"
          placeholder="请选择"
        >
          <a-select-option v-for="item in terminalData" :key="item.key" :value="item.key">{{item.title}}</a-select-option>
        </a-select>
      </a-form-item>
    </div>
  </a-form>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

import { GetPitList, GetDeviceList, GetDeviceGroupInfo, UpdateDeviceGroup } from '@/service/equipment'
moment.locale('zh-cn')
export default {
  props: {
    step: {
      type: Number,
      required: true
    },
    save: {
      type: Boolean,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      zhCN,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      data: [],
      pitData: [],

      mockData: [],
      targetKeys: [],

      sensorKeys: [],
      terminalKeys: [],
      terminalData: [],
      isHost: ''
    }
  },
  watch: {
    save (val) {
      this.handleSubmit()
    },
    visible (val) {
      this.form = this.$form.createForm(this)
      this.targetKeys = []
      this.sensorKeys = []
      this.terminalKeys = []
      this.terminalData = []
      if (val) {
        this.pitList()
        this.equipmentList()
        this.list()
      }
    },
    step (val) {
      if (val === 1) {
        this.terminalData = this.mockData.filter(x => this.terminalKeys.findIndex(y => x.key === y) !== -1)
        console.log(this.terminalData, '--')
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      const params = {
        deviceGroupID: this.id
      }
      GetDeviceGroupInfo(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.data = res.body
            this.data.sensorList.map(x => {
              const item = '1' + x.sensorID.toString()
              this.targetKeys.push(item)
            })
            this.data.terminalList.map(x => {
              const item = '2' + x.terminalID.toString()
              this.targetKeys.push(item)
              if (x.isHost === 1) {
                this.isHost = '2' + x.terminalID.toString()
              }
            })
            this.targetKeys.map(item => {
              if (item[0] === '2') {
                this.terminalKeys.push(item)
              } else {
                this.sensorKeys.push(item)
              }
            })
            console.log(this.targetKeys, '66')
          }
        })
    },

    // 获取地坑列表
    pitList () {
      GetPitList()
        .then(res => {
          if (res.errorCode === 200) {
            this.pitData = res.body.pits
          }
        })
    },
    // 获取设备列表
    equipmentList () {
      const params = {
        groupId: this.id
      }
      GetDeviceList(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.mockData = res.body.devices.map(x => {
              let str = x.deviceType.toString() + x.deviceId.toString()
              return {
                key: str,
                title: x.deviceName
              }
            })
            console.log(this.mockData, '00')
          }
        })
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
      this.terminalKeys = []
      this.sensorKeys = []
      this.targetKeys.map(item => {
        if (item[0] === '2') {
          this.terminalKeys.push(item)
        } else {
          this.sensorKeys.push(item)
        }
        if (this.terminalKeys.length === 0) {
          this.isHost = ''
        }
      })
    },

    // 确定
    handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const sensorList = this.mockData.filter(x => this.sensorKeys.findIndex(y => x.key === y) !== -1).map(item => {
            return {
              sensorID: item.key.substr(1)
            }
          })
          const terminalList = this.mockData.filter(x => this.terminalKeys.findIndex(y => x.key === y) !== -1).map(item => {
            return {
              terminalID: item.key.substr(1)
            }
          })
          terminalList.map(item => {
            if (item.terminalID === values.terminalID.substr(1)) {
              item.isHost = 1
            }
          })
          const params = {
            deviceGroupID: this.id,
            deviceGroupName: values.deviceGroupName,
            pitID: values.pitID,
            sensorList: sensorList,
            terminalList: terminalList
          }
          console.log(params, '!!!!')
          UpdateDeviceGroup(params)
            .then(res => {
              if (res.errorCode === 200) {
                this.$message.success('保存成功')
                this.$emit('success')
              }
            })
        }
      })
    }
  },
  mounted () {
    this.pitList()
    this.equipmentList()
    this.list()
  }
}
</script>

<style lang="scss" scoped>
.step{
  margin: 0 40px;
}
</style>

<style scoped>
.form >>> .ant-input,.ant-select{
  width: 244px;
}
.form >>> .ant-transfer-list{
  width: 230px;
}
.form >>> .ant-steps{
  margin-bottom: 40px;
}
</style>
