import {setToken, getToken} from '@/libs/util'
import {post} from '@/libs/axios-cfg'
import {errorHandler} from '@/libs/iview-cfg'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: ''
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 退出登录
    handleLogOut({state, commit}) {
      commit('setToken', '')
      commit('setAccess', [])
      localStorage.clear()
    },
    // 获取用户相关信息
    async getUserInfo({state, commit}) {

      let state1 = localStorage.getItem('state')
      let permissions = ''
      //超级管理员
      if (state1 === '1') {
        permissions = ['system','common:common','common:app','system:xxxxx','common:slide', 'common:information', 'common:order', 'common:wallet', 'common:course', 'common:mill', 'common:currency', 'common:template',
          'common:update', 'common:feedback',
          'system:user']
      }
      //宣传
      if (state1 === '2') {
        permissions = ['common:common','common:slide', 'common:course', 'common:update', 'common:information']
      }
      //客服
      if (state1 === '3') {
        permissions = ['common:app','common:feedback']
      }
      //财务
      if (state1 === '4') {
        permissions = ['common:common','common:wallet']
      }
      //运维
      if (state1 === '5') {
        permissions = ['common:common','common:mill', 'common:template', 'common:order', 'common:currency',]
      }
      commit('setAccess', permissions)
      return {access: permissions}

    }
  }
}
