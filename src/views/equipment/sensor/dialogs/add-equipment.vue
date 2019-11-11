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
          {rules: [{ required: true, message: '请输入' }]}
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
          'sensorName',
          {rules: [{ required: true, message: '请输入' }]}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="设备类型："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-select
        v-decorator="[
          'sensorType',
          {rules: [{ required: true, message: '请选择' }]}
        ]"
        placeholder="请选择"
        @change="handleChange"
      >
        <a-select-option :value="1">氧气含量传感器</a-select-option>
        <a-select-option :value="2">温湿度传感器</a-select-option>
      </a-select>
    </a-form-item>
    <div v-if="value === 1">
      <a-form-item
        label="报警阀值上限："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'thresholdMax',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="报警阀值下限："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'thresholdMin',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="校正系数："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'checkValue',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
    </div>
    <div v-else>
      <a-form-item
        label="温度阀值上限："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'thresholdMax',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="温度阀值下限："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'thresholdMin',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="温度校正系数："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'checkValue',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="湿度阀值上限："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'thresholdMax2',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="湿度阀值下限："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'thresholdMin2',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
      <a-form-item
        label="湿度校正系数："
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'checkValue2',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="请输入"
          type="number"
        />
      </a-form-item>
    </div>
    <a-form-item
      label="网络地址："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'networkAddress',
          {rules: [{ required: true, message: '请输入' }]}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="采集间隔："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input-number
        v-decorator="[
          'acquisitionInterval',
          {rules: [{ required: true, message: '请选择' },{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '不能为0或者负数' }]}
        ]"
      />&nbsp;&nbsp;分钟
    </a-form-item>
    <a-form-item
      label="启用状态："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
    <a-select
        v-decorator="[
          'enableStatus',
          {rules: [{ required: true, message: '请选择' }]}
        ]"
        placeholder="请选择"
      >
        <a-select-option :value="1">启用</a-select-option>
        <a-select-option :value="0">禁用</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import { AddSensor } from '@/service/equipment'
export default {
  props: {
    save: {
      type: Boolean,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),

      data: [],
      value: 1
    }
  },
  watch: {
    save (val) {
      this.handleSubmit()
    },
    visible (val) {
      this.form = this.$form.createForm(this)
    }
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
      if (value === 1) {
        this.value = 1
      } else {
        this.value = 2
      }
    },
    // 确定
    handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          AddSensor(values)
            .then(res => {
              if (res.errorCode === 200) {
                this.$message.success('保存成功')
                this.$emit('success')
              }
            })
        }
      })
    }
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
