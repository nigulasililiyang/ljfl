import request from '@/utils/request'

// 查询门禁卡信息列表
export function listCard(query) {
  return request({
    url: '/accessController/sysAccessCard/list',
    method: 'get',
    params: query
  })
}

// 查询门禁卡信息详细
export function getCard(id) {
  return request({
    url: '/accessController/sysAccessCard/' + id,
    method: 'get'
  })
}

// 查询门禁卡信息详细
export function getCardbyCardNo(cardNo) {
  return request({
    url: '/accessController/sysAccessCard/cardno/' + cardNo,
    method: 'get'
  })
}

// 新增门禁卡信息
export function addCard(data) {
  return request({
    url: '/accessController/sysAccessCard',
    method: 'post',
    data: data
  })
}

// 修改门禁卡信息
export function updateCard(data) {
  return request({
    url: '/accessController/sysAccessCard',
    method: 'put',
    data: data
  })
}

// 删除门禁卡信息
export function delCard(id) {
  return request({
    url: '/accessController/sysAccessCard/' + id,
    method: 'delete'
  })
}

// 导出门禁卡信息
export function exportCard(query) {
  return request({
    url: '/accessController/sysAccessCard/export',
    method: 'get',
    params: query
  })
}

// 用户数据同步
export function queryUser(options) {
  return request({
    url: '/accessController/sysAccessCard/queryUser',
    method: 'post',
    data: options
  })
}

// 用户数据下发
export function queryCard(options) {
  return request({
    url: '/accessController/sysAccessCard/queryCard',
    method: 'post',
    data: options
  })
}

// 用户数据删除
export function deleteCard(options) {
  return request({
    url: '/accessController/sysAccessCard/delCard',
    method: 'post',
    data: options
  })
}

// 门卡数据批量删除
export function delMultiCard(options) {
  return request({
    url: '/accessController/sysAccessCard/delMultiCard',
    method: 'post',
    data: options
  })
}
