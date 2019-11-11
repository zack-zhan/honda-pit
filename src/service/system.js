import { get, post, del } from '@/utils/api'

// 获取用户分页列表
export const GetUserPageList = (params) => post('/api/User/GetUserPageList', params)
// 添加用户
export const AddUser = (params) => post('/api/User/AddUser', params)
// 获取用户详情
export const GetUserInfo = (params) => get('/api/User/GetUserInfo', params)
// 更新用户
export const UpdateUser = (params) => post('/api/User/UpdateUser', params)
// 删除用户
export const DelUser = (params) => del('/api/User/DelUser', params)
// 获取用户列表
export const GetRoleList = (params) => get('/api/User/GetRoleList', params)
