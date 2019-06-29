import Vue from "vue";
import Router from "vue-router";
import Login from "./views/login"
import Home from "./views/Home"
import User from "./views/User.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/user',
          component: User
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
});
