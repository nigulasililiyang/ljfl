import request from '@/utils/request'

// 查询对象存储服务器上的数据（附件）与实体之间的对应关系列表
export function listOssobject(query) {
  return request({
    url: '/v1/system/ossobject/list',
    method: 'get',
    params: query
  })
}

// 查询对象存储服务器上的数据（附件）与实体之间的对应关系详细
export function getOssobject(ossObjectId) {
  return request({
    url: '/v1/system/ossobject/' + ossObjectId,
    method: 'get'
  })
}

// 查询此设备及其模板所对应的所有文件
export function listOssobjectByDevice(query) {
  return request({
    url: '/v1/system/ossobject/listdevicefile',
    method: 'get',
    params: query
  })
}

// 查询此项目下的所有文件
export function listOssobjectByProject(query) {
  return request({
    url: '/v1/system/ossobject/listprojectfile',
    method: 'get',
    params: query
  })
}

// 新增对象存储服务器上的数据（附件）与实体之间的对应关系
export function addOssobject(data) {
  return request({
    url: '/v1/system/ossobject',
    method: 'post',
    data: data
  })
}

// 修改对象存储服务器上的数据（附件）与实体之间的对应关系
export function updateOssobject(data) {
  return request({
    url: '/v1/system/ossobject',
    method: 'put',
    data: data
  })
}

// 删除对象存储服务器上的数据（附件）与实体之间的对应关系
export function delOssobject(ossObjectId) {
  return request({
    url: '/v1/system/ossobject/' + ossObjectId,
    method: 'delete'
  })
}

// 导出对象存储服务器上的数据（附件）与实体之间的对应关系
export function exportOssobject(query) {
  return request({
    url: '/v1/system/ossobject/export',
    method: 'get',
    params: query
  })
}

// 文件 下载
export function downloadFile(query) {
  return request({
    url: '/v1/system/ossobject/download',
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  })
}
