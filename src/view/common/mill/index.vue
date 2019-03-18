<template>
  <div>
    <Card>
      <p slot="title" class="card-title">
        <Icon type="home"></Icon>
        <span>矿机管理</span>
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


    <Modal v-model="modal.show" title="属性"
           :mask-closable="false" :closable="false" :width="1000">
      <Form ref="modalForm" :model="modal" :label-width="120">

        <row>
          <Col span="8">
            <FormItem label="矿机名称" prop="machineName">
              <Input v-model.trim="modal.data.machineName"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="矿机IP" prop="machineIp">
              <Input v-model.trim="modal.data.machineIp"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="连接用户名" prop="miningUsername">
              <Input v-model.trim="modal.data.miningUsername"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="连接密码" prop="miningUserpwd">
              <Input v-model.trim="modal.data.miningUserpwd"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="MAC地址" prop="macAddress">
              <Input v-model.trim="modal.data.macAddress"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="用户ID" prop="dcUserid">
              <Input v-model.trim="modal.data.dcUserid"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="矿机图片" prop="machineImg">
              <Input v-model.trim="modal.data.machineImg"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="矿机型号" prop="nameOfMine">
              <Input v-model.trim="modal.data.nameOfMine"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="矿机版本" prop="systemVersion">
              <Input v-model.trim="modal.data.systemVersion"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="上次启动时间" prop="startupTime">
              <Input v-model.trim="modal.data.startupTime"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="运行时间" prop="runningTime">
              <Input v-model.trim="modal.data.runningTime"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="网络类型" prop="networkType">
              <Input v-model.trim="modal.data.networkType"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="网络地址" prop="ipAddress">
              <Input v-model.trim="modal.data.ipAddress"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="子网掩码" prop="subnetMask">
              <Input v-model.trim="modal.data.subnetMask"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="广播地址" prop="broadcastAddress">
              <Input v-model.trim="modal.data.broadcastAddress"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="矿机盘位" prop="harddiskTub">
              <Input v-model.trim="modal.data.harddiskTub"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="硬盘大小" prop="harddiskSize">
              <Input v-model.trim="modal.data.harddiskSize"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="最大硬盘" prop="harddiskMax">
              <Input v-model.trim="modal.data.harddiskMax"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="机箱高度" prop="chassisHeight">
              <Input v-model.trim="modal.data.chassisHeight"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="热插拔" prop="hotPlug">
              <Input v-model.trim="modal.data.hotPlug"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="硬盘接口" prop="hardDiskInterface">
              <Input v-model.trim="modal.data.hardDiskInterface"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="CPU插槽数" prop="cpuSize">
              <Input v-model.trim="modal.data.cpuSize"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="内存插槽数" prop="storageSize">
              <Input v-model.trim="modal.data.storageSize"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="矿机内存" prop="machineStorage">
              <Input v-model.trim="modal.data.machineStorage"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="运行状态" prop="systemHardDisk">
              <Input v-model.trim="modal.data.systemHardDisk"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="网卡=》矿场所在坐标" prop="networkCard">
              <Input v-model.trim="modal.data.networkCard"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="电源=》网络环境" prop="powerSupply">
              <Input v-model.trim="modal.data.powerSupply"></Input>
            </FormItem>
          </Col>
        </row>
        <row>
          <Col span="8">
            <FormItem label="入库时间" prop="machineTime">
              <DatePicker disabled :value="modal.data.machineTime" format="yyyy年MM月dd日 hh:mm:ss" type="date"
                          style="width: 200px"></DatePicker>
            </FormItem>
          </Col>
        </row>

      </Form>
      <div slot="footer">
        <Button type="default" :disabled="modal.loading" @click="cancel()">取消</Button>
        <Button type="primary" :loading="modal.loading" @click="ok()">确定</Button>
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
        //添加还是修改标识
        operation: '',
        //批量选择
        selections: [],
        removeModal: false,
        //添加修改的模态框绑定的数据
        modal: {
          loading: false,
          show: false,
          data: {
            machineId: '',
            machineName: '',
            machineIp: '',
            chinePort: '',
            miningUsername: '',
            miningUserpwd: '',
            macAddress: '',
            dcUserid: '',
            machineImg: '',
            nameOfMine: '',
            systemVersion: '',
            startupTime: '',
            runningTime: '',
            networkType: '',
            ipAddress: '',
            subnetMask: '',
            broadcastAddress: '',
            harddiskTub: '',
            harddiskSize: '',
            harddiskMax: '',
            chassisHeight: '',
            hotPlug: '',
            hardDiskInterface: '',
            cpuSize: '',
            storageSize: '',
            machineStorage: '',
            systemHardDisk: '',
            networkCard: '',
            powerSupply: '',
            machineTime: ''
          },
          data1: {
            machineId: '',
            machineName: '',
            machineIp: '',
            chinePort: '',
            miningUsername: '',
            miningUserpwd: '',
            macAddress: '',
            dcUserid: '',
            machineImg: '',
            nameOfMine: '',
            systemVersion: '',
            startupTime: '',
            runningTime: '',
            networkType: '',
            ipAddress: '',
            subnetMask: '',
            broadcastAddress: '',
            harddiskTub: '',
            harddiskSize: '',
            harddiskMax: '',
            chassisHeight: '',
            hotPlug: '',
            hardDiskInterface: '',
            cpuSize: '',
            storageSize: '',
            machineStorage: '',
            systemHardDisk: '',
            networkCard: '',
            powerSupply: '',
            machineTime: ''
          }
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
          {title: 'ID （硬件信息）', key: 'machineId', sortable: true},
          {title: '矿机名称', key: 'machineName', sortable: true},
          {title: '每个矿机ip', key: 'machineIp', sortable: true},
          {title: '矿机的端口', key: 'machinePort', sortable: true},
          {title: 'MAC地址', key: 'macAddress', sortable: true},
          {title: '矿机型号', key: 'nameOfMine', sortable: true},
          {title: '系统版本', key: 'systemVersion', sortable: true},
          {title: '内网IP地址', key: 'ipAddress', sortable: true},

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
                      this.openAddModal(params.index)
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

      async find() {

      },
      /**
       * @description 删除用户
       */
      async removeUser() {
        this.removeModal = false
        if (this.removeObject == null) {
          this.$Message.warning('删除对象为空，无法继续执行！')
          return false
        }


        this.setting.loading = true

        try {
          let res = await get(this.$url.deleteMiningMachine, {basic_id: this.data.list[this.removeObject.index].machineId})
          if (res.status === 1) {
            this.$Message.success('操作成功！')
            this.data.list.splice(this.removeObject.index, 1)
          } else {
            this.$Message.error('操作失败')
          }
        } catch (error) {
          this.$throw(error)
        }

        this.setting.loading = false
      },

      /**
       * @description 获取用户列表
       */
      async getData() {
        this.setting.loading = true
        try {
          let res = await get(this.$url.listMiningMachine, {
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
       * @description 打开模态窗口
       * @param index 矿机id
       * @param type 打开类型
       */
      openAddModal(index) {
        if (index === null) {
          this.operation = 'add'
          this.modal.data = this.modal.data1
        } else {
          this.operation = 'update'
          this.modal.data = this.data.list[index]
          this.modal.data.machineTime = dayjs(this.data.list[index].machineTime).format('YYYY年MM月DD日 HH:mm:ss')
        }
        this.modal.show = true
      },
      ok() {
        let url = ''
        if (this.operation === 'add') {
          url = this.$url.insertMiningMachine
        } else {
          url = this.$url.updateMiningMachine
        }
        this.addUpdate(url)
      },
      async addUpdate(url) {
        delete this.modal.data['machineTime']
        this.modal.loading = true
        try {
          let res = await post(url, this.modal.data)
          if (res.status === 1) {
            this.$Message.success('操作成功！')
            this.getData()
          } else {
            this.$Message.error('操作失败！')
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
