import request from "@/utils/request";

//获取告警发送渠道列表
export function listAlarmChannels(query) {
  return request({
    url: 'v1/alarm-management/alarm-user/channelslist',
    method: 'get',
    params: query
  });
}

export function delAlarmUser(alarmUserId) {
  return request({
    url: 'v1/alarm-management/alarm-user/' + alarmUserId,
    method: 'delete'
  });
}

export function getAlarmUser(alarmUserId) {
  return request({
    url: "/v1/alarm-management/alarm-user/" + alarmUserId,
    method: "get"
  })
}

export function addAlarmUser(data) {
  return request({
    url: '/v1/alarm-management/alarm-user',
    method: 'post',
    data: data
  })
}

export function updateAlarmUser(data) {
  return request({
    url: '/v1/alarm-management/alarm-user',
    method: 'put',
    data: data
  })
}
