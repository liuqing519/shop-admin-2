import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入axios
import axios from 'axios'

import './assets/index.css'

Vue.config.productionTip = false;

Vue.use(ElementUI)

// 把axios加到vue的原型上, 这样就不用每个要用到axios的页面都要引入了
// $http 是行业内的默认叫法 名字可以随便取
Vue.prototype.$http = axios

// 给axios添加一个默认的基路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 设置axios的请求拦截器
axios.interceptors.request.use(function(config) {
  // config就是请求时拦截到的所有相关信息
  config.headers.Authorization = localStorage.getItem("token")
     return config;
})

// 设置axios的响应拦截器
    axios.interceptors.response.use(function(response) {
      // console.log(response)
      // token过期时直接跳转到登录页
      if (response.data.meta.status === 401) {
        router.push('/login')
      }
        return response
    })
    
// 注册导航守卫
router.beforeEach( (to,from,next) => {
  // 1. 如果是登录页直接放行
  if (to.path === '/login') {
    next()
    return
  }
  // 2. 判断有没有登录, 登录过了就直接放行
  // 3. 没有登录就跳转到登录页
  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
