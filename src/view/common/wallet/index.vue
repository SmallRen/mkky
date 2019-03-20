<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>转账管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">
              <Button :disabled="setting.loading" type="warning" @click="getOrderStatus('0')">
                <Icon type="md-color-filter"/>&nbsp;待审核
              </Button>
              <Button :disabled="setting.loading" type="success" @click="getOrderStatus('1')">
                <Icon type="md-checkmark"/>
                已完成
              </Button>
              <Button :disabled="setting.loading" type="error" @click="getOrderStatus('2')">
                <Icon type="md-close"/>&nbsp;提现失败
              </Button>
              <Button :disabled="setting.loading" type="success" @click="getData">
                <Icon type="md-refresh"></Icon>&nbsp;刷新数据
              </Button>




            </Col>
            <Col span="9">

              <Input v-model="search.value" placeholder="请输入您想要搜索的订单号..." class="margin-bottom-10">
                <Button slot="append" icon="ios-search" @click="find()"></Button>
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
    <Modal v-model="updateModal.show" width="360">
      <p slot="header" style="color:green;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认完成？</p>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long :loading="updateModal.setting.loading" @click="handleFinish">确认处理完成
        </Button>
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
        updateIndex: '',
        selections: [],
        updateModal: {
          show: false,
          setting: {
            loading: false,
            showBorder: false
          },
        },
        setting: {
          loading: false,
          showBorder: false
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
          {title: '提现订单id', key: 'withdrawalId', sortable: true},
          {title: '提现的用户', key: 'withdrawalUserid', sortable: true},
          {title: '提现说明', key: 'withdrawalExplain', sortable: true},
          {title: '提现金额', key: 'withdrawalMoney', sortable: true},

          {
            title: '提现时间',
            key: 'withdrawalTime',
            render: (h, params) => {
              return h('span', dayjs(params.row.withdrawalTime * 1000).format('YYYY年MM月DD日 HH:mm:ss'))
            },
            sortable: true
          }, {
            title: '提现状态',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              if (params.row.withdrawalState == 0) {
                return h('Tag', {props: {color: 'success'}}, '正在处理')
              } else {
                return h('Tag', {props: {color: 'primary'}}, '已完成')
              }

            },
          },
          {
            title: '操作',
            key: 'action',
            width: 260,
            align: 'center',
            render: (h, params) => {
              if (params.row.withdrawalState == 0) {
                return h('Button', {
                  props: {type: 'primary', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this.updateStatus(params.index)
                    }
                  }
                }, '处理完成')
              }

            }
          }
        ],
        data: {},
        dataFilter: {
          page: 1,
          pageSize: 10
        },
        removeObject: null,
        roles: null
      }
    },
    components: {},
    created() {
      this.getData()
    },
    methods: {
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

      async getOrderStatus(status) {
        try {
          let res = await get(this.$url.WithdrawalOrderBylist, {
            page: this.dataFilter.page,
            rows: this.dataFilter.pageSize,
            withdrawal_state: status
          })
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
      },
      async find() {

        if (this.search.value === '') {
          this.$Message.error('模板id不能为空')
          return
        }
        try {
          let res = await get(this.$url.KeyList, {
            basic_id: this.search.value,
          })
          if (res.status === 1) {
            this.data = []
            this.data.push(res.data)
          } else {
            this.$Message.error('操作失败')
          }

        } catch (error) {
          this.$throw(error)
        }
      },
      updateStatus(index) {
        this.updateIndex = index
        this.updateModal.show = true
      },
      async handleFinish() {
        try {
          let res = await post(this.$url.orderUpdate, {
            withdrawalId: this.data.list[this.updateIndex].withdrawalId,
            withdrawalState: 1,
          })
          if (res.status === 1) {
            this.data.list[this.updateIndex].withdrawalState = 1
            this.updateModal.setting.loading = false
            this.updateModal.show = false
            this.$Message.success('操作成功')
          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          this.$throw(error)
          this.$Message.error('操作失败')
        }
      },
      /**
       * @description 获取列表
       */
      async getData() {
        this.setting.loading = true
        try {
          let res = await get(this.$url.getOrderList, {
            page: this.dataFilter.page,
            rows: this.dataFilter.pageSize
          })
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
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
