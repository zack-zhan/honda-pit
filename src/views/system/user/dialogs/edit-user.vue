<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
    class="form"
  >
    <a-form-item
      label="用户名："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'loginName',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.loginName}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="姓名："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'userName',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.userName}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="手机号码："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'cellPhone',
          {rules: [{ required: true, message: '请输入' }],initialValue: data.cellPhone}
        ]"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="密码："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'loginPwd',
          {rules: [{ required: true, message: '请输入' },{min:6, message: '密码不能少于6个字符'}],initialValue: data.loginPwd}
        ]"
        type="password"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="确认密码："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'checkPwd',
          {rules: [{ required: true, message: '请输入' },{min:6, message: '密码不能少于6个字符'}],initialValue: data.checkPwd}
        ]"
        type="password"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="角色："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-select
        v-decorator="[
          'roleID',
          {rules: [{ required: true, message: '请选择' }],initialValue: data.roleID}
        ]"
        placeholder="请选择">
          <a-select-option v-for="item in roleData" :key="item.roleId" :value="item.roleId">{{item.roleName}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="状态："
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-switch
        v-model="state"
        v-decorator="[
          'enableStatus'
        ]"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { GetUserInfo, UpdateUser, GetRoleList } from '@/service/system'
import Utils from '@/utils/utils'
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

      data: [],
      roleData: [],
      state: '',
      loginPwd: '',
      checkPwd: ''
    }
  },
  watch: {
    save (val) {
      this.handleSubmit()
    },
    visible (val) {
      this.form = this.$form.createForm(this)
      if (val) {
        this.roleList()
        this.list()
      }
    }
  },
  methods: {
    // 获取角色列表
    roleList () {
      GetRoleList()
        .then(res => {
          if (res.errorCode === 200) {
            this.roleData = res.body
          }
        })
    },

    // 获取详情
    list () {
      const params = {
        userID: this.id
      }
      GetUserInfo(params)
        .then(res => {
          if (res.errorCode === 200) {
            this.data = res.body
            if (this.data.enableStatus === 1) {
              this.state = true
            } else {
              this.state = false
            }
            if (this.data.loginPwd && this.data.checkPwd) {
              this.loginPwd = this.data.loginPwd
              this.checkPwd = this.data.checkPwd
            }
            this.data.loginPwd = Utils.decrypt(res.body.loginPwd)
            this.data.checkPwd = Utils.decrypt(res.body.checkPwd)
          }
        })
    },

    // 确定
    handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.userID = this.id
          if (this.state === 1 || this.state === true) {
            values.enableStatus = 1
          } else {
            values.enableStatus = 0
          }
          values.loginPwd = Utils.encrypt(values.loginPwd)
          values.checkPwd = Utils.encrypt(values.checkPwd)
          UpdateUser(values)
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
    this.roleList()
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
