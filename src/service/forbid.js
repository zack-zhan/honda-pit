import { get, post, del } from '@/utils/api'

// 获取作业登记分页列表
export const GetJobRegistrationPageList = (params) => post('/api/JobRegistration/GetJobRegistrationPageList', params)
// 添加作业登记
export const AddJobRegistration = (params) => post('/api/JobRegistration/AddJobRegistration', params)
// 获取作业登记详情
export const GetJobRegistrationInfo = (params) => get('/api/JobRegistration/GetJobRegistrationInfo', params)
// 更新作业登记
export const UpdateJobRegistration = (params) => post('/api/JobRegistration/UpdateJobRegistration', params)
// 删除作业登记
export const DelJobRegistration = (params) => del('/api/JobRegistration/DelJobRegistration', params)
// 人员销卡
export const JobRegistrationCancel = (params) => post('/api/JobRegistration/JobRegistrationCancel', params)
