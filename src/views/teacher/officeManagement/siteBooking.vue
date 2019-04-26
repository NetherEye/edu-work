<style lang="less" scoped>
</style>

<template>
  <div class="pub">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>办公管理</BreadcrumbItem>
      <BreadcrumbItem>场地预约</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">
            <FormItem label="场地名称" :label-width="72">
              <Input type="text" v-model="gr" clearable :maxlength="20" placeholder="请输入...">
              </Input>
            </FormItem>
            <FormItem label="预约状态" :label-width="72">
              <Select v-model="grStatus" clearable style="width:162px" placeholder="全部">
                <Option v-for="item in cityList3" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>

            <FormItem>
              <Button type="primary" style="margin-right: 10px" @click="handleSubmit">预约</Button>
              <Button type="primary" @click="findData">查询</Button>
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
    <Modal v-model="modal" title="场地预约" width="800" @on-cancel="cancel" @on-visible-change="modalCg" footer-hide>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <FormItem label="选择场地" prop="city">
          <Select v-model="filter.ground" placeholder="请选择场地" @on-change="isChan(filter.ground)">
            <Option v-for="item in carList" :value="item.id" :key="item.id">{{ item.placeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="容纳人数" prop="name">
          <Input v-model="filter.personNum" disabled :maxlength="3" placeholder="请输入人数"></Input>
        </FormItem>
        <FormItem label="使用日期">
          <Row>
            <Col span="6">
            <FormItem prop="date">
              <DatePicker type="date" :editable="false" :options="options3" @on-change="changeDate" v-model="useDate" placeholder="请选择日期"></DatePicker>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="使用时间" prop="desc">
          <i-col span="6">
            <Time-picker type="time" placeholder="选择时间" :disabled-hours="[0,1,2,3,4,5,6,7,22,23,24]" :editable="false" :options="options3" :value.sync="filter.startTime" v-model="filter.startTime"></Time-picker>
          </i-col>
          <i-col span="2" style="text-align: center">-</i-col>
          <i-col span="6">
            <Time-picker type="time" placeholder="选择时间" :disabled-hours="[0,1,2,3,4,5,6,7,22,23,24]" :editable="false" :value.sync="filter.endTime" v-model="filter.endTime"></Time-picker>
          </i-col>
        </FormItem>
        <FormItem label="活动描述" prop="desc">
          <i-input :value.sync="filter.desc" v-model="filter.desc" :maxlength="50" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="queren">确认</Button>
          <!-- <Button @click="cancel" style="margin-left: 8px">取消</Button> -->
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modal2" title="场地预约" width="300" footer-hide>
      <p style="margin-bottom:20px">是否取消</p>
      <Form :label-width="80">
        <FormItem>
          <Button type="primary" @click="agree1">同意</Button>
          <Button @click="back" style="margin-left: 8px">返回</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import fetch from '@/assets/tools/fetch'
import allApi from '@/assets/api/test'
export default {
  data () {
    return {
      useDate: '',
      gr: '',
      grStatus: '',
      modal2: false,
      carList: '',
      modal: false,
      total: 0,
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      cityList3: [

        {
          value: '已预约',
          label: '已预约'
        },
        {
          value: '已取消',
          label: '已取消'
        },
        {
          value: '已结束',
          label: '已结束'
        }
      ],
      filter: {
        ground: '',
        personNum: '',
        class: '',
        date: '',
        startTime: '',
        endTime: '',
        search: '',
        desc: ''
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
          title: '场地名称',
          key: 'placeName',
          tooltip: true
        },
        {
          title: '可容纳人数',
          key: 'containPerson',
          tooltip: true
        },
        {
          title: '活动描述',
          key: 'describe',
          tooltip: true
        },
        {
          title: '使用日期',
          tooltip: true,
          key: 'useTime',
        },
        {
          title: '使用时间',
          tooltip: true,
          key: 'ranking',
          render: (h, params) => {
            return h('div', params.row.startTime + '-' + params.row.finishTime);
          }
        },
        {
          title: '预约状态',
          tooltip: true,
          key: 'reservationStatus',
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.rejuet(params)
                  }
                }
              }, '取消预约')
            ]);
          }
        }
      ],
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
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
      cityList1: [
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
        }
      ],
      cityList2: [
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
      model7: '',
      groundName: '',
      reID: '',
      pageSize: 10,
      pageNumber: 1,
      pernum: 0
    }
  },
  created () {

    this.getGround()
    this.getData()
  },
  methods: {

    isChan (val) {
      this.carList.forEach(a => {
        if (a.id === val) {
          this.pernum = a.containPerson
          this.filter.personNum = this.pernum
        }
      })
    },
    findData () {
      this.pageNumber = 1
      this.getData()
    },
    rejuet (row) {
      this.modal2 = true
      this.reID = row.row.id
    },
    agree1 () {
      let a = {
        id: this.reID
      }
      fetch.put(allApi.reserve, a, res => {
        if (res.code === 200) {
          this.$Message.info(res.message);
          this.modal2 = false

          this.getData()
        } else if (res.code === 201) {
          this.$Message.info(res.message);
        }
      })
    },
    back () {
      this.modal2 = false
    },
    getData () {
      let a = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        reservationStatus: this.grStatus,
        placeName: this.gr
      }
      fetch.get(allApi.reserve, a, res => {
        if (res.code === 200) {
          this.tableData1 = res.data
          this.total = res.total
        } else {
          this.tableData1 = []
          this.total = 0
        }
      })
    },
    changeDate (data) {
      this.useDate = data
    },
    queren () {
      this.carList.forEach(a => {
        if (a.id == this.filter.ground) {
          this.groundName = a.placeName
        }
      })
      if (this.filter.ground === '' || this.useDate === '' || this.filter.startTime === '' || this.filter.desc === '' || this.filter.endTime === '' || this.filter.personNum === '') {
        this.$Message.info('请完整输入表单内容');
        return
      }

      if (this.filter.startTime > this.filter.endTime) {
        this.$Message.info('开始时间不能小于结束时间');
        return
      }

      let a = {
        placeId: this.filter.ground,
        placeName: this.groundName,
        useTime: this.useDate,
        startTime: this.filter.startTime,
        finishTime: this.filter.endTime,
        describe: this.filter.desc,
        // containPerson: this.filter.personNum
      }
      fetch.post(allApi.reserve, a, res => {
        if (res.code === 200) {
          this.$Message.info(res.message);
          this.modal = false
          this.filter = {
            ground: '',
            personNum: '',
            class: '',
            date: '',
            startTime: '',
            endTime: '',
            search: '',
            desc: ''
          },
            this.useDate = ''
          this.getData()
        } else {
          this.$Message.info(res.message);
        }
      })
    },
    getGround () {
      fetch.get(allApi.place, '', res => {
        this.carList = res.data
        this.pernum = res.data.containPerson
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
    ok () {

      //				setTimeout(() => {
      //                  this.modal = false;
      //              }, 2000);


    },
    cancel () {
      this.filter = []
      this.modal = false
      this.useDate = ''
    },
    changePage (val) {
      this.pageNumber = val
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.getData()
    },
    modalCg (t) {
      if (t === false) { // dialog 置空操作
        this.$refs['formValidate'].resetFields();
      }
    },
    handleSubmit () {
      this.modal = true
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    quxiao () {
      this.modal = false
    },
  }
}
</script>