<template>
  <div class="user-avator-dropdown">

    <span v-model="des">欢迎您：{{des}} &nbsp;</span>
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions} from 'vuex'

  export default {
    name: 'User',
    des: 'fddfsffssf',
    props: {
      userAvator: {
        type: String,
        default: ''
      }
    },
    created() {

      let state1 = localStorage.getItem('state')
      if (state1 === '1') {
        this.des = "超级管理员"
      }
      if (state1 === '2') {
        this.des = "宣传部"
      }
      if (state1 === '3') {
        this.des = "客服"
      }
      if (state1 === '4') {
        this.des = "财务"
      }
      if (state1 === '5') {
        this.des = "运维"
      }


    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.handleLogOut().then(() => {
              this.$router.push({
                name: 'login'
              })
            })
            break
        }
      }
    }
  }
</script>
