<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>资讯管理</span>
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
            </Col>
            <Col span="9">
              <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." @click="find()" class="margin-bottom-10">
                <Button slot="append" icon="ios-search"></Button>
              </Input>
            </Col>
          </Row>
          <Table ref="table" class="margin-bottom-10" @on-selection-change="selectionChange"
                 :columns="columns" :loading="setting.loading" :border="setting.showBorder"
                 :data="data.list">

          </Table>
          <Page :total="data.total" class="tr" @on-change="pageChange"
                :page-size="data.pageSize"
                @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </template>
      </div>
    </Card>
    <Modal v-model="removeModal.show" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>此操作为不可逆操作，是否确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="removeModal.loading" @click="confirmDelete()">确认删除</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import { post, get, put, del } from '@/libs/axios-cfg'
  import Update from './components/update.vue'
  import Editor from './components/editor.vue'
  import imgUp from './components/imgUp.vue'
  import './index.less'

  export default {
    data () {
      return {
        selections: [],
        removeModal: {
          show: false
        },
        setting: {
          loading: true,
          showBorder: true
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
          { title: '意见反馈id', key: 'feedback_id', sortable: true, align: 'center', width: 300, },
          { title: '反馈用户', key: 'feedback_user', sortable: true, align: 'center', width: 180, },
          { title: '资讯图片url', key: 'feedback_comment', sortable: true, align: 'center', },
          {
            title: '创建日期',
            key: 'feedback_Time', width: 180,
            render: (h, params) => {
              return h('span', dayjs(params.row.feedback_Time).format('YYYY年MM月DD日 HH:mm:ss'))
            },

            sortable: true
          },

          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: { type: 'error', size: 'small' },
                  on: {
                    click: () => {
                      this.removeObject = {
                        obj: params.row,
                        index: params.index
                      }
                      this.removeModal.show = true
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        data: [],
        dataFilter: {
          page: 1,
          limit: 10
        },
        removeObject: null,
        roles: null
      }
    },
    components: {},
    created () {
      this.getData()
    },
    methods: {
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
        this.getData()
      },
      /**
       * @description 分页每页显示数量改变事件回调
       */
      pageSizeChange (p) {
        this.dataFilter.pageSize = p
        this.getData()
      },
      async find () {

      },
      /**
       * @description 获取反馈列表
       */
      async getData () {
        this.setting.loading = true
        try {
          let res = await get(this.$url.getUserFeedbackList, {
            page: this.dataFilter.page,
            rows: this.dataFilter.limit
          })
          debugger
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
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
      },
      /**
       * @Description 确认删除事件
       */
      confirmDelete () {
        this.delete()
      }
      ,
      async delete () {
        this.removeModal.loading = true
        try {
          let res = await del(this.$url.deleteUserFeedback, { feedbackId: this.data.list[this.removeObject.index].feedback_id })
          console.log(res)
          debugger
          if (res.status === 1) {
            this.modal.loading = false
            this.data.list.splice(this.removeObject.index, 1)
            this.$Message.success('删除成功！')
            this.removeModal.show = false
            this.removeModal.loading = false
          } else {
            this.$Message.error('删除失败！')
          }
        } catch (error) {
          this.$throw(error)
        }
      }
      ,
      change (val) {
        // console.log(val)
        //this.img.courseContent = val
      }
      ,
    }
  }
</script>
