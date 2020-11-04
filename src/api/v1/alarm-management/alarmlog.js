import request from '@/utils/request';
export function listAlarmLog(){
    return request({
        url: '/v1/alarm-management/alarm-log/list',
        methods: 'get'
    })
}

// 获取实时告警日志信息列表
export function listAlarmData(query){
    return request({
        url: '/v1/alarm-management/alarm-log/alarmlist',
        methods: 'get',
        params: query
    })
}

//告警统计
export function alarmStatistics(deviceId, query) {
    return request({
      url: '/v1/alarm-management/alarm-log/alarm/statistics/' + deviceId,
      method: 'get',
      params: query
    })
  }
  