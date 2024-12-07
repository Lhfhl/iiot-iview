import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  hide: (false) 设为true后此级路由将不会出现在面包屑中,这个是我看代码找的，他这里没写这一个配置
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    // 产线定制
    path: '/',
    name: '_line-customization',
    redirect: '/line-customization',
    meta: {
      icon: 'md-menu',
      title: '产线定制'
    },
    component: Main,
    children: [
      {
        path: 'line-customization',
        name: 'line-customization',
        meta: {
          icon: 'md-funnel',
          title: '产线定制',
          notCache: true
        },
        component: () => import('@/view/ef/node-red.vue')
      }
    ]
  },
  {
    // 产线监控
    path: '/production-line-monitoring',
    name: 'production-line-monitoring',
    meta: {
      hide: true,
      icon: 'md-menu',
      notCache: true
    },
    component: () => import('@/view/industrial-monitoring/home.vue'),
    children: [
      {
        path: 'line-monitoring',
        name: 'line-monitoring',
        meta: {
          icon: 'md-funnel',
          title: '产线监控',
          notCache: true
        },
        // component: () => import('@/view/industrial-monitoring/IndustrialMonitoring.vue')
        component: () => import('@/view/industrial-monitoring/IndustrialMonitoring.vue')
      }
    ]
  },
  {
    // 订单管理
    path: '/order-management',
    name: '_order-management',
    meta: {
      icon: 'md-menu',
      title: '订单管理',
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'ordermanagement',
        name: 'ordermanagement',
        meta: {
          icon: 'md-funnel',
          title: '订单管理',
          notCache: true
        },
        component: () => import('@/view/order-manage/OrderManage.vue')
      }
    ]
  },
  {
    // 模型管理
    path: '/model-management',
    name: '_model-management',
    meta: {
      icon: 'md-menu',
      title: '模型管理',
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'modelmanagement',
        name: 'modelmanagement',
        meta: {
          icon: 'md-funnel',
          title: '模型管理',
          notCache: true
        },
        component: () => import('@/view/model-manage/ModelManage.vue')
      },
      {
        path: 'modeldetail',
        name: 'modeldetail',
        meta: {
          icon: 'md-funnel',
          title: '模型详情',
          hideInMenu: true,
          hide: true
        },
        component: () => import('@/view/model-manage/ModelDetail.vue')
      }
    ]
  },
  {
    // 资源监控
    path: '/resource-monitoring',
    name: '_resource-monitoring',
    meta: {
      icon: 'md-menu',
      title: '资源监控',
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'resourcemonitoring',
        name: 'resourcemonitoring',
        meta: {
          icon: 'md-funnel',
          title: '资源监控',
          notCache: true
        },
        component: () => import('@/view/resource-monitor/CloudMonitoring.vue')
      }
    ]
  },
  {
    // 资源调度
    path: '/resource-scheduling',
    name: '_resource-scheduling',
    meta: {
      icon: 'md-menu',
      title: '资源调度',
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'resourcescheduling',
        name: 'resourcescheduling',
        meta: {
          icon: 'md-funnel',
          title: '资源调度',
          notCache: true
        },
        component: () => import('@/view/resource-scheduling/ResourceScheduling.vue')
      }
    ]
  },
  {
    // 工业安全预警
    path: '/industrial-safety-warning',
    name: '_industrial-safety-warning',
    meta: {
      icon: 'md-menu',
      title: '工业安全预警',
      hide: true,
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'safetywarning',
        name: 'safetywarning',
        meta: {
          icon: 'md-funnel',
          title: '工业安全预警',
          notCache: true
        },
        component: () => import('@/view/industrial-warning/IndustrialWarning.vue')
      }
    ]
  },

  // {
  //   path: '/home',
  //   name: 'home',
  //   meta: {
  //     hideInMenu: false
  //   },
  //   component: () => import('@/view/industrial-monitoring/home.vue')
  //   // children: [
  //   //   {
  //   //     path: 'monitoring',
  //   //     name: 'Monitoring',
  //   //     component: () => import('@/view/industrial-monitoring/IndustrialMonitoring.vue')
  //   //   }
  //   // ]
  // },

  {
    // 401 错误页
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    // 500 错误页
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    // 404 错误页，匹配所有未定义路径
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue') // 动态加载 404 错误页面
  }
]
