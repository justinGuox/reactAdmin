/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */

import axios from 'axios'
import {message} from 'antd'
axios.defaults.withCredentials = true
export const baseUrl = 'http://localhost:5000'


export default function ajax(url, data={}, type='GET') {

  return new Promise((resolve, reject) => {
    let promise
    url = baseUrl + url
    // 1. 执行异步ajax请求
    if (type === 'GET') {
      // 发送GET请求
      // 拼请求参数串
      // data: {username: tom, password: 123}
      // paramStr: username=tom&password=123
      let paramStr = ''
      Object.keys(data).forEach((key) => {
        paramStr += key + '=' + data[key] + '&'
      })
      if (paramStr) {
        paramStr = paramStr.substring(0, paramStr.length - 1)
      }
      // 使用axios发get请求
      promise = axios.get(url + '?' + paramStr)
    } else {
      promise = axios.post(url, data)
    }
    // 2. 如果成功了, 调用resolve(value)
    promise.then(response => {
      resolve(response.data)
    // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
    }).catch(error => {
      // reject(error)
      message.error('请求出错了: ' + error.message)
    })
  })


}

// 请求登陆接口
// ajax('/login', {username: 'Tom', passsword: '12345'}, 'POST').then()
// 添加用户
// ajax('/manage/user/add', {username: 'Tom', passsword: '12345', phone: '13712341234'}, 'POST').then()
