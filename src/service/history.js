import { get, post } from '@/utils/api'

// 获取门禁进出记录分页列表
export const GetAccessControlPageList = (params) => post('/api/AccessControl/GetAccessControlPageList', params)
// 获取门禁进出记录
export const GetAccessControlInfo = (params) => get('/api/AccessControl/GetAccessControlInfo', params)
// 获取采集信息分页列表
export const GetCollectionPageList = (params) => post('/api/Collection/GetCollectionPageList', params)
// 读取采集曲线
export const GetCollectionLine = (params) => post('/api/Collection/GetCollectionLine', params)
