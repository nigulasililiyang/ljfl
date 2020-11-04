import request from '@/utils/request'

// 查询数据展示模板列表
export function listDataDisplayTemplate(query) {
    return request({
        url: '/v1/display/data-display-template/list',
        method: 'get',
        params: query
    })
}
export function listDataDisplayTemplateAll(query) {
    return request({
        url: '/v1/display/data-display-template/all',
        method: 'get',
        params: query
    })
}
export function getDataDisplayTemplatelistByDeviceId(deviceId) {
    return request({
        url: '/v1/display/data-display-template/' + +deviceId + '/list',
        method: 'get'
    })
}
export function getDDTCByCompnentName(deviceId,query) {
    return request({
        url: '/v1/display/data-display-template/' + +deviceId + '/compnent/list',
        method: 'get',
        params: query
    })
}
// 查询数据展示模板详细
export function getDataDisplayTemplate(dataDisplayTemplateId) {
    return request({
        url: '/v1/display/data-display-template/' + dataDisplayTemplateId,
        method: 'get'
    })
}

// 新增数据展示模板
export function addDataDisplayTemplate(data) {
    return request({
        url: '/v1/display/data-display-template',
        method: 'post',
        data: data
    })
}

// 修改数据展示模板
export function updateDataDisplayTemplate(data) {
    return request({
        url: '/v1/display/data-display-template',
        method: 'put',
        data: data
    })
}

// 删除数据展示模板
export function delDataDisplayTemplate(dataDisplayTemplateId) {
    return request({
        url: '/v1/display/data-display-template/' + dataDisplayTemplateId,
        method: 'delete'
    })
}

// 导出数据展示模板
export function exportDataDisplayTemplate(query) {
    return request({
        url: '/v1/display/data-display-template/export',
        method: 'get',
        params: query
    })
}
//根据deviceTemplateId和Name 查询出 sysDataDisplayTemplates
export function getDDTCByNameAndDeviceTemplateId(query) {
    return request({
        url: '/v1/display/data-display-template/dtin/list',
        method: 'get',
        params: query
    })
}
//添加或修改显示模板
export function addDataAndPoint(data) {
    return request({
        url: '/v1/display/data-display-template/add/templatepoint',
        method: 'post',
        data: data
    })
}
//添加或修改显示模板
export function displaySetAddDataAndPoint(data) {
    return request({
        url: '/v1/display/data-display-template/displayset/add/templatepoint',
        method: 'post',
        data: data
    })
}
//添加或修改显示模板
export function tablecfgDatatemplates(query) {
    return request({
        url: '/v1/display/data-display-template/tablecfg/datatemplates',
        method: 'get',
        params: query
    })
}
