<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
    class="form"
  >
    <a-form-item
      label="设备编号："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'deviceNo',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.deviceNo}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="设备名称："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'terminalName',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.terminalName}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="设备描述："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'description',
          {initialValue: data.description}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="位置："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'position',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.position}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="启用状态："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
    <a-select
        v-decorator="[
          'enableStatus',
          {rules: [{ required: true, message: '请选择' }],initialValue: data.enableStatus}
        ]"
        placeholder="请选择"
      >
        <a-select-option :value="1">启用</a-select-option>
        <a-select-option :value="0">禁用</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="DTU地址："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'dtuAddress',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.dtuAddress}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { GetTerminalInfo, UpdateTerminal } from '@/service/equipment'
export default {
  props: {
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
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      data: []
    }
  },
  watch: {
    save (val) {
      this.handleSubmit()
    },
    visible (val) {
      this.form = this.$form.createForm(this)
      if (val) {
        this.list()
      }
    }
  },
  methods: {
    // 获取详情
    list () {
      const params = {
        terminalID: this.id
      }
      GetTerminalInfo(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.data = res.body
          }
        })
    },

    // 确定
    handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.terminalID = this.id
          const params = values
          UpdateTerminal(params)
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
    this.list()
  }
}
</script>

<style scoped>
.form >>> .ant-input{
  width: 244px;
}
.form >>> .ant-select{
  width: 244px;
}
</style>
