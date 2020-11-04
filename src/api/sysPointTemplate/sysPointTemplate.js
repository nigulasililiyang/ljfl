import request from '@/utils/request'

// 查询点位模板列表
export function listSysPointTemplate(query) {
    return request({
        url: '/v1/template-config/point-templates',
        method: 'get',
        params: query
    })
}

export function getDeviceUnConfigPointTemplateList(deviceId) {
    return request({
        url: '/v1/template-config/point-templates/unConfig/' + deviceId,
        method: 'get'
    })
}

// 查询点位模板详细
export function getSysPointTemplate(pointTemplateId) {
    return request({
        url: '/v1/template-config/point-templates/' + pointTemplateId,
        method: 'get'
    })
}

// 新增点位模板
export function addSysPointTemplate(data) {
    return request({
        url: '/v1/template-config/point-templates',
        method: 'post',
        data: data
    })
}

// 修改点位模板
export function updateSysPointTemplate(data) {
    return request({
        url: '/v1/template-config/point-templates',
        method: 'put',
        data: data
    })
}

// 删除点位模板
export function delSysPointTemplate(pointTemplateId) {
    return request({
        url: '/v1/template-config/point-templates?pointTemplateId=' + pointTemplateId,
        method: 'delete'
    })
}

// 导出点位模板
export function exportSysPointTemplate(query) {
    return request({
        url: '/v1/template-config/point-templates/export',
        method: 'get',
        params: query
    })
}

// 批量修改点位模板
export function batchUpdateSysPointTemplate(data) {
  return request({
    url: '/v1/template-config/point-templates/batchUpdate',
    method: 'put',
    data: data
  })
}

// 下载点位模板数据模板
export function downloadTemplate() {
  return request({
    url: '/v1/template-config/point-templates/downloadTemplate',
    method: 'get'
  })
}
