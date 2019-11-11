import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Index from '@/layouts/index'

import Monitoring from '@/views/monitoring' // PC监控
import FullScreen from '@/views/fullScreen' // PC监控-全屏

import Pit from '@/views/equipment/pit/index' // 设备管理-地坑管理
import Sensor from '@/views/equipment/sensor/index' // 设备管理-传感器管理
import Terminal from '@/views/equipment/terminal/index' // 设备管理-终端机管理
import Marshalling from '@/views/equipment/marshalling/index' // 设备管理-设备编组
import Alarm from '@/views/equipment/alarm/index' // 设备管理-报警记录

import Job from '@/views/forbid/job/index' // 门禁管理-作业登记
import AddWorkorder from '@/views/forbid/job/add-workorder' // 门禁管理-作业登记-添加工单
import EditWorkorder from '@/views/forbid/job/edit-workorder' // 门禁管理-作业登记-编辑工单
import ViewWorkorder from '@/views/forbid/job/view-workorder' // 门禁管理-作业登记-查看工单

import User from '@/views/system/user/index' // 系统管理-用户管理

import Turnover from '@/views/history/turnover/index' // 历史记录-门禁进出记录
import Gather from '@/views/history/gather/index' // 历史记录-地坑采集记录
import Graph from '@/views/history/graph/index' // 历史记录-地坑采集曲线图

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: Login,
      component: Login
    },
    { path: '/fullScreen', name: 'FullScreen', component: FullScreen },
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: { path: 'monitoring' },
      children: [
        { path: 'monitoring', name: 'Monitoring', component: Monitoring },

        { path: 'pit', name: 'Pit', component: Pit },
        { path: 'sensor', name: 'Sensor', component: Sensor },
        { path: 'terminal', name: 'Terminal', component: Terminal },
        { path: 'marshalling', name: 'Marshalling', component: Marshalling },
        { path: 'alarm', name: 'Alarm', component: Alarm },

        { path: 'job', name: 'Job', component: Job },
        { path: 'addWorkorder', name: 'AddWorkorder', component: AddWorkorder },
        { path: 'editWorkorder', name: 'EditWorkorder', component: EditWorkorder },
        { path: 'viewWorkorder', name: 'ViewWorkorder', component: ViewWorkorder },

        { path: 'user', name: 'User', component: User },

        { path: 'turnover', name: 'Turnover', component: Turnover },
        { path: 'gather', name: 'Gather', component: Gather },
        { path: 'graph', name: 'Graph', component: Graph }
      ]
    }
  ]
})
