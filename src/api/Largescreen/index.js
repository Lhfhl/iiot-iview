
import * as API from './api'

export const paramType = {
  'big1': '/bigscreen/countDeviceNum', // 设备总览
  'big2': '/bigscreen/environmentNum', // 环境参数
  'big3': '/bigscreen/sbtx', // 设备提醒
  'big4': '/bigscreen/alarmNum', // 次数
  'big5': '/bigscreen/information', // 实时预警
  'big6': '/bigscreen/producePlan' // 生产安排
  // 'big7': '/bigscreen/information', // 订单信息
  // 'big8': '/bigscreen/centermap'// //中间地图

}
/** ****************      通用增删改查       ********************* */
/**
 * 通用列表
 * @param {*} param
 */
export const currentList = (key, param) => {
  return API.GET(paramType[key] + '/list', param)
}
export const currentPage = (key, param) => {
  return API.GET(paramType[key] + '/page', param)
}
/**
 * 查询可选择的列表
 * @param {*} param
 */
export const currentSelectList = (key, param) => {
  return API.GET(paramType[key] + '/selectList', param)
}

/**
 * 通用新增
 * @param {*} param
 */
export const currentSave = (key, param) => {
  return API.POST(paramType[key] + '/save', param)
}
/**
 * 通用修改
 * @param {*} param
 */
export const currentUpdate = (key, param) => {
  return API.POST(paramType[key] + '/update', param)
}

/**
 * 通用删除
 * @param {*} param
 */
export const currentDelete = (key, param) => {
  return API.POST(paramType[key] + '/delete', param)
}

/**
 * 通用获取所有不分页
 * @param {*} param
 */
export const currentSelect = (key, param) => {
  return API.GET(paramType[key] + '/select', param)
}

/**
 * 通用GET
 * @param {*} param
 */
export const currentGET = (key, param) => {
  return API.GET(paramType[key], param)
}
/**
 * 通用POST
 * @param {*} param
 */
export const currentPOST = (key, param) => {
  return API.POST(paramType[key], param)
}
// 通用接口集合
export const currentApi = {
  currentList,
  currentPage,
  currentSave,
  currentUpdate,
  currentDelete,
  currentSelect,
  currentSelectList,
  currentPOST,
  currentGET
}
