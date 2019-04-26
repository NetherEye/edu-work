<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

<template>
  <div class="pub">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>办公管理</BreadcrumbItem>
      <BreadcrumbItem>设备保修</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">
            <FormItem>
              <Button type="primary" @click="repair">报修</Button>
            </FormItem>
          </Form>
        </div>

        <div class="table">
          <Table :data="tableData1" :columns="tableColumns1" stripe></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="total" :current="pageNumber" @on-change="changePage"></Page>
            </div>
          </div>
        </div>

      </div>
    </Card>
    <Modal v-model="modal" title="设备保修" width="800" footer-hide @on-cancel="cancelone">
      <Form :model="formItem" :label-width="80">
        <FormItem label="故障设备">
          <Input v-model="formItem.device" :maxlength="20" placeholder="请输入故障设备..."></Input>
        </FormItem>
        <FormItem label="故障地点">
          <Input v-model="formItem.faultAddress" :maxlength="40" placeholder="请输入故障地点..."></Input>
        </FormItem>
        <FormItem label="报修类别">
          <Select v-model="formItem.faultType">
            <Option value="物业类">物业类</Option>
            <Option value="设备类">设备类</Option>
          </Select>
        </FormItem>
        <FormItem label="上传图片" prop="gender">
          <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
            </div>
          </div>
          <Upload ref="upload" :on-progress="uploadPro" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :action="imgUrl" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="查看大图" v-model="visible">
            <img :src="imgName" style="width: 100%">
          </Modal>
        </FormItem>
        <FormItem label="故障描述">
          <Input v-model="formItem.describe" type="textarea" :maxlength="50" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入故障描述..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="isSumbit">提交</Button>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="img_modal" footer-hide width="800" @on-visible-change="dialogShow">
      <Carousel loop v-if="isImg">
        <Carousel-item v-for="(item, key) in imgs" :key="key" style="height: 400px">
          <img :src="item.url" style="" />
        </Carousel-item>
      </Carousel>
      <div v-else>暂无图片</div>
    </Modal>
  </div>
</template>

<script>
import school from '@/assets/api/school'
import fetch from '@/assets/tools/fetch'
import allApi from '@/assets/api/test'
export default {
  data () {
    return {
      img_modal: false,
      modal1: false,
      imgSrc: '',
      imgs: [],
      isImg: '',
      formItem: {
        device: '',
        faultAddress: '',
        faultType: '',
        describe: '',
        fileInfo: ''
      },
      modal: false,
      filter: {
        grade: '',
        class: '',
        search: ''
      },
      tableData1: [],
      pding: [],
      tableColumns1: [
        {
          title: '序号',
          render: (h, params) => {
            let index = params.index
            let i = this.pageSize * (this.pageNumber - 1) + index + 1
            return h('span', i)
          },
        },
        {
          title: '故障设备',
          key: 'device',
        },
        {
          title: '故障地点',
          key: 'faultAddress',
        },
        {
          title: '故障类型',
          key: 'faultType',
        },
        {
          title: '故障描述',
          key: 'describe',
        },
        {
          title: '图片',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            return h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              on: {
                click: () => {
                  this.imgSrc = row.id
                  this.img_modal = true
                }
              }
            }, '查看');
          }
        },
        {
          title: '报修日期',
          key: 'applyTime',
        },
        {
          title: '处理状态',
          key: 'handleStatus',
        },
        {
          title: '维修人员',
          key: 'maintainPerson',
        },
        // {
        // 	title: '班级排名',
        // 	key: 'ranking',
        // 	render: (h, params) => {
        // 		return h('div', 'Almost' + params.row.time + 'days');
        // 	}
        // },

      ],
      pageNumber: 1,
      pageSize: 10,
      pernum: 0,
      defaultList: [

      ],
      imgName: '',
      visible: false,
      uploadList: [],
      imgUrl: '',
      total: 0,
      value2: '',
      imgStatus: true
    }
  },
  created () {
    this.imgUrl = allApi.file
    this.getData()
  },
  mounted () {
  },
  methods: {
    cancelone () {
      this.imgs = []
      this.imgName = ''
      this.uploadList = []
    },
    dialogShow (v) {
      if (v === true) {
        let a = {
          id: this.imgSrc
        }
        fetch.get(school.lookImg + '/' + this.imgSrc, '', res => {
          if (res.code === 200) {
            this.imgs = res.data
            this.isImg = true
          } else {
            this.imgs = []
            this.$Message.info(res.message);
            this.isImg = false
          }
        })
      } else {
        // this.imgSrc = ''
        // this.imgs = []
      }
    },
    uploadPro (e, file) {
      if (this.pding.length === 0) {
        var percent = {
          val: e.percent,
          not: file.uid
        }
        if (e.percent >= 100) {
          return
        }
        this.pding.push(percent)
        this.$Notice.info({
          title: '上传进度（' + file.name + '）',
          duration: 0,
          name: percent.not,
          top: 100,
          render: h => {
            return h('Progress', {
              props: {
                percent: percent.val,
              }
            })
          }
        });


      } else {
        let f = false
        for (let i = 0, len = this.pding.length; i < len; i++) {
          if (this.pding[i].not == file.uid) {
            if (e.percent >= 100) {
              this.$Notice.close(this.pding[i].not)
              this.pding.splice(i, 1)
            } else {
              this.pding[i].val = e.percent
            }
            f = true
            break
          }
        }
        if (!f) {
          var percent = {
            val: e.percent,
            not: file.uid
          }
          if (e.percent >= 100) {
            return
          }
          this.pding.push(percent)
          this.$Notice.info({
            title: '上传进度',
            duration: 0,
            name: percent.not,
            top: 100,
            render: h => {
              return h('Progress', {
                props: {
                  percent: percent.val,
                }
              })
            }
          });

        }

      }
    },
    isSumbit () {
      let a = {
        device: this.formItem.device,
        faultAddress: this.formItem.faultAddress,
        faultType: this.formItem.faultType,
        describe: this.formItem.describe,
        fileInfo: JSON.stringify(this.uploadList)
      }
      if (this.formItem.device === '' || this.formItem.faultAddress === '' || this.formItem.faultType === '' || this.formItem.describe === '') {
        this.$Message.info('请输入完整的表单');
        return
      }
      fetch.post(allApi.repairs, a, res => {
        if (res.code == 200) {
          this.$Message.info(res.message);
          this.getData()
          this.modal = false
          this.formItem = {
            device: '',
            faultAddress: '',
            faultType: '',
            describe: '',
            fileInfo: ''
          }
          this.uploadList = []
        }
      })
    },
    getData () {
      let a = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        handleStatus: ''
      }
      fetch.get(allApi.repair, a, res => {
        if (res.code === 200) {
          this.tableData1 = res.data
          this.total = res.total
        }
        else if (res.code === 201) {
          // this.$Message.info(res.message);
          this.tableData1 = []
          this.total = 0
        }
      })
    },
    formatDate (date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    repair () {
      this.modal = true
    },
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (index) {
      this.uploadList.splice(index, 1)
    },
    handleSuccess (res, file) {
      this.uploadList.push({ url: res.data.url })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: '文件 ' + file.name + ' 的格式错误, 请选择 jpg 或者 png.'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: '文件' + file.name + ' 太大, 不能超过2M'
      });
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '只能上传五张以内'
        });
      }
      return check;
    }
  }
}
</script>