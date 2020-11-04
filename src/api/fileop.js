import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 文件上传
export function uploadFile(data) {
    return request({
      url: '/system/oss/upload',
      method: 'post',
      data: data
    })
  }

 // 获取文件列表
export function getFileList(attachmentIds) {
  return request({
    url: '/system/oss/getFileByIds/' + praseStrEmpty(attachmentIds),
    method: 'get'
  })
} 