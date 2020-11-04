import request from '@/utils/request'
//获取qrcode
export function getQRCode() {
  return request({
    url: '/v1/message/wechat/qrcode',
    method: 'get'
  })
}
//unbind
export function unbind() {
  return request({
    url: '/v1/message/wechat/unbind',
    method: 'get'
  })
}