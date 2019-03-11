//定义全局变量
//登录
const login = '/cms/user/logincms'
//获取轮播图
const getRotation = '/cms/rotationChart/getRotationChart'
//添加轮播图

const addRotationChart = '/cms/rotationChart/addRotationChart'
//修改轮播图
const updateRotationChart = '/cms/rotationChart/updateRotationChart'
//删除轮播图
const deleteRotationChart = '/cms/rotationChart/deleteRotationChart'
//查询资讯
const informationList = '/cms/information/list'
//删除资讯
const informationDelete = '/cms/information/delete'

//添加资讯
const informationAdd = '/cms/information/add'
//更新资讯
const informationUpdate = '/cms/information/update'

export default {
  //登录
  login,
  //轮播图
  getRotation, addRotationChart, updateRotationChart, deleteRotationChart,
  //资讯列表
  informationList,informationDelete,informationAdd,informationUpdate


}
