import request from '@/utils/request'

// 查询问卷列表
export function listQuestions(query) {
  return request({
    url: '/getQuestions',
    method: 'get',
    params: query
  })
}

// 查询问卷（指标）分组
export function listQuotaGroups(query) {
  return request({
    url: '/getQuotaGroups',
    method: 'get',
    params: query
  })
}

// 查询指标得分
export function listQuotaRates(query) {
  return request({
    url: '/getQuotaRates',
    method: 'get',
    params: query
  })
}

// 查询区域信息
export function getAreaInfo(query) {
  return request({
    url: '/getAreaInfo',
    method: 'get',
    params: query
  })
}

// 查询区域信息
export function getAreaByName(query) {
  return request({
    url: '/getAreaByName',
    method: 'get',
    params: query
  })
}

// 新增参数配置
export function addAnswer(data) {
  return request({
    url: '/addQuotas',
    method: 'post',
    data: data
  })
}


// 新增参数配置
export function changePassword(data) {
  return request({
    url: '/changePassword',
    method: 'post',
    data: data
  })
}