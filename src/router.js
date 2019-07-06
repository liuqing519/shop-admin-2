import Vue from "vue";
import Router from "vue-router";

import Login from "./views/login"

// import Home from "./views/Home"
const Home = () => import(/* webpackChunkName: 'one' */"./views/Home")
const User = () => import(/* webpackChunkName: 'one' */"./views/user/User.vue")
const Rights = () => import(/* webpackChunkName: 'one' */"./views/rights/rights")
const roles = () => import(/* webpackChunkName: 'one' */"./views/roles/roles")
const goods = () => import(/* webpackChunkName: 'two' */"./views/goods/goods")
const categories = () => import(/* webpackChunkName: 'two' */"./views/categories/categories")
const goodsAdd = () => import(/* webpackChunkName: 'two' */"./views/goods/goodsAdd")

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
        },
        {
          path: '/goods',
          component: goods
        },
        {
          path: '/goods-add',
          component: goodsAdd
        },
        {
          path: '/categories',
          component: categories
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
});
