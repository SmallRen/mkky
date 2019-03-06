<template>
  <div>
    <Row>
      <Card style="margin: 10px">
        <p slot="title">操作</p>
        <Button type="success" @click="attribute('add')">添加</Button>
      </Card>

      <div v-for="(item,index) in img">
        <Col span="4" class="c-col">
          <Card class="c-height">
            <p slot="title">
              <Icon type="md-aperture" size="20"/>&nbsp;{{item.courseExplain}}
            </p>
            <div class="imgDiv"><img class="" v-bind:src="item.courseImg">
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
              <div class="c-div" slot="title" v-html="item.courseContent"></div>
            </div>
          </Card>
        </Col>

      </div>
    </Row>
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
          <Editor v-model="modal.data.courseContent" :isClear="isClear" @change="change"></Editor>
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
  import { post } from '@/libs/axios-cfg'
  import imgUp from './components/imgUp.vue'
  import Editor from './components/editor.vue'
  import './index.less'

  export default {
    data () {
      return {
        typeOperation: '',
        removeModal: {
          show: false,
          loading: false,
        },
        updateIndex: '',
        deleteIndex: '',
        modal: {
          loading: false,
          show: false,
          data: {
            courseExplain: '',
            courseImg: '',
            courseContent: '',
            contentState: '',
          },
        },
        isClear: false,

        img: [
          {
            courseExplain: '资讯标题一',
            courseImg: 'https://www.renbaojia.com/static/img/sy_img1.jpg',
            courseContent: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无人与我立黄昏，无人问我粥可温。 无人陪我看星辰，无人醒我茶已冷。 无人于我捻熄灯，无人共我书半生。 无人陪我夜以深，无人与我把酒分。 无人问我言中泪，无人忧我独行身。 回首向来萧瑟处，无人等在灯火阑珊处。'
              + '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最美的风景就是皎洁的月光映在你微笑的脸上，甜美，楚楚动人。我多想对你说一句我爱你，但是你又是那么遥不可及。'
          }, {
            courseExplain: '资讯标题二',
            courseImg:
              'https://www.renbaojia.com/static/img/sy_img2.jpg',
            courseContent: ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不要活成当初少年时自己讨厌的模样。两个人在一起久了，就象左手和右手，即使不再相爱也会选择相守，因为放弃这么多年的时光需要很大的勇气。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;也许生命中会出现你爱的人，但那终归是过客，你还是会牵着你的左手或者右手一直走下去。——幸福有时候真的与爱情无关。'
          }, {
            courseExplain: '资讯标题三',
            courseImg:
              'https://www.renbaojia.com/static/img/sy_img3.jpg',
            courseContent: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生活从不简单，它偶尔让我们岁月静好 偶尔让我们含泪前行，命运弄人<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个中滋味，如人饮水，冷暖自知，但不论如何也不要绝望，世界那么大，对的人始终会出现。'
          }, {
            courseExplain: '资讯标题四',
            courseImg:
              'https://www.renbaojia.com/static/img/sy_img4.jpg',
            courseContent: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生活从不简单，它偶尔让我们岁月静好，偶尔让我们含泪前行，命运弄人 个中滋味，如人饮水，冷暖自知，但不论如何也不要绝望<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;世界那么大，对的人始终会出现。'
          }, {
            courseExplain: '资讯标题五',
            courseImg:
              'https://www.renbaojia.com/static/img/sy_img5.jpg',
            courseContent: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我没有花言巧语，只有默默的行动在实践着我的追梦<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我也暂时不期望不理解的人而理解我。世上只有最美的结果，才是最美的解释!'
          }]

      }
    },
    methods:
      {
        swapItems (arr, index1, index2) {
          arr[index1] = arr.splice(index2, 1, arr[index1])[0]
          return arr
        },
        attribute (type, index) {
          if (type == 'add') {
            this.modal.data.courseExplain = ''
            this.modal.data.courseImg = ''
            this.modal.data.courseContent = ''

            this.modal.show = true
          } else {
            this.typeOperation = 'update'
            this.updateIndex = index
            let temp1 = this.img[index]
            let obj = JSON.parse(JSON.stringify(temp1))
            this.modal.data = obj
            this.modal.show = true
          }

        }
        ,
        leftRemove (index) {
          if (this.img.length > 1 && index !== 0) {
            this.swapItems(this.img, index, index - 1)
            this.$Message.success('移动成功')
          }
        },
        rightRemove (index) {
          if (this.img.length > 1 && index !== (this.img.length - 1)) {
            this.swapItems(this.img, index, index + 1)
            this.$Message.success('移动成功')
          }
        },
        deleteImg (index) {
          this.deleteIndex = index
          if (this.removeModal.show == false) {
            this.removeModal.show = true
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
              if (this.typeOperation == 'update') {
                this.img[this.updateIndex].courseExplain = this.modal.data.courseExplain
                this.img[this.updateIndex].courseImg = this.modal.data.courseImg
                this.img[this.updateIndex].courseContent = this.modal.data.courseContent
              } else {

                this.$Message.success('照片添加成功')
                let data = JSON.parse(JSON.stringify(this.modal.data))
                this.img.push(data)

              }
              this.modal.loading = false
              this.modal.show = false
            }

          })
        },
        /**
         * @Description 确认删除事件
         */
        confirmDelete () {
          this.removeModal.loading = true
          this.img.splice(this.deleteIndex, 1)
          this.removeModal.show = false
          this.removeModal.loading = false
          this.$Message.success('删除成功！')
        },
        change (val) {
          // console.log(val)
          this.img.courseContent = val
        },
      },

    components: {
      imgUp, Editor
    }
  }
</script>

