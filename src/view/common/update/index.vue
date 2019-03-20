<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>版本更新管理</span>
      </p>
      <div>
        <template>
          <Row>
            <Col span="15">
              <Button type="info" @click="modalAdd()">
                <Icon type="md-add"></Icon>&nbsp;添加新版本
              </Button>
              <Button :disabled="setting.loading" type="success" @click="getData">
                <Icon type="md-refresh"></Icon>&nbsp;刷新数据
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
      <Form ref="modalForm" :model="modal" :label-width="80">
        <FormItem label="版本号" prop="imprint">
          <Input v-model.trim="modal.data.imprint"></Input>
        </FormItem>
        <FormItem label="版本链接" prop="chainedAddress">
          <Input v-model.trim="modal.data.chainedAddress"></Input>
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

  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import { post, get, put, del } from '@/libs/axios-cfg'
  import './index.less'

  export default {
    data () {
      return {
        updateIndex: '',
        typeOperation: '',
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
            id: '',
            imprint: '',
            chainedAddress: '',
            releaseTime: '',

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
          { title: 'ID', key: 'id', sortable: true, align: 'center' },
          { title: '版本说明', key: 'imprint', sortable: true, align: 'center' },
          { title: '链接地址', key: 'chainedAddress', sortable: true, align: 'center' },
          {
            title: '版本时间',
            key: 'releaseTime', width: 180,
            render: (h, params) => {
              return h('span', dayjs(params.row.releaseTime * 1000).format('YYYY年MM月DD日 HH:mm:ss'))
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
          let res = await get(this.$url.getSoftwareUpdates, {
            page: this.dataFilter.page,
            rows: this.dataFilter.limit
          })
          this.data = res.data
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      },
      modalAdd () {
        this.modal.data.id = ''
        this.modal.data.imprint = ''
        this.modal.data.chainedAddress = ''
        this.modal.data.releaseTime = ''
        this.modal.show = true
      },
      /**
       * @description 打开模态窗口
       * @param uid 用户ID
       * @param type 打开类型
       */
      modalUpdate (index) {
        let temp1 = this.data.list[index]
        let obj = JSON.parse(JSON.stringify(temp1))
        this.modal.data = obj
        this.modal.data.informaState = this.modal.data.informaState + ''
        this.modal.data.informaTime = dayjs(this.modal.data.informaTime * 1000).format('YYYY年MM月DD日 HH:mm:ss')
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
            let url = ''
            this.modal.loading = true
            if (this.modal.data.id === '') {
              url = this.$url.getAddSoftwareUpdates
            } else {
              url = this.$url.getUpdateSoftwareUpdates
            }
            this.modal.loading = true

            this.update(url)
          }
        })
      },
      async update (url) {
        delete this.modal.data['releaseTime']
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

        }
        this.modal.loading = false
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
          let res = await get(this.$url.getDeleteSoftwareUpdates, { id: this.data.list[this.removeObject.index].id })
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
