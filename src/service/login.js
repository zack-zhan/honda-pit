import { post } from '@/utils/api'

// 登录获取token
export const authenticate = (params) => post('/api/Authentication/authenticate', params)
