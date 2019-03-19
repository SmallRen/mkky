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
              <Button type="info" @click="modalAdd()">
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
                 :data="data.list">

          </Table>
          <Page :total="data.total" class="tr" @on-change="pageChange"
                :page-size="data.pageSize"
                @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
        </template>
      </div>
    </Card>
    <Modal v-model="modal.show" title="属性"
           :mask-closable="false" :closable="false" :width="800">
      <Form ref="modalForm" :model="modal.informaHeadline" :label-width="80">
        <FormItem label="标题" prop="informaHeadline">
          <Input v-model.trim="modal.data.informaHeadline"></Input>
        </FormItem>
        <FormItem label="图片地址" prop="informa_img">
          <Input v-model.trim="modal.data.informa_img"></Input>
        </FormItem>
        <FormItem label="内容" prop="informaContent">
          <Editor v-model="modal.data.informaContent" :isClear="editor.isClear" @change="change"></Editor>
        </FormItem>
        <FormItem label="资讯状态" prop="informaState">
          <RadioGroup v-model="modal.data.informaState">
            <Radio label="0">上架</Radio>
            <Radio label="1">下架</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal.loading" @click="cancel(false)">取消</Button>
        <Button type="primary" :loading="modal.loading" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal2.show" title="属性"
           :mask-closable="false" :closable="false" :width="800">
      <Form ref="modalForm2" :model="modal2.informaHeadline" :label-width="80">
        <FormItem label="标题" prop="informaHeadline">
          <Input v-model.trim="modal2.data.informaHeadline"></Input>
        </FormItem>
        <FormItem label="图片地址" prop="informa_img">
          <Input v-model.trim="modal2.data.informa_img"></Input>
        </FormItem>
        <FormItem label="内容" prop="informaContent">
          <Editor v-model="modal2.data.informaContent" :isClear="editor.isClear"></Editor>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal2.loading" @click="cancel1(false)">取消</Button>
        <Button type="primary" :loading="modal2.loading" @click="ok1">确定</Button>
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
  import { post, get, put, del } from '@/libs/axios-cfg'
  import Update from './components/update.vue'
  import Editor from './components/editor.vue'
  import imgUp from './components/imgUp.vue'
  import './index.less'

  export default {
    data () {
      return {
        updateIndex: '',
        typeOperation: '',
        updateUserModal: false,
        resetPasswordModal: false,
        updateUserId: null,
        resetPasswordUser: null,
        selections: [],
        removeModal: {
          show: false
        },
        setting: {
          loading: true,
          showBorder: true
        },
        modal: {
          loading: false,
          show: false,
          data: {
            informaId: '',
            informaHeadline: '',
            informaContent: '',
            informa_img: '',
            informaState: '0'
          }
        },

        modal2: {
          addRules: {
            informaHeadline: [{ required: true, message: '标题不能为空' }],
            informaContent: [{ required: true, message: '内容不能为空' }],
            informa_img: [{ required: true, message: '地址不能为空' }],
          },

          loading: false,
          show: false,
          data: {
            informaHeadline: '',
            informaContent: '',
            informa_img: ''
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
          { title: '资讯id', key: 'informaId', sortable: true, align: 'center', width: 300, },
          { title: '资讯名称', key: 'informaHeadline', sortable: true, align: 'center' },
          { title: '资讯图片url', key: 'informa_img', sortable: true, align: 'center'},
          {
            title: '创建日期',
            key: 'informaTime', width: 180,
            render: (h, params) => {
              return h('span', dayjs(params.row.informaTime*1000).format('YYYY年MM月DD日 HH:mm:ss'))
            },

            sortable: true
          },
          {
            title: '状态',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              if (params.row.informaState == 0) {
                return h('Tag', { props: { color: 'blue' } }, '上架')
              } else {
                return h('Tag', { props: { color: 'red' } }, '下架')
              }

            },
          },
          {
            title: '操作',
            key: 'action',
            width: 160,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.modalUpdate(params.index)
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
    components: {
      Update, Editor, imgUp
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
          let res = await get(this.$url.informationList, {
            page: this.dataFilter.page,
            limit: this.dataFilter.limit
          })
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      },
      modalAdd () {
        this.modal2.data.informaHeadline = ''
        this.modal2.data.informaContent = ''
        this.modal2.data.informa_img = ''
        this.modal2.show = true
      },
      /**
       * @description 打开模态窗口
       * @param uid 用户ID
       * @param type 打开类型
       */
      modalUpdate (index) {
        let temp1 = this.data.list[index]
        let obj = JSON.parse(JSON.stringify(temp1))
        delete obj['informaTime']
        this.modal.data = obj
        this.modal.data.informaState = this.modal.data.informaState + ''


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
      cancel1 (reload = false) {
        this.modal2.show = false
      },
      /**
       * @description 确定按钮单击回调
       */
      async ok () {
        this.$refs.modalForm.validate(valid => {
          if (valid) {
            this.modal.loading = true
            let url = ''
            url = this.$url.informationUpdate
            this.modal.loading = true

            this.update(url)
          }
        })
      },
      async ok1 () {
        this.$refs.modalForm2.validate(valid => {
            if (valid) {
              this.modal2.loading = true
              let url = ''
              url = this.$url.informationAdd
              this.modal2.loading = true
              this.add(url)

            } else {
              alert('fg')
            }
          }
        )
      },
      async add (url) {
        try {
          let res = await post(url, this.modal2.data)
          console.log(res)
          if (res.status === 1) {
            this.modal2.loading = false
            this.$Message.success('操作成功')
            let data = JSON.parse(JSON.stringify(this.modal.data))
            this.getData()
            this.modal2.show = false
          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          this.$throw(error)
        }

      },
      async update (url) {
        try {
          let res = await post(url, this.modal.data)

          if (res.status === 1) {
            this.modal.loading = false
            this.$Message.success('操作成功')
            this.getData()
          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          this.$throw(error)


        } this.modal.loading = false
        this.modal.show = false

      }
      ,
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
          let res = await del(this.$url.informationDelete, { informaId: this.data.list[this.removeObject.index].informaId })
          console.log(res)

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
