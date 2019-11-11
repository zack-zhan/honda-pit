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
          {rules: [{ required: true, message: '请输入地坑名称' }],initialValue: data.pitName}
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
          'description',
          {initialValue: data.description}
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
          {rules: [{ required: true, message: '请输入位置' }],initialValue: data.position}
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
          {rules: [{ required: true, message: '请选择' }],initialValue: data.enableStatus}
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
import { GetPitInfo, UpdatePit } from '@/service/equipment'
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
      console.log(val, '--')
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
        pitID: this.id
      }
      GetPitInfo(params)
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
          values.pitID = this.id
          const params = values
          UpdatePit(params)
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
