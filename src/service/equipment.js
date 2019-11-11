import { get, post, del } from '@/utils/api'

// 获取地坑分页列表
export const GetPitPageList = (params) => post('/api/Pit/GetPitPageList', params)
// 获取地坑分页列表
export const GetPitList = (params) => get('/api/DeviceGroup/GetPitList', params)
// 添加地坑
export const AddPit = (params) => post('/api/Pit/AddPit', params)
// 获取地坑详情
export const GetPitInfo = (params) => get('/api/Pit/GetPitInfo', params)
// 更新地坑
export const UpdatePit = (params) => post('/api/Pit/UpdatePit', params)
// 删除地坑
export const DelPit = (params) => del('/api/Pit/DelPit', params)

// 获取传感器分页列表
export const GetSensorPageList = (params) => post('/api/Sensor/GetSensorPageList', params)
// 添加传感器
export const AddSensor = (params) => post('/api/Sensor/AddSensor', params)
// 获取传感器详情
export const GetSensorInfo = (params) => get('/api/Sensor/GetSensorInfo', params)
// 更新传感器
export const UpdateSensor = (params) => post('/api/Sensor/UpdateSensor', params)
// 删除传感器
export const DelSensor = (params) => del('/api/Sensor/DelSensor', params)

// 获取终端机分页列表
export const GetTerminalPageList = (params) => post('/api/Terminal/GetTerminalPageList', params)
// 添加终端机
export const AddTerminal = (params) => post('/api/Terminal/AddTerminal', params)
// 获取终端机详情
export const GetTerminalInfo = (params) => get('/api/Terminal/GetTerminalInfo', params)
// 更新终端机
export const UpdateTerminal = (params) => post('/api/Terminal/UpdateTerminal', params)
// 删除终端机
export const DelTerminal = (params) => del('/api/Terminal/DelTerminal', params)

// 获取设备编组分页列表
export const GetDeviceGroupPageList = (params) => post('/api/DeviceGroup/GetDeviceGroupPageList', params)
// 获取设备列表
export const GetDeviceList = (params) => get('/api/DeviceGroup/GetDeviceList', params)
// 添加设备分组
export const AddDeviceGroup = (params) => post('/api/DeviceGroup/AddDeviceGroup', params)
// 获取设备分组详情
export const GetDeviceGroupInfo = (params) => get('/api/DeviceGroup/GetDeviceGroupInfo', params)
// 更新设备分组
export const UpdateDeviceGroup = (params) => post('/api/DeviceGroup/UpdateDeviceGroup', params)
// 删除设备分组
export const DelDeviceGroup = (params) => del('/api/DeviceGroup/DelDeviceGroup', params)

// 获取报警分页列表
export const GetAlarmPageList = (params) => post('/api/Alarm/GetAlarmPageList', params)
