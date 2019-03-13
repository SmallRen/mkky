//定义全局变量
//******************************************轮播图管理
//获取轮播图
const getRotation = '/cms/rotationChart/getRotationChart'
//添加轮播图

const addRotationChart = '/cms/rotationChart/addRotationChart'
//修改轮播图
const updateRotationChart = '/cms/rotationChart/updateRotationChart'
//删除轮播图
const deleteRotationChart = '/cms/rotationChart/deleteRotationChart'
//******************************************资讯管理
//查询资讯
const informationList = '/cms/information/list'
//删除资讯
const informationDelete = '/cms/information/delete'
//添加资讯
const informationAdd = '/cms/information/add'
//更新资讯
const informationUpdate = '/cms/information/update'
//******************************************订单管理
//删除订单
const getDeleteOrderInfo = '/cms/Orderinfo/getDeleteOrderInfo'
//更新订单
const getUpdateOrderInfo = '/cms/Orderinfo/getUpdateOrderinfo'
//获取订单
const getOrderInfo = '/cms/Orderinfo/getOrderinfo'
//查询转账
const WithdrawalOrderByKey = '/cms/withdrawalOrder/WithdrawalOrderByKey'
//修改
const orderUpdate = '/cms/withdrawalOrder/update'
//查询用户提现
const getOrderList = '/cms/withdrawalOrder/list'
//******************************************矿机管理
//所有矿机
const listMiningMachine = '/cms/MiningMachine/listMiningMachine'
//查询单个矿机
const KeyListMiningMachine = '/cms/MiningMachine/KeyListMiningMachine'
//修改矿机
const updateMiningMachine = '/cms/MiningMachine/updateMiningMachine'
//删除矿机
const deleteMiningMachine = '/cms/MiningMachine/deleteMiningMachine'
//添加矿机
const insertMiningMachine = '/cms/MiningMachine/insertMiningMachine'
//******************************************矿机模板
//矿机模板list
const MiningMachineBasicList = '/cms/MiningMachineBasic/list'
//删除模板
const deleteMining = '/cms/MiningMachineBasic/deleteMining'
//修改模板
const updateMining = '/cms/MiningMachineBasic/updateMining'
//主键查询矿机模板
const KeyList = '/cms/MiningMachineBasic/Keylist'
//******************************************用户管理
//登录
const login = '/cms/user/logincms'
//用户登录
const list = '/cms/user/list'
//用户状态管理
const update = '/cms/user/update'
//******************************************教程管理
//获取教程管理
const getCourseList = '/app/Course/getCourseList'
//删除教程
const getDeleteCourse = '/app/Course/getDeleteCourse'
//更新教程
const getUpdateCourse = '/app/Course/getUpdateCourse'
//查询教程
const getCourse = '/app/Course/getCourse'
//添加教程
const getAddCourse = '/app/Course/getAddCourse'
//******************************************币种管理
//**删除
const currencyDelete = '/cms/currency/delete'
//更新
const currencyUpdate = '/cms/currency/update'
//添加
const currencyAdd = '/cms/currency/add'
//list
const currencyList = '/cms/currency/list'
//*****************************************app版本更新管理
//删除软件
const getDeleteSoftwareUpdates = '/app/softwareUpdate/getDeleteSoftwareUpdates'
//修改
const getUpdateSoftwareUpdates = '/app/softwareUpdate/getUpdateSoftwareUpdates'
//添加
const getAddSoftwareUpdates = '/app/softwareUpdate/getAddSoftwareUpdates'
//list
const getSoftwareUpdates = '/app/softwareUpdate/getSoftwareUpdates'
//*****************************************app用户反馈
//list
const getUserFeedbackList = '/cms/userFeedback/getUserFeedbackList'
//删除
const deleteUserFeedback = '/cms/userFeedback/deleteUserFeedback'
export default {
  //轮播图
  getRotation, addRotationChart, updateRotationChart, deleteRotationChart,
  //资讯列表
  informationList, informationDelete, informationAdd, informationUpdate,
  //订单管理
  getDeleteOrderInfo, getUpdateOrderInfo, getOrderInfo,
  //转账管理
  WithdrawalOrderByKey, orderUpdate, getOrderList,
  //矿机管理
  listMiningMachine, KeyListMiningMachine, updateMiningMachine, deleteMiningMachine, insertMiningMachine,
  //模板管理
  MiningMachineBasicList, deleteMining, updateMining, KeyList,
  //用户管理
  login, list, update,
  //教程管理
  getCourseList, getDeleteCourse, getUpdateCourse, getCourse, getAddCourse,
  //币种管理
  currencyDelete, currencyUpdate, currencyAdd, currencyList,
  //app版本更新管理
  getDeleteSoftwareUpdates, getUpdateSoftwareUpdates, getAddSoftwareUpdates, getSoftwareUpdates,
  //app用户反馈
  getUserFeedbackList, deleteUserFeedback
}
