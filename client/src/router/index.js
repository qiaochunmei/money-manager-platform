import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Register from '@/views/Register'
import notFound from '@/views/404'
import Login from '@/views/Login'
import Home from '@/views/Home'
import InfoShow from '@/views/InfoShow'
import FoundList from '@/views/FoundList'
Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // 404页面跳转
    {
      path: '*',
      name: '/404',
      component: notFound
    },
    {
      path: '/', // 访问/的话让用户直接跳转至/index页面
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/infoshow', name: 'infoshow', component: InfoShow },
        { path: '/foundlist', name: 'foundlist', component: FoundList }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})

// 添加路由守卫(即未登录时只能访问注册和登录页面)
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next(); // 如果时登录和注册页面，正常访问
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router;
