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
              <Button type="info" @click="openAddModal(null)">
                <Icon type="md-add"></Icon>&nbsp;添加
              </Button>
              <Button :disabled="setting.loading" type="success" @click="getData">
                <Icon type="md-refresh"></Icon>&nbsp;刷新数据
              </Button>
              <Button type="primary" @click="exportData(1)">
                <Icon type="ios-download-outline"></Icon>&nbsp;导出表格
              </Button>
              <Button :disabled="selections.length==0 || setting.loading" type="error" @click="sendEmail(false)">
                <Icon type="trash-a"></Icon>&nbsp;发送邮件
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
                 :data="data">

          </Table>
          <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.current"
                :page-size="data.size"
                @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </template>
      </div>
    </Card>
    <Modal v-model="modal.show" title="属性"
           :mask-closable="false" :closable="false" :width="800">
      <Form ref="modalForm" :model="modal.data" :label-width="40">
        <FormItem label="标题" prop="courseExplain">
          <Input v-model.trim="modal.data.courseExplain"></Input>
        </FormItem>
        <FormItem label="图片" prop="courseImg">
          <imgUp></imgUp>
        </FormItem>
        <FormItem label="内容" prop="courseContent">
          <Editor v-model="modal.data.courseContent" :isClear="editor.isClear" @change="change"></Editor>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal.loading" @click="cancel(false)">取消</Button>
        <Button type="primary" :loading="modal.loading" @click="ok">确定</Button>
      </div>
    </Modal>


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

    <Update v-if="updateUserModal" :roles="roles" :uid="updateUserId" @cancel="onModalCancel"/>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import { post } from '@/libs/axios-cfg'
  import Add from './components/add.vue'
  import Update from './components/update.vue'
  import Editor from './components/editor.vue'
  import imgUp from './components/imgUp.vue'

  export default {
    data () {
      return {
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
        modal: {
          loading: false,
          show: false,
          data: {
            courseExplain: '',
            courseImg: '',
            courseContent: '',
            contentState: '',
          }
        },
        editor: {
          isClear: false
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
          { title: '资讯id', key: 'informaId', sortable: true, align: 'center' ,width:180,},
          { title: '资讯名称', key: 'informaHeadline', sortable: true, align: 'center',width:100, },
          { title: '资讯图片url', key: 'informa_img', sortable: true, align: 'center' ,width:300,},
          { title: '资讯内容', key: 'informaContent', sortable: true, align: 'center' },
          {
            title: '资讯状态', key: 'informaState', sortable: true, align: 'center',width:120,
            render: (h, params) => {

              return h('Tag',
                {
                  props: {
                    color: params.row.informaState == 1 ? 'error' : 'success'
                  }
                }, params.row.informaState == 1 ? '下架' : '上架')

            },
          },

          {
            title: '创建日期',
            key: 'informaTime',width:180,
            render: (h, params) => {
              return h('span', dayjs(params.row.createDate).format('YYYY年MM月DD日 HH:mm:ss'))
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
                  props: { type: params.row.status == 1 ? 'warning' : 'success', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {

                    }
                  }
                }, '上架'),
                h('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.openAddModal(params.row.id)
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
        data: [
          {
            informaId: 'ADF722D7S1SD5F2S8',
            informaHeadline: '资讯标题',
            informaTime: '2019-03-01 12:42:56',
            informaState: '1',
            informaContent: '这是资讯的标题',
            informa_img: 'https://www.renbaojia.com/static/img/sy_img1.jpg',
          }
        ],
        dataFilter: {
          page: 1,
          pageSize: 10
        },
        removeObject: null,
        roles: null
      }
    },
    components: {
      Add, Update, Editor, imgUp
    },
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
      /**
       * @description 发送邮件
       */
      async sendEmail (single = false) {
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
          //this.$throw(error)
          this.$Message.destroy()
          this.$Message.success({
            content: '发送邮件成功',
            duration: 1.5
          })
        }
        this.setting.loading = false
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
      async getData () {
        this.setting.loading = true
        try {
          /*let res = await post('/system/user/list', {
           page: this.dataFilter.page,
           pageSize: this.dataFilter.pageSize
         })*/
          //this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      },
      /**
       * @description 获取角色列表
       */
      async getRoleList () {
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
      openAddModal (uid, type = 'update') {

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
       * @description 关闭Modal
       * @param reload 是否重新加载数据
       */
      cancel (reload = false) {
        this.modal.show = false
      },
      /**
       * @description 确定按钮单击回调
       */
      ok () {
        this.$refs.modalForm.validate(valid => {
          if (valid) {
            this.modal.loading = true
            this.$Message.success('照片添加成功')
            this.modal.loading = false
            this.modal.show = false
          }

        })
      },
      change (val) {
        // console.log(val)
        //this.img.courseContent = val
      },
    }
  }
</script>
