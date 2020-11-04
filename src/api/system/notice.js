import request from '@/utils/request'

// 查询已发送公告列表
export function listNotice(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}
//查询已收阅公告列表
export function receivedListNotice(query) {
  return request({
    url: '/system/notice/receivedlist',
    method: 'get',
    params: query
  })
}

//查询未读公告列表
export function unreadNoticeList(){
  return request({
    url: '/system/notice/unreadlist',
    method: 'get'
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/system/notice/addNoticeUser',
    method: 'post',
    data: data
  })
}

// 修改已收阅公告
export function updateNotice(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}