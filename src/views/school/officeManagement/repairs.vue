<style lang="less" scoped>
</style>

<template>
  <div class="pub">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>办公管理</BreadcrumbItem>
      <BreadcrumbItem>报修管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">
            <FormItem label="处理状态" :label-width="72">
              <Select v-model="filter.handleStatus" placeholder="全部" clearable style="width:140px">
                <Option v-for="item in stateOps" :value="item.label" :key="item.label">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="findData">查询</Button>
            </FormItem>
          </Form>
        </div>

        <div class="table">
          <Table :data="tableData" :columns="tableColumns" stripe></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="page.total" :current="page.pageNumber" :pageSize="page.pageSize" @on-change="changePage"></Page>
            </div>
          </div>
        </div>

      </div>

      <Modal v-model="img_modal" footer-hide width="800" @on-visible-change="dialogShow">
        <Carousel loop v-if="isImg">
          <Carousel-item v-for="(item, key) in imgs" :key="key" style="height: 400px">
            <img :src="item.url" style="" />
          </Carousel-item>
        </Carousel>
        <div v-else>暂无图片</div>
      </Modal>

      <Modal title="报修处理" v-model="handle_modal" footer-hide width="400" @on-visible-change="dialogShow1">

        <Form :model="handleForm" label-position="right">
          <FormItem label="处理状态" :label-width="72">
            <Select v-model="handleForm.handleStatus" placeholder="全部" clearable style="width:200px">
              <Option v-for="item in handleOps" :value="item.label" :key="item.label">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="维修人员" :label-width="72" v-if="handleForm.handleStatus != '已受理'">
            <Input v-model="handleForm.maintainPerson" clearable style="width: 200px" :maxlength="10" />
          </FormItem>

          <FormItem style="text-align: center;">
            <Button type="primary" @click="sub">提交</Button>
          </FormItem>
        </Form>
      </Modal>

    </Card>
  </div>
</template>

<script>
import fetch from '@/assets/tools/fetch'
import school from '@/assets/api/school'
export default {
  data () {
    return {
      isImg: false,
      nameReg: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/,
      img_modal: false,
      handle_modal: false,
      filter: {
        handleStatus: ''
      },
      page: {
        pageSize: 10,
        pageNumber: 1,
        total: 0
      },
      imgSrc: '',
      imgs: [],
      tableData: [],
      stateOps: [{
        label: '待受理'
      },
      {
        label: '已受理'
      },
      {
        label: '故障不存在'
      },
      {
        label: '故障已排除'
      }
      ],
      handleForm: {
        id: '',
        handleStatus: '',
        maintainPerson: ''
      },
      handleOps: [{
        label: '已受理'
      },
      {
        label: '故障不存在'
      },
      {
        label: '故障已排除'
      }
      ],
      tableColumns: [{
        title: '序号',
        width: 60,
        align: 'center',
        render: (h, params) => {
          let index = params.index
          let i = this.page.pageSize * (this.page.pageNumber - 1) + index + 1
          return h('span', i)
        }
      },
      {
        title: '报修人',
        key: 'personName',
        align: 'center',
      },
      {
        title: '报修部门',
        key: 'department',
        align: 'center',
      },
      {
        title: '故障设备',
        align: 'center',
        key: 'device',
      },
      {
        title: '故障地点',
        align: 'center',
        key: 'faultAddress',
      },
      {
        title: '故障类型',
        align: 'center',
        key: 'faultType',
      },
      {
        title: '故障描述',
        align: 'center',
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
        align: 'center',
        key: 'applyTime',
      },
      {
        title: '处理状态',
        align: 'center',
        key: 'handleStatus',
      },
      {
        title: '操作',
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
                this.handleForm.id = row.id
                this.handle_modal = true
              }
            }
          }, '处理');
        }
      }
      ]
    }
  },
  created () {
    this.getData()

  },
  methods: {
    findData (val) {
      this.page.pageNumber = 1
      this.getData()
    },
    changePage (val) {
      this.page.pageNumber = val
      this.getData()
    },
    getData () {
      let par = {
        ...this.page,
        ...this.filter
      }
      delete par.total
      fetch.get(school.repairs, par, res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.page.total = res.total
        } else {
          this.tableData = []
          this.page.total = 0
          // this.$Message.info(res.message);
        }
      })
    },
    dialogShow (v) {

      if (v === true) {
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
        this.imgSrc = ''
        this.imgs = []
      }
    },
    dialogShow1 (v) {
      if (v === false) {
        this.handleForm = {
          id: '',
          handleStatus: '',
          maintainPerson: ''
        }
      }
    },
    formatDate (date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    },
    sub () {
      let {
        id,
        handleStatus,
        maintainPerson
      } = this.handleForm
      let par = {
        id: id,
        handleStatus: handleStatus,
        maintainPerson: maintainPerson
      }
      if (handleStatus === '') {
        this.$Message.warning('请输入处理状态');
        return
      }
      if (handleStatus != '已受理' && maintainPerson === '') {
        this.$Message.warning('维修人员为空');
        return
      }
      if (handleStatus === '已受理') {
        delete par.maintainPerson
      }
      if (handleStatus !== '已受理') {
        if (!this.nameReg.test(this.handleForm.maintainPerson)) {
          this.$Message.warning('请输入正确的姓名');
          return
        }
      }

      fetch.put(school.handle, par, res => {
        if (res.code === 200) {
          this.handle_modal = false
          this.getData()
          this.$Message.success(res.message);
        } else {
          this.$Message.error(res.message);
        }
      })
    }
  }
}
</script>