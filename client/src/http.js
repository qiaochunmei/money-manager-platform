import axios from 'axios'
import { Message, Loading } from 'element-ui';
import router from './router'

let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loading = Loading.service({ // Loading 还可以以服务的方式调用。引入 Loading 服务：
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.8)'
  })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
  // 加载
  startLoading()
  if (localStorage.eleToken) { 
    config.headers.Authorization = localStorage.eleToken // 设置统一的请求头
  }
  return config // 返回config
}, error => {
  return Promise.reject(error)
})

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
  // 结束加载动画
  endLoading()
  return response
}, error => {
  // 错误提醒
  endLoading()
  Message.error(error.response.data) // 错误提醒
  // 获取状态码
  const { status } = error.response
  if (status == 401) { // token过期处理
    Message.error('token值无效，请重新登录')
    // 清除token
    localStorage.removeItem('eleToken')
    // 页面跳转
    router.push('/login')
  }
  return Promise.reject(error)
})

export default axios