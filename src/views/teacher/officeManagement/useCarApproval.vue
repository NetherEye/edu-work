<style lang="less" scoped>
</style>

<template>
  <div class="pub">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>办公管理</BreadcrumbItem>
      <BreadcrumbItem>用车审批</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">
            <FormItem label="用车部门" clearable :label-width="72">
              <Select v-model="filter.dep" clearable placeholder="全部" style="width: 162px">
                <Option v-for="item in cityList1" :value="item.departmentId" :key="item.departmentId">{{ item.departmentName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="审批状态" :label-width="72">
              <Select v-model="filter.status" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="待审批">待审批</Option>
                <Option value="已通过">已通过</Option>
                <Option value="已驳回">已驳回</Option>
              </Select>
            </FormItem>

            <FormItem>
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
    <Modal v-model="modal" title="用车申请" width="300" footer-hide>
      <p style="margin-bottom:20px">是否同意用车申请</p>
      <Form :label-width="80">
        <FormItem>
          <Button type="primary" @click="agree1">同意</Button>
          <Button @click="back" style="margin-left: 8px">返回</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modal1" title="驳回" width="300" footer-hide>
      <i-input type="textarea" v-model="textarea" style="margin-bottom: 20px" :maxlength="50" :rows="4" placeholder="请输入..."></i-input>
      <Form :label-width="80">
        <FormItem>
          <Button type="primary" @click="rejected1">驳回</Button>
          <Button @click="back" style="margin-left: 8px">返回</Button>
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
export default {
  data () {
    return {
      useCar_modal: false,
      img_modal: false,
      imgSrc: '',
      imgs: [],
      modal1: false,
      modal: false,
      cityList1: "",
      formValidate: [],
      filter: {
        dep: '',
        status: '',
        search: ''
      },
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      textarea: "",
      tableData1: [],
      isImg: false,
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
          title: '申请人',
          key: 'applyPersonName',
        },
        {
          title: '用车部门',
          key: 'department',
        },
        {
          title: '用车事由',
          key: 'reason',
        },
        {
          title: '往返地点',
          key: 'originLocation',

          render: (h, params) => {
            return h('div', params.row.originLocation + '-' + params.row.remandLocation);
          }
        },
        {
          title: '用车日期',
          key: 'useDate',
        },
        {
          title: '返回日期',
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
          title: '抄送',
          key: 'sendPerson',
        },
        {
          title: '审批状态',
          key: 'checkStatus',
        },
        {
          title: '申请日期',
          key: 'applyTime',
        },
        {
          title: '审批日期',
          key: 'checkDate',
        },
        {
          title: '驳回理由',
          key: 'rejectContent',
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (params.row.checkStatus == '待审批') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.agree(params)
                    }
                  }
                }, '同意'),
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
                }, '驳回')
              ]);
            }

          }
        }
      ],
      agree1ID: "",
      reID: "",
      carData: []
    }
  },
  created () {
    this.getbumen()
    this.getData()
  },
  methods: {
    useCarShow (v) {
      if (v === true) {
        fetch.get(allApi.apply + '/' + this.imgSrc, '', res => {
          this.carData = res.data.applyCarList
        })
      }
    },
    dialogShow (v) {
      if (v === true) {
        fetch.get(allApi.photo + '/' + this.imgSrc, '', res => {
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
    findData () {
      this.pageNumber = 1
      this.getData()
    },
    agree (id) {
      this.agree1ID = id.row.id
      this.modal = true
    },
    agree1 () {
      let a = {
        id: this.agree1ID,
        status: 1,
      }
      fetch.put(allApi.apply, a, res => {
        if (res.code === 200) {
          this.$Message.info(res.message);
          this.modal = false
        } else {
          this.$Message.info(res.message);
        }
      })
    },
    rejuet (id) {
      this.reID = id.row.id
      this.modal1 = true
    },
    back () {
      this.modal1 = false
      this.modal = false
    },
    changePage (val) {
      this.pageNumber = val
      this.getData()
    },
    rejected1 () {
      let a = {
        id: this.reID,
        status: 2,
        rejectContent: this.textarea
      }
      if (this.textarea === '') {
        this.$Message.info('请输入驳回理由');
        return
      }
      fetch.put(allApi.apply, a, res => {
        if (res.code === 200) {
          this.$Message.info(res.message);
          this.modal1 = false
        } else {
          this.$Message.info(res.message);
        }
      })
    },
    getData () {
      let a = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        departmentId: this.filter.dep,
        checkStatus: this.filter.status,
      }
      fetch.get(allApi.check, a, res => {
        if (res.code === 200) {
          this.tableData1 = res.data
          this.total = res.total
        } else {
          this.total = 0
          this.tableData1 = ''
        }
      })
    },
    getbumen () {
      fetch.get(allApi.departmen, '', res => {
        this.cityList1 = res.data
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
    // changePage () {
    //   // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
    //   this.tableData1 = this.mockTableData1();
    // }
  }
}
</script>