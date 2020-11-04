import request from '@/utils/request'

// 获取采集服务列表
export function getCollectServices(query) {
    return request({
        url: '/v1/data-collections/services',
        method: 'get',
        params: query
    })
}

// 编辑采集服务
export function updateCollectService(data) {
    return request({
        url: '/v1/data-collections/services?serviceName=' + data.name,
        method: 'put',
        data: data
    })
}