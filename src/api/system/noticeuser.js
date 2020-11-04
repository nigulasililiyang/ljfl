import  request from '@/utils/request';

//新增noticeuser信息
export function addNoticeUser(data){
    return request({
        url: 'system/noticeuser',
        method: 'post',
        data: 'data'
    })
}

//删除noticeuser信息
export function delNoticeUser(noticeUserId){
    return request({
        url: 'system/noticeuser/' + noticeUserId,
        method: 'delete'
        
    })
}

//根据noticeId删除noticeuser信息
export function delNoticeUserByNoticeId(noticeId){
    return request({
        url: 'system/notice-user/' + noticeId,
        method: 'delete'
        
    })
}

//更新noticeuser信息
// export function updateNoticeUser(data){
//     return request({
//         url: 'system/noticeuser',
//         method: 'put',
//         data: data
//     })
// }

//将noticeuser未读读改成已读
export function updateNoticeUserRead(data){
    return request({
        url: 'system/noticeuser',
        method: 'put',
        data: data
    })
}

export function selectNoticeUser(noticeUserId) {
    return request({
        url: 'system/noticeuser/' + noticeUserId,
        method: 'get'
    })
}

