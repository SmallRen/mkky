<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>矿机模板管理</span>
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
              <Input v-model="search.value" placeholder="请输入您想要搜索的模板id..." class="margin-bottom-10">
                <Button slot="append" icon="ios-search" @click="find()"></Button>
              </Input>
            </Col>
          </Row>
          <Table ref="table" class="margin-bottom-10" @on-selection-change="selectionChange"
                 :columns="columns" :loading="setting.loading" :border="setting.showBorder"
                 :data="data"></Table>
        </template>
      </div>
    </Card>

    <Modal v-model="modal.show" title="属性"
           :mask-closable="false" :closable="false" :width="800">
      <Form ref="modalForm" :model="modal.data" :label-width="100">
        <row>
          <Col span="12">
            <FormItem label="矿机名称" prop="basicName">
              <Input v-model.trim="modal.data.basicName"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="矿机封面图" prop="basicImg">
              <Input v-model.trim="modal.data.basicImg"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="矿机型号" prop="nameOfMine">
              <Input v-model.trim="modal.data.nameOfMine"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="系统版本" prop="systemVersion">
              <Input v-model.trim="modal.data.systemVersion"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="网络类型" prop="networkType">
              <Input v-model.trim="modal.data.networkType"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="内网IP地址" prop="ipAddress">
              <Input v-model.trim="modal.data.ipAddress"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="子网掩码" prop="subnetMask">
              <Input v-model.trim="modal.data.subnetMask"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="广播地址" prop="broadcastAddress">
              <Input v-model.trim="modal.data.broadcastAddress"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="矿机盘位" prop="orePan">
              <Input v-model.trim="modal.data.orePan"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="硬盘大小" prop="panSize">
              <Input v-model.trim="modal.data.panSize"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="最大硬盘" prop="maximumSize">
              <Input v-model.trim="modal.data.maximumSize"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="机箱高度" prop="chassisHeight">
              <Input v-model.trim="modal.data.chassisHeight"></Input>
            </FormItem>
          </Col>
        </row>

        <row>
          <Col span="12">
            <FormItem label="热拔插" prop="hotPlug">
              <Input v-model.trim="modal.data.hotPlug"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="硬盘接口" prop="hardDiskInterface">
              <Input v-model.trim="modal.data.hardDiskInterface"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="CPU插槽数" prop="cpuSize">
              <Input v-model.trim="modal.data.cpuSize"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="内存插槽数" prop="memorySize">
              <Input v-model.trim="modal.data.memorySize"></Input>
            </FormItem>
          </Col>
        </row>

        <row>
          <Col span="12">
            <FormItem label="矿机内存" prop="miningMachineSize">
              <Input v-model.trim="modal.data.miningMachineSize"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="运行状态" prop="systemHardDisk">
              <Input v-model.trim="modal.data.systemHardDisk"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="12">
            <FormItem label="电源=》网络环境" prop="powerSupply">
              <Input v-model.trim="modal.data.powerSupply"></Input>
            </FormItem>
          </Col>
          <!--<Col span="12">
            <FormItem label="入库时间" prop="computerTime">
              <DatePicker :value="modal.data.computerTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期"
                          style="width: 200px"></DatePicker>
            </FormItem>
          </Col>-->
        </row>


      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal.loading" @click="cancel()">取消</Button>
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
        <Button type="error" size="large" long :loading="setting.loading" @click="removeBasic">确认删除</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import {post, get} from '@/libs/axios-cfg'

  export default {
    data() {
      return {
        modal: {
          loading: false,
          show: false,
          data: {
            basicId: '',
            basicName: '',
            basicImg: '',
            nameOfMine: '',
            systemVersion: '',
            networkType: '',
            ipAddress: '',
            subnetMask: '',
            broadcastAddress: '',
            orePan: '',
            panSize: '',
            maximumSize: '',
            chassisHeight: '',
            hotPlug: '',
            hardDiskInterface: '',
            cpuSize: '',
            memorySize: '',
            miningMachineSize: '',
            systemHardDisk: '',
            networkCard: '',
            powerSupply: '',
            computerTime: '',
          }
        },
        selections: [],
        removeModal: false,
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
          {title: '模板ID', key: 'basicId', sortable: true},
          {title: '矿机类型', key: 'basicName', sortable: true},
          {title: '矿机封面图', key: 'basicImg', sortable: true},
          {title: '矿机型号', key: 'nameOfMine', sortable: true},
          {title: '网络类型', key: 'systemVersion', sortable: true},
          {title: 'IP地址', key: 'ipAddress', sortable: true},
          {
            title: '入库时间',
            key: 'computerTime',
            render: (h, params) => {
              return h('span', dayjs(params.row.computerTime * 1000).format('YYYY年MM月DD日 HH:mm:ss'))
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
                  props: {type: 'primary', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this.updateModal(params.index)
                    }
                  }
                }, '修改'),

                h('Button', {
                  props: {type: 'error', size: 'small'},
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
        data: [],
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
      async find() {
        if (this.search.value === '') {
          this.$Message.error('订单号不能为空')
          return
        }
        this.data = []
        try {
          let res = await get(this.$url.KeyList, {
            basic_id: this.search.value,
          })
          if (res.status === 1) {
            this.data.push(res.data)
          } else if (res.data === null) {
            this.$Message.error('未查到该订单')
          }
        } catch (error) {
          this.$throw(error)
        }
      },
      /**
       * @description 删除用户
       */
      removeBasic() {
        this.removeModal = false
        if (this.removeObject == null) {
          this.$Message.warning('删除对象为空，无法继续执行！')
          return false
        }
        this.deleteBasic()
      },
      async ok() {
        delete this.modal.data['computerTime']
        this.modal.loading = true
        try {
          let res = await post(this.$url.updateMining, this.modal.data)
          if (res.status === 1) {
            this.getData()
            this.$Message.success('操作成功！')
          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          this.$throw(error)
        }
        this.modal.loading = false
        this.modal.show = false
      },
      cancel() {
        this.modal.show = false
      },
      updateModal(index) {
        let temp1 = this.data[index]
        let obj = JSON.parse(JSON.stringify(temp1))
        this.modal.data = obj
        //this.modal.data.computerTime = dayjs(this.modal.data.computerTime *1000).format('YYYY年MM月DD日 HH:mm:ss')
        this.modal.show = true
      },
      async deleteBasic() {
        this.setting.loading = true
        try {
          let res = await get(this.$url.deleteMining, {
            basic_id: this.data[this.removeObject.index].basicId,
          })
          if (res.status === 1) {
            this.data.splice(this.removeObject.index, 1)
          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          this.$throw(error)
        }
        this.setting.loading = false
      }
      ,
      /**
       * @description 获取用户列表
       */
      async getData() {
        this.setting.loading = true
        try {
          let res = await get(this.$url.MiningMachineBasicList, {
            page: this.dataFilter.page,
            rows: this.dataFilter.pageSize
          })
          if (res.status === 1) {
            this.data = res.data
          } else {
            this.$Message.error('操作失败')
          }
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
