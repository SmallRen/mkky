<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>订单管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">

              <Button :disabled="setting.loading" type="success" @click="getData">
                <Icon type="md-refresh"></Icon>&nbsp;刷新数据
              </Button>
              <Button type="primary" @click="exportData(1)">
                <Icon type="ios-download-outline"></Icon>&nbsp;导出表格
              </Button>
              <Button type="warning" @click="orderStatus(0)">
                <Icon type="md-albums"></Icon>&nbsp;待审核
              </Button>
              <Button type="success" @click="orderStatus(1)">
                <Icon type="md-checkmark"></Icon>&nbsp;已完成
              </Button>
            </Col>
            <Col span="9">
              <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." @click="find()" class="margin-bottom-10">
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
           :mask-closable="false" :closable="false" :width="800">
      <Form ref="modalForm" :model="modal" :label-width="80">
        <FormItem label="用户ID" prop="orderId">
          <Input v-model.trim="modal.data.orderId"></Input>
        </FormItem>
        <FormItem label="矿机ID" prop="machineId">
          <Input v-model.trim="modal.data.machineId"></Input>
        </FormItem>
        <FormItem label="订单描述" prop="orderDescription">
          <Select v-model="modal.data.orderDescription" style="width:200px">
            <Option v-for="item in currencyList" :value="item.currencyName" :key="item.currencyName">{{
              item.currencyName }}
            </Option>
          </Select>
        </FormItem>


        <FormItem label="订单状态" prop="orderStatus">
          <RadioGroup v-model="modal.data.orderStatus">
            <Radio label="0">待审核</Radio>
            <Radio label="1">以完成</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="订单状态" prop="orderinfoStatus">
          <RadioGroup v-model="modal.data.orderinfoStatus">
            <Radio label="0">添加切换记录</Radio>
            <Radio label="1">删除切换记录</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal.loading" @click="cancel(false)">取消</Button>
        <Button type="primary" :loading="modal.loading" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="removeModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="setting.loading" @click="removeUser">确认删除</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import { post, get, del, put } from '@/libs/axios-cfg'

  export default {
    data () {
      return {
        addUserModal: false,
        updateUserModal: false,
        resetPasswordModal: false,
        updateUserId: null,
        resetPasswordUser: null,
        selections: [],
        removeModal: false,
        setting: {
          loading: true,
          showBorder: true
        },
        currencyList: {},
        modal: {
          show: false,
          data: {
            currencyId: '',
            orderId: '',
            userId: '',
            machineId: '',
            orderStatus: '',
            orderinfoStatus: '',
            orderDescription: '',
          }
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
          { title: '订单ID', key: 'orderId', sortable: true },
          { title: '用户ID', key: 'userId', sortable: true },
          { title: '矿机Id', key: 'machineId', sortable: true },
          { title: '类型', key: 'orderDescription', sortable: true },

          {
            title: '创建日期',
            key: 'createTime',
            render: (h, params) => {
              return h('span', dayjs(params.row.createTime * 1000).format('YYYY年MM月DD日 HH:mm:ss'))
            },
            sortable: true
          },
          {
            title: '订单状态',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              if (params.row.orderStatus == 0) {
                return h('Tag', { props: { color: 'warning' } }, '待审核')
              } else {
                return h('Tag', { props: { color: 'success' } }, '已完成')
              }

            },
          },
          {
            title: '完成时间',
            key: 'arriveTime',
            render: (h, params) => {
              return h('span', dayjs(params.row.arriveTime * 1000).format('YYYY年MM月DD日 HH:mm:ss'))
            },

            sortable: true
          },
          {
            title: '操作',
            key: 'action',
            width: 260,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.updateModel(params.index)
                    }
                  }
                }, '修改'),

                h('Button', {
                  props: { type: 'error', size: 'small' },
                  on: {
                    click: () => {
                      this.removeObject = {
                        obj: params.row,
                        index: params.index
                      }
                      this.removeModal = true
                    }
                  }
                }, '删除')
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
        order_status: '0'
      }

    },
    components: {},
    created () {
      this.getData(this.order_status)
      this.getCurrencyList()

    },
    methods: {
      orderStatus (status) {
        this.order_status = status
        this.getData(status)
      },
      async getCurrencyList () {
        try {
          let res = await get(this.$url.currencyList, {
            page: this.dataFilter.page,
            limit: 100,
          })
          this.currencyList = res.data.list
        } catch (error) {
          this.$throw(error)
        }
      },
      /**
       * @description 批量选择回调
       */
      selectionChange (list) {
        this.selections = list
      },
      /**
       * @description 分页更换事件回调
       */
      pageChange (p) {
        this.dataFilter.page = p
        this.getData(this.order_status)
      },
      /**
       * @description 分页每页显示数量改变事件回调
       */
      pageSizeChange (p) {
        this.dataFilter.pageSize = p
        this.getData(this.order_status)
      },

      async find () {

      },
      /**
       * @description 删除用户
       */
      async removeUser () {
        this.removeModal = false
        if (this.removeObject == null) {
          this.$Message.warning('删除对象为空，无法继续执行！')
          return false
        }
        this.setting.loading = true
        this.data.records.splice(this.removeObject.index, 1)
        this.setting.loading = false
      },

      /**
       * @description 获取用户列表
       */
      async getData (status) {
        this.setting.loading = true
        try {
          let res = await get(this.$url.getOrderInfo, {
            page: this.dataFilter.page,
            rows: this.dataFilter.pageSize,
            status: status,
            number: 1
          })
          debugger
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      },
      /**
       * @description 打开模态窗口
       * @param uid 用户ID
       * @param type 打开类型
       */
      updateModel (index) {
        this.modal.data = this.data.list[index]
        this.modal.data.orderStatus = this.modal.data.orderStatus + ''
        this.modal.data.orderinfoStatus = this.modal.data.orderinfoStatus + ''
        delete this.modal.data['createTime']
        delete this.modal.data['arriveTime']
        this.modal.show = true
      },
      /**
       * @description 关闭模态窗口
       * @param type 窗口类型
       * @param reload 是否重新加载数据
       */
      onModalCancel (type, reload = false) {
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
      async ok () {
        try {
          let res = await post(this.$url.getUpdateOrderInfo, this.modal.data)
          this.data = res.data
          if (res.status === 1) {
            this.$Message.success('操作成功！')
            this.getData(0)
          }
        } catch (error) {
          this.$throw(error)
        }
        this.modal.show = false
      },
      cancel () {
        this.modal.show = false
      },
      /**
       * @description 导出表格CSV
       */
      exportData (type) {
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
