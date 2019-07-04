import Vue from "vue";
import Router from "vue-router";
import Login from "./views/login"
import Home from "./views/Home"
import User from "./views/user/User.vue"
import Rights from "./views/rights/rights"
import roles from "./views/roles/roles"

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
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: roles
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
});
