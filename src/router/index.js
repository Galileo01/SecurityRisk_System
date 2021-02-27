import Vue from 'vue'
import VueRouter from 'vue-router'
import OneMap from 'views/OneMap.vue'
import home from 'views/home.vue'
const OneChart2 = () => import('views/OneChart2')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
    // redirect: '/OneMap',
    // children: [
    //   {
    //     path: '/OneMap',
    //     name: 'OneMap',
    //     component: OneMap,
    //     meta: {
    //       title: '风险源一张图'
    //     }
    //   },
    //   {
    //     path: '/OneChart',
    //     name: 'OneChart',
    //     component: OneChart2,
    //     meta: {
    //       title: '风险源一张表'
    //     }
    //   },
    // ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
//导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title;
  next();
})
export default router
