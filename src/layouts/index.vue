<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider
      :trigger="null"
      collapsible
      width = "256"
      v-model="collapsed"
      :multiple="false"
    >
      <div class="logo" >
        <span v-if="!collapsed">冲压二科|智慧门禁管理系统</span>
        <span v-else>广本</span>
      </div>
      <a-menu theme="dark" mode="inline" :openKeys="openKeys" @openChange="onOpenChange">
        <a-menu-item key="1">
          <router-link to="/monitoring">
            <a-icon type="line-chart" />
            <span>PC监控</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-for="item in menu" :key="item.title">
          <span slot="title">
            <a-icon :type="item.icon" />
            <span>{{item.title}}</span>
          </span>
          <a-menu-item v-for="children in item.children" :key="children.name">
            <router-link :to="children.path">
              <span>&nbsp;{{children.name}}</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <div class="user" v-if="name">
          <img src="../assets/images/广汽本田官方网站logo2.png" alt="">
          <img src="@/assets/images/用户.png" alt="">{{name}}，<span @click="quit">退出</span>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ background: '#F0F2F5' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data () {
    return {
      collapsed: false,

      menu: [],

      rootSubmenuKeys: [],
      openKeys: [],

      name: '',
      roleId: ''
    }
  },
  methods: {
    // 只展开当前父级菜单
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },

    // 退出
    quit () {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.name = localStorage.getItem('name')
    this.roleId = localStorage.getItem('roleId')
    if (this.roleId === '1') {
      this.menu = [
        {
          icon: 'form',
          title: '设备管理',
          children: [
            {name: '地坑管理', path: '/pit'},
            {name: '传感器管理', path: '/sensor'},
            {name: '终端机管理', path: '/terminal'},
            {name: '设备编组', path: '/marshalling'},
            {name: '报警记录', path: '/alarm'}
          ]
        },
        {
          icon: 'team',
          title: '门禁管理',
          children: [
            {name: '作业登记', path: '/job'}
          ]
        },
        {
          icon: 'setting',
          title: '系统管理',
          children: [
            {name: '用户管理', path: '/user'}
          ]
        },
        {
          icon: 'solution',
          title: '历史记录',
          children: [
            {name: '门禁进出记录', path: '/turnover'},
            {name: '地坑采集记录', path: '/gather'},
            {name: '地坑采集曲线图', path: '/graph'}
          ]
        }
      ]
      this.rootSubmenuKeys = ['PC监控', '设备管理', '门禁管理', '系统管理', '历史记录']
    } else {
      this.menu = [
        {
          icon: 'solution',
          title: '历史记录',
          children: [
            {name: '门禁进出记录', path: '/turnover'},
            {name: '地坑采集记录', path: '/gather'},
            {name: '地坑采集曲线图', path: '/graph'}
          ]
        }
      ]
      this.rootSubmenuKeys = ['历史记录']
    }
  }
}
</script>

<style>
#components-layout-demo-custom-trigger{
  height: 100vh;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}
#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  font-size:16px;
  font-family:PingFangSC;
  font-weight:400;
  color:rgba(255,255,255,1);
  padding: 0 24px;
  background: #000C17;
  box-shadow:0px 2px 6px 0px rgba(255,255,255,0.06);
  margin-bottom: 2px;
}

#components-layout-demo-custom-trigger .ant-layout-sider {
  background:#000C17;
}
#components-layout-demo-custom-trigger .ant-menu-dark{
  background:#000C17;
}
#components-layout-demo-custom-trigger .ant-layout-header{
  box-shadow:0px 1px 4px 0px rgba(0,21,41,0.12);
}
#components-layout-demo-custom-trigger .ant-menu-sub{
  background:#4B4B4B;
}
#components-layout-demo-custom-trigger .ant-menu-item-selected{
  background:#CA001C;
}
</style>

<style lang="scss" scoped>
.user{
  float: right;
  margin-right: 24px;
  font-size:14px;
  font-family:PingFangSC;
  font-weight:400;
  color:rgba(0,0,0,0.65);
  img{
    margin-right: 10px;
  }
  span{
    color:#1890FF;
    cursor: pointer;
  }
}
</style>
