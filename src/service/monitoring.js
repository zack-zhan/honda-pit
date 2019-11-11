import { get, post } from '@/utils/api'

// 获取首页列表
export const Index = (params) => get('/api/RealTime/Index', params)
// 读取报警信息
export const AlaramAlert = (params) => get('/api/RealTime/AlaramAlert', params)
// 关闭报警信息
export const CloseAlaramAlert = (params) => post('/api/RealTime/CloseAlaramAlert', params)
