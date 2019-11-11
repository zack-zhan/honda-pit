<template>
  <div class="login">
    <img src="@/assets/images/bg.png" alt="">
    <div class="left fl">
      <div class="text">
        <div>冲压二科</div>
        <div>智慧门禁管理系统</div>
        <div>Smart access control system</div>
      </div>
    </div>
    <div class="right fr">
      <div class="box">
        <div class="logo">
          <img src="../assets/images/广汽本田官方网站logo.png" alt="">
        </div>
        <a-form
          :form="form"
          @submit="handleSubmit"
        >
          <a-form-item>
            <a-input
              v-decorator="[
                'loginName',
                { rules: [{ required: true, message: '请输入用户' }] }
              ]"
              placeholder="用户"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'loginPwd',
                { rules: [{ required: true, message: '请输入密码' },{min:6, message: '密码不能少于6个字符'},{max:128, message: '密码不能大于128个字符'}] }
              ]"
              type="password"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              style="width:100%"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { authenticate } from '@/service/login'
import Utils from '@/utils/utils'
export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.loginPwd = Utils.encrypt(values.loginPwd)
          authenticate(values)
            .then(res => {
              if (res.errorCode === 200) {
                localStorage.setItem('name', values.loginName)
                localStorage.setItem('token', res.body.token)
                localStorage.setItem('roleId', res.body.roleId)
                this.$router.push('/')
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  // background: url('../assets/images/bg.png') no-repeat;
  // background-size: 100% 100%;
  position: relative;
  img{
    width: 100%;
    height: 100%;
    float: left;
  }
  .left{
    width: 50%;
    position: absolute;
    top: 205px;
    .text{
      width: 400px;
      height: 160px;
      font-family:PingFangSC;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin: 0 auto;
      div:nth-child(1){
        font-size: 34px;
        line-height:48px;
        display: inline-block;
        border-bottom: 1px solid #fff;
      }
      div:nth-child(2){
        font-size: 50px;
        margin: 20px 0;
      }
      div:nth-child(3){
        font-size: 22px;
      }
    }
  }
  .right{
    width: 50%;
    position: absolute;
    top: 135px;
    right: 0;
    .box{
      width:432px;
      height:480px;
      background:rgba(255,255,255,1);
      border-radius:8px;
      margin: 0 auto;
      padding: 0 32px;
      .logo{
        padding-top: 70px;
        padding-bottom: 60px;
      }
    }
  }
}
</style>

<style scoped>
.login >>> .ant-input{
  height: 40px;
  line-height: 40px;
}
.login >>> .ant-btn-primary{
  height: 40px;
  line-height: 40px;
  background: #CA001C;
  border: none;
}
</style>
