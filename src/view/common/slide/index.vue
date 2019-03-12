<template>
  <div>
    <Row>
      <Card style="margin: 10px">
        <p slot="title">操作</p>
        <Button type="success" @click="attribute('add')">添加</Button>
      </Card>

      <div v-for="(item,index) in img" >
        <Col span="4" class="c-col">
          <Card class="c-height">
            <p slot="title">
              <Icon type="md-aperture" size="20"/>&nbsp;{{item.courseExplain}}
            </p>
            <div class="imgDiv"><img class="" v-bind:src="item.rotationImg">
              <div class="c-text-center">
                <Button size="small" type="warning" @click="attribute('update',index)">属性</Button>
                <Button size="small" type="info" @click="leftRemove(index)">左移</Button>
                <Button size="small" type="info" @click="rightRemove(index)">右移</Button>
                <Button size="small" type="success">替换</Button>
                <Button size="small" type="error" @click="deleteImg(index)">删除</Button>
              </div>
              <br>
              <h2>资讯内容</h2>
              <Divider/>
              <div class="c-div" slot="title" v-html="item.rotationConnet"></div>
            </div>
          </Card>
        </Col>

      </div>
    </Row>
    <Modal v-model="modal.show" title="属性"
           :mask-closable="false" :closable="false" :width="800">
      <Form ref="modalForm" :model="modal.data" :label-width="70" :rules="rules">

        <FormItem label="图片地址" prop="rotationImg">
          <Input v-model.trim="modal.data.rotationImg"></Input>
        </FormItem>
        <FormItem label="说明" prop="rotationConnet">
          <Editor v-model="modal.data.rotationConnet" :isClear="isClear" @change="change"></Editor>
        </FormItem>
        <FormItem label="图片应用">
          <RadioGroup v-model="modal.data.rotationState">
            <Radio label="0">首页资讯的图片</Radio>
            <Radio label="1">矿机页面的图片</Radio>
          </RadioGroup>
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
  import {post, get, del} from '@/libs/axios-cfg'
  import imgUp from './components/imgUp.vue'
  import Editor from './components/editor.vue'
  import './index.less'

  export default {
    data() {
      return {
        typeOperation: '',
        removeModal: {
          show: false,
          loading: false
        },
        updateIndex: '',
        deleteIndex: '',
        modal: {
          loading: false,
          show: false,
          data: {
            rotationId: '',
            rotationImg: '',
            rotationConnet: '',
            rotationState: '0'
          }
        },
        isClear: false,

        img: [],
        rules:{
          rotationImg: [
            { required: true, message: "图片地址不能为空" },
          ],
          rotationConnet: [
            { required: true, message: "不能为空" },
          ],
          rotationState: [
            { required: true, message: "不能为空" },
          ],

        }
      }
    },
    created() {
      this.getData()
    },
    methods:
      {
        /**
         * @description 获取轮播
         */
        async getData() {
          this.modal.loading = true
          try {
            let res = await get(this.$url.getRotation)
            this.img = res.data
          } catch (error) {
            this.$throw(error)
          }
          this.modal.loading = false
        },
        // 移动轮播图
        swapItems(arr, index1, index2) {
          arr[index1] = arr.splice(index2, 1, arr[index1])[0]
          return arr
        },
        attribute(type, index) {
          if (type === 'add') {
            this.modal.data.rotationId = ''
            this.modal.data.rotationImg = ''
            this.modal.data.rotationConnet = ''
          } else {
            this.typeOperation = 'update'
            this.updateIndex = index
            let temp1 = this.img[index]
            let obj = JSON.parse(JSON.stringify(temp1))
            debugger
            this.modal.data = obj
            this.modal.data.rotationState=this.modal.data.rotationState+""
          }
          this.modal.show = true
        },
        leftRemove(index) {
          if (this.img.length > 1 && index !== 0) {
            this.swapItems(this.img, index, index - 1)
            this.$Message.success('移动成功')
          }
        },
        rightRemove(index) {
          if (this.img.length > 1 && index !== (this.img.length - 1)) {
            this.swapItems(this.img, index, index + 1)
            this.$Message.success('移动成功')
          }
        },
        deleteImg(index) {
          this.deleteIndex = index
          if (this.removeModal.show === false) {
            this.removeModal.show = true
          }
        },
        /**
         * @description 关闭Modal
         * @param reload 是否重新加载数据
         */
        cancel(reload = false) {
          this.modal.show = false
        },
        /**
         * @description 确定按钮单击回调
         */
        async ok() {
          this.$refs.modalForm.validate(valid => {
            if (valid) {
              this.modal.loading = true
              let url = ''
              if (this.typeOperation === 'update') {
                url = this.$url.updateRotationChart
                this.img[this.updateIndex] = this.modal.data
                debugger
              } else {
                url = this.$url.addRotationChart
              }
              this.modal.loading = true
              this.updateAdd(url)
            }
          })
        },
        async updateAdd(url) {
          try {
            let res = await post(url, this.modal.data)
            console.log(res)

            if (res.status === 1) {
              this.modal.loading = false
              this.$Message.success('操作成功')
              let data = JSON.parse(JSON.stringify(this.modal.data))
              if(this.typeOperation != 'update'){
                this.img.push(data)
              }

            } else {
              this.$Message.error('操作失败')
            }
          } catch (error) {
            this.$throw(error)
          }
          this.modal.loading = false
          this.modal.show = false
        },
        /**
         * @Description 确认删除事件
         */
        confirmDelete() {
          this.delete()
        },
        async delete() {
          this.removeModal.loading = true
          try {
            let res = await del(this.$url.deleteRotationChart,{rotationId:this.img[this.deleteIndex].rotationId})
            console.log(res)
            if (res.status === 1) {
              this.modal.loading = false
              this.img.splice(this.deleteIndex, 1)
              this.$Message.success('删除成功！')
              this.removeModal.show = false
              this.removeModal.loading = false
            } else {
              this.$Message.error('删除失败！')
            }
          } catch (error) {
            this.$throw(error)
          }
        },
        change(val) {
          // console.log(val)
          this.img.rotationConnet = val
        }
      },
    components: {
      imgUp, Editor
    }
  }
</script>
