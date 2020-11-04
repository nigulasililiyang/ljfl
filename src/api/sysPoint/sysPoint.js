import request from '@/utils/request'

// 查询点位列表
export function listSysPoint(query) {
  return request({
    url: '/v1/template-config/point-templates/'+query.pointTemplateId+'/points',
    method: 'get',
    params: query
  })
}

// 查询点位详细
export function getSysPoint(query) {
  return request({
    url: '/v1/template-config/point-templates/'+query.pointTemplateId+'/points/' + query.pointId,
    method: 'get'
  })
}

// 新增点位
export function addSysPoint(data) {
  return request({
    url: '/v1/template-config/point-templates/'+data.pointTemplateId+'/points',
    method: 'post',
    data: data
  })
}

// 修改点位
export function updateSysPoint(data) {
  return request({
    url: '/v1/template-config/point-templates/'+data.pointTemplateId+'/points',
    method: 'put',
    data: data
  })
}

// 删除点位
export function delSysPoint(pointTemplateId,pointIds){
  return request({
    url: '/v1/template-config/point-templates/'+pointTemplateId+'/points?pointIds=' + pointIds,
    method: 'delete'
  })
}

// 导出点位
export function exportSysPoint(query) {
  return request({
    url: '/v1/template-config/point-templates/'+query.pointTemplateId+'/pointsexport',
    method: 'get',
    params: query
  })
}