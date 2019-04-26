<style lang="less" scoped>
.estimate {
  width: 100%;
  height: 20px;
  display: none;
  float: right;
}
.totality:hover .estimate {
  display: block;
}
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
      <BreadcrumbItem>教务管理</BreadcrumbItem>
      <BreadcrumbItem>用车申请</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">

        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">

            <FormItem>
              <Button type="primary" @click="addScar">新增</Button>
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
    <!-- draggable-->
    <Modal v-model="modal" title="用车申请" width="800" @on-cancel="cancel" @on-visible-change="modalCg" footer-hide>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <FormItem label="申请部门" prop="city">
          <Select v-model="formValidate.departmentId" placeholder="申请部门">
            <Option v-for="item in cityList1" :value="item.departmentId" :key="item.departmentId">{{ item.departmentName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="始发地点" prop="mail">
          <Input v-model="formValidate.start" :maxlength="30" placeholder="始发地点"></Input>
        </FormItem>
        <FormItem label="返回地点" prop="name">
          <Input v-model="formValidate.back" :maxlength="30" placeholder="返回地点"></Input>
        </FormItem>
        <FormItem label="日期">
          <Row>
            <i-col span="6">
              <Date-picker @on-change="getStartTime" :editable="false" :options="options3" type="date" placeholder="选择日期" v-model="formValidate.date" format="yyyy-MM-dd" :value.sync="formValidate.date"></Date-picker>
            </i-col>
            <i-col span="2" style="text-align: center">-</i-col>
            <i-col span="6">
              <Date-picker @on-change="getEndTime" :editable="false" :options="options4" type="date" placeholder="选择日期" v-model="formValidate.time" format="yyyy-MM-dd" :value.sync="formValidate.date"></Date-picker>
            </i-col>
          </Row>
        </FormItem>
        <div v-for="(item, index) in usrCar" :key="index" class="totality">
          <div class="estimate" v-if="show==true" @click="deleteRow(index,usrCar)">
            <span>
              <Icon type="md-close" /></span>
          </div>
          <FormItem :label="item.carType" prop="gender">
            <RadioGroup v-model="item.value1">
              <Radio label="轿车">轿车</Radio>
              <Radio label="SUV">SUV</Radio>
              <Radio label="大巴车">大巴车</Radio>
              <Radio label="商务车">商务车</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="item.carNumber" prop="interest">
            <Input v-model="item.value2" :maxlength="2" placeholder="请输入车辆数量"></Input>
          </FormItem>

        </div>
        <div @click="addCar" style="text-align: center;margin-bottom: 20px;cursor: pointer">
          +增加车辆
        </div>
        <FormItem label="上传图片" prop="gender">
          <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-remove="delFile" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :action="imgUrl" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="查看大图" v-model="visible">
            <img :src="imgName" style="width: 100%">
          </Modal>
        </FormItem>
        <FormItem label="用车事由" prop="desc">
          <Input v-model="formValidate.desc" :maxlength="60" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="用车事由"></Input>
        </FormItem>
        <FormItem label="审批人" prop="desc">
          <i-col span="10">
            <i-select :model.sync="model1" v-model="deID" @on-change="getTeacher(deID)" style="width:200px">
              <i-option v-for="item in cityList1" :value="item.departmentId">{{ item.departmentName }}</i-option>
            </i-select>
          </i-col>
          <i-col span="2">
            -
          </i-col>
          <i-col span="10">
            <i-select :model.sync="model1" v-model="teaID" style="width:200px">
              <i-option v-for="item in cityList2" :value="item.id">{{ item.teacherName }}</i-option>
            </i-select>
          </i-col>
        </FormItem>
        <FormItem label="抄送人">
          <i-col span="10">
            <i-select :model.sync="model1" v-model="deID1" @on-change="getTeacher1(deID1)" style="width:200px">
              <i-option v-for="item in cityList3" :value="item.departmentId">{{ item.departmentName }}</i-option>
            </i-select>
          </i-col>
          <i-col span="2">
            -
          </i-col>
          <i-col span="10">
            <i-select :model.sync="model1" v-model="teaID1" style="width:200px">
              <i-option v-for="item in cityList4" :value="item.id">{{ item.teacherName }}</i-option>
            </i-select>
          </i-col>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="onSumbit">确认</Button>
          <!-- <Button @click="cancel" style="margin-left: 8px">取消</Button> -->
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
    <Modal v-model="useCar_modal" title="用车详情" footer-hide width="500" @on-visible-change="useCarShow">
      <div style="text-align: center;margin-top: 20px" v-for="item in carData">
        <span style="font-size: 18px">{{item.carType}}</span>
        <span style="display: inline-block;width: 50px;font-size: 18px">:</span>
        <span style="font-size: 18px">{{item.carNumber}}辆</span>
      </div>
    </Modal>
  </div>
</template>

<script>
import fetch from '@/assets/tools/fetch'
import allApi from '@/assets/api/test'
import school from '@/assets/api/school'
import { constants } from 'fs';
export default {
  data () {
    return {
      show: false,
      cityList3: [],
      cityList4: [],
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      options4: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      carData: '',
      useCar_modal: false,
      imgs: '',
      teaID: '',
      deID: '',
      teaID1: '',
      deID1: '',
      model1: '',
      isImg: false,
      modal: false,
      total: 0,
      img_modal: false,
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      filter: {
        grade: '',
        class: '',
        search: ''
      },
      tableData1: [],
      tableColumns1: [
        {
          title: '序号',
          render: (h, params) => {
            let index = params.index
            let i = this.pageSize * (this.pageNumber - 1) + index + 1
            return h('span', i)
          },
          tooltip: true
        },
        {
          title: '用车部门',
          key: 'department',
          tooltip: true
        },
        {
          title: '用车事由',
          key: 'reason',
          tooltip: true
        },
        {
          title: '始发地点',
          key: 'originLocation',
          tooltip: true
        },
        // {
        // 	title: '班级排名',
        // 	tooltip: true,
        // 	key: 'ranking',
        // 	render: (h, params) => {
        // 		return h('div', 'Almost' + params.row.time + 'days');
        // 	}
        // },
        {
          title: '返回地点',
          tooltip: true,
          key: 'remandLocation',
        },
        {
          title: '用车日期',
          tooltip: true,
          key: 'useDate',
        },
        {
          title: '返回日期',
          tooltip: true,
          key: 'remandDate',
        },
        {
          title: '用车详情',
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
                  this.useCar_modal = true
                }
              }
            }, '查看');
          }
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
          title: '审批人',
          tooltip: true,
          key: 'checkPerson',
        }, {
          title: '抄送',
          tooltip: true,
          key: 'sendPerson',
        }, {
          title: '审批状态',
          tooltip: true,
          key: 'checkStatus',
        },
        {
          title: '申请日期',
          tooltip: true,
          key: 'applyTime',
        },
        {
          title: '审批日期',
          tooltip: true,
          key: 'checkDate',
        },


      ],
      formValidate: {
        departmentId: '',
        back: '',
        start: '',
        startTime: '',
        endTime: [],
        desc: '',
        name: "",
        gender: '',
        date: '',
        time: ""
      },
      // ruleValidate: {
      //     name: [
      //         { required: true, message: 'The name cannot be empty', trigger: 'blur' }
      //     ],
      //     mail: [
      //         { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
      //         { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
      //     ],
      //     city: [
      //         { required: true, message: 'Please select the city', trigger: 'change' }
      //     ],
      //     gender: [
      //         { required: true, message: 'Please select gender', trigger: 'change' }
      //     ],
      //     interest: [
      //         { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
      //         { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
      //     ],
      //     date: [
      //         { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
      //     ],
      //     time: [
      //         { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
      //     ],
      //     desc: [
      //         { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
      //         { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
      //     ]
      // },
      cityList1: [

      ],
      cityList2: [

      ],
      model7: '',
      usrCar: [
        {
          carType: '车辆类型',
          carNumber: '车辆数量',
          value1: '',
          value2: ''
        }
      ],
      endTime: '',
      startTime: '',
      deName: '',
      deName1: '',
      deName2: '',
      defaultList: [

      ],
      imgName: '',
      visible: false,
      uploadList: [],
      imgUrl: '',
      bigImgUrl: '',
      arrImgUrl: [],
      carInfomation: [],
      pageNumber: 1,
      pageSize: 10,
      subStatus: false,
      yag: '',
      numReg: /^[0-9]*$/

    }
  },
  created () {
    this.imgUrl = allApi.file
    this.getbumen()
    this.getData()
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    addScar () {
      this.modal = true
    },
    useCarShow (v) {
      if (v === true) {
        fetch.get(allApi.apply + '/' + this.imgSrc, '', res => {

          this.carData = res.data.applyCarList
        })
      }
    },
    dialogShow (v) {
      if (v === true) {
        fetch.get(allApi.photo + this.imgSrc, '', res => {

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
        this.imgSrc = ''
        this.imgs = []
      }
    },
    getData () {
      let a = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      fetch.get(allApi.mine, a, res => {
        if (res.code === 200) {
          this.tableData1 = res.data
          this.total = res.total
        } else {
          this.tableData1 = []
          this.total = 0
          // this.$Message.info(res.message);
        }
      })
    },
    getTeacher (id) {
      this.teaID = ''
      this.cityList2 = []
      let a = {
        departmentId: id
      }
      fetch.get(allApi.teacher, a, res => {

        if (res.code === 200) {
          this.cityList2 = res.data

        }
      })
    },
    getTeacher1 (id) {
      this.teaID1 = ''
      this.cityList4 = []
      let a = {
        departmentId: id
      }
      fetch.get(allApi.teacher, a, res => {
        if (res.code === 200) {
          this.cityList4 = res.data
        }
      })
    },
    getbumen () {
      fetch.get(allApi.departmen, '', res => {
        this.cityList1 = res.data
        this.cityList3 = res.data
      })
    },
    deleteRow (index, usrCar) {
      usrCar.splice(index, 1)
    },
    addCar () {
      this.usrCar.push({
        carType: '车辆类型',
        carNumber: '车辆数量'
      })
      if (this.usrCar.length >= 2) {
        this.show = true
      } else {
        this.show = false
      }
    },
    ok () {

      //				setTimeout(() => {
      //                  this.modal = false;
      //              }, 2000);


    },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    modalCg (t) {
      if (t === false) { // dialog 置空操作
        this.$refs['formValidate'].resetFields();
      }
    },
    onSumbit () {

      if (this.teaID === '') {
        this.$Message.info('请填写基础信息');
        return false
        this.subStatus = false
      }
      if (this.usrCar.length == 1) {
        this.usrCar.forEach(a => {
          this.yag = a.value2
        })
      }
      if (this.yag === '') {
        this.$Message.info('请输入数字');
        this.subStatus = false
        return
      } else {
        this.subStatus = true
      }
      this.usrCar.forEach(a => {
        console.log(a)
        if (!this.numReg.test(a.value2)) {
          this.$Message.info('请输入数字');
          this.subStatus = false
        } else {
          this.subStatus = true
        }
        if (this.numReg.test(a.value1)) {
          this.$Message.info('请选择车辆');
          this.subStatus = false
        } else {
          this.subStatus = true
        }
      })

      this.cityList1.forEach(a => {
        if (a.departmentId === this.formValidate.departmentId) {
          this.deName = a.departmentName
        }
      })
      this.cityList2.forEach(a => {
        if (a.id === this.teaID) {
          this.deName1 = a.teacherName
        }
      })
      this.cityList4.forEach(a => {
        if (a.id === this.teaID1) {
          this.deName2 = a.teacherName
        }
      })
      this.carInfomation = [];

      this.usrCar.forEach(a => {
        this.carInfomation.push({ carType: a.value1, carNumber: a.value2 })
      })
      this.arrImgUrl = []
      this.uploadList.forEach(a => {
        this.arrImgUrl.push({
          url: a.url
        })
      })
      if (this.subStatus) {
        let a = {
          departmentId: this.formValidate.departmentId,
          department: this.deName,
          originLocation: this.formValidate.start,
          remandLocation: this.formValidate.back,
          remandDate: this.endTime,
          useDate: this.startTime,
          checkId: this.teaID,  //审核人姓名ID
          checkPerson: this.deName1, //审核人姓名
          sendId: this.teaID1,  //抄送人ID
          sendPerson: this.deName2,
          reason: this.formValidate.desc,
          carInfo: JSON.stringify(this.carInfomation),
          fileInfo: JSON.stringify(this.arrImgUrl)
        }
        fetch.post(allApi.apply, a, res => {
          if (res.code === 200) {
            this.$Message.info(res.message);
            this.getData()
            this.cancel()
            this.modal = false
          } else {
            this.$Message.info(res.message);
          }
        })
      } else {
      }

    },
    getEndTime (endTime) {
      this.endTime = endTime
    },
    getStartTime (startTime) {
      this.startTime = startTime
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(file, 1);
    },
    handleSuccess (res, file) {
      file.url = res.data.url;
      file.name = res.data.name;

    },
    delFile (file, fileList) {
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
    },
    cancel () {
      // this.modal = false
      this.formValidate = []
      this.$refs.upload.fileList.splice(0, this.uploadList.length);
      this.deName = ''
      this.endTime = ''
      this.startTime = ''
      this.teaID1 = ''
      this.teaID = ''
      this.deID = ''
      this.deID1 = ''
      this.usrCar = [{
        carType: '车辆类型',
        carNumber: '车辆数量',
        value1: '',
        value2: ''
      }]
    },
  }
}
</script>