<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>用户管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">


              <Button :disabled="selections.length==0 || setting.loading" type="error" @click="sendEmail(false)">
                <Icon type="trash-a"></Icon>&nbsp;发送邮件
              </Button>
            </Col>
            <Col span="9">
              <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                <Button slot="append" icon="ios-search"></Button>
              </Input>
            </Col>
          </Row>
          <Table ref="table" class="margin-bottom-10" @on-selection-change="selectionChange"
                 :columns="columns" :loading="setting.loading" :border="setting.showBorder"
                 :data="data.list"></Table>
          <Page :total="data.total" class="tr" @on-change="pageChange"
                :page-size="data.pageSize"
                @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </template>
      </div>
    </Card>
    <Modal v-model="modal.show" title="属性"
           :mask-closable="false" :closable="false" :width="1200">
      <Form ref="modalForm" :model="modal" :label-width="100">
        <div v-for="(item, index) in modal.data" :value="index">
          <row>
            <Col span="3">
              <FormItem label="货币名称" prop="walletName">
                <span>{{item.walletName}}</span>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="货币图片" prop="walletImg">
                <img :src="item.walletImg" style="width: 40px;height: 40px"/>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="货币余额" prop="walletNumber">
                <span>{{item.walletNumber}}</span>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="货币的抵押数" prop="walletMortgage">
                <Input v-model.trim="item.walletMortgage"></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label="提现地址" prop="cashAddress">
                <span>{{item.cashAddress}}</span>
              </FormItem>
            </Col>
          </row>
        </div>
      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal.loading" @click="cancel(false)">取消</Button>
        <Button type="primary" :loading="modal.loading" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal2.show" title="属性"
           :mask-closable="false" :closable="false" :width="700">
      <Form ref="modalForm" :model="modal2" :label-width="100">

        <row>

          <FormItem label="用戶电话" prop="userPhone">
            <Input v-model.trim="modal2.data.userPhone"></Input>
          </FormItem>

          <FormItem label="分瓜标识" prop="partitionIdentification">
            <Input v-model.trim="modal2.data.partitionIdentification"></Input>
          </FormItem>

          <FormItem label="托管状态" prop="trusteeship">
            <RadioGroup v-model="modal2.data.trusteeship">
              <Radio label="0">未托管</Radio>
              <Radio label="1">已托管</Radio>
            </RadioGroup>
          </FormItem>

        </row>
      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal2.loading" @click="cancel1(false)">取消</Button>
        <Button type="primary" :loading="modal2.loading" @click="ok1">更新</Button>
      </div>
    </Modal>
    <Modal v-model="removeModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认操作？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="setting.loading" @click="ok">确认操作</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import {post, get, put} from '@/libs/axios-cfg'

  export default {
    data() {
      return {
        updateUserId: null,
        resetPasswordUser: null,
        selections: [],
        removeModal: false,
        setting: {
          loading: true,
          showBorder: true
        },
        modal: {
          show: false,
          loading: false,
          data: []
        },

        search: {
          type: 'name',
          value: ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {title: '用户id', key: 'userId', sortable: true},
          {title: '真实名字', key: 'userRealName', width: 100, align: 'center'},
          /* {
             title: '头像', key: 'userImg', width: 100,
             render: (h, params) => {
               return h('div', [
                 h('img', {
                   style: {
                     width: '40px',
                     height:'40px',
                     verticalAlign: 'middle'
                   },
                   attrs: {
                     src: params.row.userImg
                   }
                 },)])
             },

           },*/
          {title: '用户电话', key: 'userPhone', sortable: true, width: 120},
          {title: '身份证', key: 'idNumber', sortable: true, width: 160, align: 'center'},
          {title: '邮箱', key: 'userEmail', sortable: true, width: 180, align: 'center'},
          {
            title: '注册日期',
            key: 'userTime',
            width: 180,
            render: (h, params) => {
              return h('span', dayjs(params.row.userTime).format('YYYY年MM月DD日 HH:mm:ss'))
            },
            sortable: true
          },
          {title: '用户算力', key: 'userCount', sortable: true, width: 110, align: 'center'},
          {title: '分瓜标识', key: 'partitionIdentification', sortable: true, width: 110, align: 'center'},
          {
            title: '托管状态',
            key: 'trusteeship',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('tag',
                {
                  props: {
                    color: params.row.trusteeship == 0 ? 'warning' : 'success'
                  }
                }, params.row.trusteeship == 0 ? '未托管' : '已托管')
            },
            sortable: true
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('div', [

                h('Button', {
                  props: {type: 'info', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this.updateUser(params.index)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {type: params.row.state == 1 ? 'success' : 'warning', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this.lockUser(params.row)
                    }
                  }
                }, params.row.state == 1 ? '冻结' : '恢复'),
                h('Button', {
                  props: {type: 'warning', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this.seeWallet(params.row.userId)
                    }
                  }
                }, '查看钱包'),
              ])
            }
          }
        ],
        data: {},
        dataFilter: {
          page: 1,
          pageSize: 10
        },
        removeObject: null,
        roles: null,

        modal2: {
          show: false,
          loading: false,
          data: {}
        },
      }
    },
    components: {},
    created() {
      this.getData()
    },
    methods: {

      updateUser(index) {
        let obj = JSON.parse(JSON.stringify(this.data.list[index]))
        this.modal2.data =obj
        this.modal2.data.trusteeship = this.modal2.data.trusteeship + ""
        this.modal2.show = true
      },
       ok1() {
        this.updateUserInfo();

      },
      async updateUserInfo(){
        this.modal2.loading = true
        try {
          delete this.modal2.data['userTime']
          let res = await post(this.$url.updateUserById, this.modal2.data)
          if (res.status === 1) {

            this.$Message.success('操作成功')
            this.getData()

          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          debugger
          this.$throw(error)
        }
        this.modal2.loading = false
        this.modal2.show = false
      },
      cancel1() {
        this.modal2.show = false
      },
      cancel() {
        this.modal.show = false
      },
      ok() {
        for (let i = 0; i < this.modal.data.length; i++) {
          this.updateWallet(this.modal.data[i]);
        }
        this.$Message.success('操作成功！')
        this.modal.show = false
      },
      async updateWallet(obj) {
        try {
          let res = await get(this.$url.updateWalletByUser, {
            wallet_id: obj.walletId,
            userId: obj.walletUserid,
            wallet_mortgage: obj.walletMortgage,

          })
        } catch (error) {
          this.$throw(error)
        }
      },
      seeWallet(userId) {

        this.getWallet(userId);
        this.modal.show = true
      },
      async getWallet(userId) {
        try {
          let res = await get(this.$url.getWalletByUserId, {
            userId: userId
          })
          debugger
          this.modal.data = res.data
        } catch (error) {
          this.$throw(error)
        }
      },
      /**
       * @description 批量选择回调
       */
      selectionChange(list) {
        this.selections = list
      },
      /**
       * @description 分页更换事件回调
       */
      pageChange(p) {
        this.dataFilter.page = p
        this.getData()
      },
      /**
       * @description 分页每页显示数量改变事件回调
       */
      pageSizeChange(p) {
        this.dataFilter.pageSize = p
        this.getData()
      },
      /**
       * @description 发送邮件
       */
      async sendEmail(single = false) {
        this.setting.loading = true
        this.$Message.loading({
          content: '发送邮件中...',
          duration: 0
        })
        let objs = []
        if (single) {
          objs.push(single)
        } else {
          this.selections.forEach(el => {
            objs.push(el.id)
          })
        }
        try {
          let res = await post(' ', objs)
          this.getData()
          this.selections = []
          this.$Message.destroy()
          this.$Message.success({
            content: '发送邮件成功',
            duration: 1.5
          })
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      },

      /**
       * @description 修改状态
       */
      async ok() {
        let status = this.removeObject.state === 0 ? 1 : 0
        this.setting.loading = true
        try {
          let res = await post(this.$url.update, {state: status, userId: this.removeObject.userId})
          this.$Message.success('操作成功！')

          this.getData()
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
        this.removeModal = false
      },
      /**
       * @description 锁定/解锁用户
       */
      async lockUser(obj) {
        this.removeObject = obj

        this.removeModal = true
      },
      /**
       * @description 获取用户列表
       */
      async getData() {
        this.setting.loading = true
        try {
          let res = await get(this.$url.list, {
            page: this.dataFilter.page,
            rows: this.dataFilter.pageSize
          })

          if (res.status === 1) {

            this.data = res.data
          } else {

          }
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      },
      /**
       * @description 获取角色列表
       */
      async getRoleList() {
        try {
          let res = await post('/system/role/list', {
            page: 1,
            pageSize: 1000
          })
          this.roles = res.data.records
        } catch (error) {
          this.$throw(error)
        }
      },
      /**
       * @description 打开模态窗口
       * @param uid 用户ID
       * @param type 打开类型
       */
      openAddModal(uid, type = 'update') {
        if (uid == null || type === 'update') {
          if (this.roles == null) {
            this.getRoleList()
          }
        }
        if (uid == null) {
          this.addUserModal = true
        } else if (type === 'update') {
          this.updateUserId = uid
          this.updateUserModal = true
        } else {
          this.resetPasswordUser = uid
          this.resetPasswordModal = true
        }
      },
      /**
       * @description 关闭模态窗口
       * @param type 窗口类型
       * @param reload 是否重新加载数据
       */
      onModalCancel(type, reload = false) {
        switch (type) {
          case 'add': {
            this.addUserModal = false
          }

            break
          case 'update': {
            this.updateUserModal = false
          }

            break
          case 'resetPassword': {
            this.resetPasswordModal = false
          }

            break
        }
        if (reload) this.getData()
      },
      /**
       * @description 导出表格CSV
       */
      exportData(type) {
        if (type === 1) {
          this.$refs.table.exportCsv({
            filename: '用户数据-' + new Date().getTime(),
            columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length - 1),
            data: this.data
          })
        }
      }
    }
  }
</script>
