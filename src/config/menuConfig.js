const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的path
    icon: 'HomeOutlined', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '商品',
    key: '/products',
    icon: 'MenuOutlined',
    children: [ // 子菜单列表
      {
        title: '品类管理',
        key: '/category',
        icon: 'MenuOutlined'
      },
      {
        title: '商品管理',
        key: '/product',
        icon: 'ShoppingOutlined'
      },
    ]
  },

  {
    title: '用户管理',
    key: '/user',
    icon: 'UserOutlined'
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'UsergroupAddOutlined',
  },

  {
    title: '图形图表',
    key: '/charts',
    icon: 'AreaChartOutlined',
    children: [
      {
        title: '柱形图',
        key: '/charts/bar',
        icon: 'BarChartOutlined'
      },
      {
        title: '折线图',
        key: '/charts/line',
        icon: 'LineChartOutlined'
      },
      {
        title: '饼图',
        key: '/charts/pie',
        icon: 'PieChartOutlined'
      },
    ]
  },

  {
    title: '订单管理',
    key: '/order',
    icon: 'DollarOutlined',
  },
]

export default menuList
