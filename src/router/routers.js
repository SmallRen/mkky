import Main from '@/view/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/home/index')
      }
    ]
  },
  /*{
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums'
    },
    children:[
      { path: 'slide',meta:{icon: 'md-people', title: '轮播图管理',access: ['common:slide']}, name: 'slide', component: () => import('@/view/common/slide') },
      { path: 'information',meta:{icon: 'md-people', title: '资讯管理',access: ['common:information']}, name: 'information', component: () => import('@/view/common/information') },
      { path: 'order',meta:{icon: 'md-body',title: '订单管理',access: ['common:order']}, name: 'order', component: () => import('@/view/common/order') },
      { path: 'wallet',meta:{icon: 'ios-lock',title: '钱包管理',access: ['common:wallet']}, name: 'wallet', component: () => import('@/view/common/wallet') },
      { path: 'mill',meta:{icon: 'ios-aperture',title: '矿机管理',access: ['common:mill']}, name: 'mill', component: () => import('@/view/common/mill') },
      { path: 'mill-template',meta:{icon: 'md-basket',title: '矿机模板',access: ['common:template']}, name: 'template', component: () => import('@/view/common/template') },
 ]
  },
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      title: '系统设置',
      icon:'ios-cog'
    },
    children:[
         { path: 'user',meta:{icon: 'md-people', title: '用户管理',access: ['system:user:list']}, name: 'system_user', component: () => import('@/view/system/user') },
         { path: 'person-stalker',meta:{icon: 'md-body',title: '角色管理',access: ['system:user:list']}, name: 'system_role', component: () => import('@/view/system/role') },
         { path: 'resource',meta:{icon: 'ios-lock',title: '资源管理',access: ['system:resource:list']}, name: 'system_resource', component: () => import('@/view/system/resource') },
         { path: 'log',meta:{icon: 'ios-aperture',title: '系统日志',access: ['system:log:list']}, name: 'system_log', component: () => import('@/view/system/log') },
    ]
  },*/
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      title: '用户管理',
      icon:'ios-cog',
      access: ['system']
    },
    children:[
      { path: 'user',meta:{icon: 'md-people', title: '用户管理',access: ['system:user']}, name: 'system_user', component: () => import('@/view/system/user') },
       /*  { path: 'person-stalker',meta:{icon: 'md-body',title: '角色管理'}, name: 'system_role', component: () => import('@/view/system/role') },
        { path: 'resource',meta:{icon: 'ios-lock',title: '资源管理'}, name: 'system_resource', component: () => import('@/view/system/resource') },
        { path: 'log',meta:{icon: 'ios-aperture',title: '系统日志'}, name: 'system_log', component: () => import('@/view/system/log') },*/
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      title: '用户管理',
      icon:'ios-cog',
      access: ['system']
    },
    children:[
       { path: '#',meta:{icon: 'md-analytics', title: '用户结算',access: ['system:xxxxx']}, name: '', component: () => import('@/view/system/user') },
      /*  { path: 'person-stalker',meta:{icon: 'md-body',title: '角色管理'}, name: 'system_role', component: () => import('@/view/system/role') },
        { path: 'resource',meta:{icon: 'ios-lock',title: '资源管理'}, name: 'system_resource', component: () => import('@/view/system/resource') },
        { path: 'log',meta:{icon: 'ios-aperture',title: '系统日志'}, name: 'system_log', component: () => import('@/view/system/log') },*/
    ]
  },

  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
      { path: 'order',meta:{icon: 'md-body',title: '订单管理',access: ['common:order']}, name: 'order', component: () => import('@/view/common/order') },
    ]
  },
  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
      { path: 'currency',meta:{icon: 'ios-aperture',title: '币种管理',access: ['common:currency']}, name: 'currency', component: () => import('@/view/common/currency') },
    ]
  },
  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
      { path: 'wallet',meta:{icon: 'ios-lock',title: '转账管理',access: ['common:wallet']}, name: 'wallet', component: () => import('@/view/common/wallet') },
    ]
  },
  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
      { path: 'mill',meta:{icon: 'ios-grid',title: '矿机管理',access: ['common:mill']}, name: 'mill', component: () => import('@/view/common/mill') },
    ]
  },


  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
      { path: 'mill-template',meta:{icon: 'md-basket',title: '矿机模板',access: ['common:template']}, name: 'template', component: () => import('@/view/common/template') },
    ]
  },


  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
       { path: 'information',meta:{icon: 'md-jet', title: '资讯管理',access: ['common:information']}, name: 'information', component: () => import('@/view/common/information') },
     ]
  },




  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
    { path: 'course',meta:{icon: 'md-outlet',title: '教程管理',access: ['common:course']}, name: 'course', component: () => import('@/view/common/course') },
    ]
  },
  {
    path: '/common',
    name: 'common',
    component: Main,
    meta: {
      title: '公共设置',
      icon:'ios-albums',
      access: ['common:common']
    },
    children:[
      { path: 'slide',meta:{icon: 'ios-apps', title: '轮播图管理',access: ['common:slide']}, name: 'slide', component: () => import('@/view/common/slide') },
    ]
  },

  {
    path: '/common',
    name: 'app',
    component: Main,
    meta: {
      title: 'APP管理',
      icon:'ios-cog',
      access: ['common:app']
    },
    children:[
      { path: 'update',meta:{icon: 'logo-hackernews',title: 'app版本更新',access: ['common:update']}, name: 'update', component: () => import('@/view/common/update') },

    ]
  },
  {
    path: '/common',
    name: 'app',
    component: Main,
    meta: {
      title: 'APP管理',
      icon:'ios-cog',
      access: ['common:app']
    },
    children:[
       { path: 'feedback',meta:{icon: 'md-microphone',title: 'app意见反馈',access: ['common:feedback']}, name: 'feedback', component: () => import('@/view/common/feedback') },

    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
