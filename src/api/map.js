import request from '@/utils/request'

export function getGeoJson(api) {
    return request({
      url: api,
      method: 'get'
    })
  }