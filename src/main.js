import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/index.css'

Vue.config.productionTip = false;

Vue.use(ElementUI)

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
