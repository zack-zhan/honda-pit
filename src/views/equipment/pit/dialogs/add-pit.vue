<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
    class="form"
  >
    <a-form-item
      label="地坑名称："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'pitName',
          {rules: [{ required: true, message: '请输入地坑名称' }]}
        ]"
        placeholder="请输入地坑名称"
      />
    </a-form-item>
    <a-form-item
      label="地坑描述："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'description'
        ]"
        placeholder="请输入地坑描述"
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
          {rules: [{ required: true, message: '请输入位置' }]}
        ]"
        placeholder="请输入位置"
      />
    </a-form-item>
    <a-form-item
      label="是否启用："
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
import { AddPit } from '@/service/equipment'
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

      data: []
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
    // 确定
    handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          AddPit(values)
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
