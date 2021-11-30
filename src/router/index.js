import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '../views/MainPage.vue'
// import authenticated from '../../middleware/authenticated'
// import refreshDashboard from '../../middleware/refreshDashboard'
// import store from '@/store'

// import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'MainPage',
    component: MainPage,
    children:[
      {
        path: 'about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
      },
    ]
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../components/CollabEditor.vue'),
    props: true,
  },
  {
    path: '/doclist',
    name: 'Doclist',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "doclist" */ '../components/DocList.vue'),
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
