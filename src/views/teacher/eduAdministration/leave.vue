<style lang="less" scoped>
</style>

<template>
  <div class="pub">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>教务管理</BreadcrumbItem>
      <BreadcrumbItem>请假审批</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">
            <FormItem label="年级" :label-width="36">
              <Select v-model="filter.grade" @on-change="getCl(filter.grade)" clearable style="width:200px">
                <Option v-for="item in cityList" :value="item.gradeId" :key="item.gradeId">{{ item.gradeName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="班级" :label-width="36">
              <Select v-model="filter.class" clearable style="width:200px">
                <Option v-for="item in cityList1" :value="item.classId" :key="item.classId">{{ item.className }}</Option>
              </Select>
            </FormItem>
            <FormItem label="审批状态" :label-width="72">
              <Select v-model="filter.status" clearable style="width:200px">
                <Option v-for="item in cityList2" :value="item.label" :key="item.label">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="请假类型" :label-width="72">
              <Select v-model="filter.type" clearable placeholder="全部" style="width:200px">
                <Option v-for="item in cityList3" :value="item.label" :key="item.label">{{ item.label }}</Option>
              </Select>
            </FormItem>

            <FormItem label="搜索" :label-width="36">
              <Input type="text" v-model="filter.search" placeholder="学号/姓名" clearable :maxlength="20">
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')">查询</Button>
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
    <Modal v-model="modal" title="请假审批" width="300" footer-hide>
      <p style="margin-bottom:20px">是否同意{{StuName}}的请假申请</p>
      <Form :label-width="80">
        <FormItem>
          <Button type="primary" @click="agree1">同意</Button>
          <Button @click="back" v-model="modalreturn" style="margin-left: 8px">返回</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modal1" title="驳回" width="300" footer-hide>
      <i-input type="textarea" v-model="textarea" style="margin-bottom: 20px" :rows="4" :maxlength="50" placeholder="请输入..."></i-input>
      <Form :label-width="80">
        <FormItem>
          <Button type="primary" @click="rejected1">驳回</Button>
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
      textarea: '',
      modalreturn1: false,
      modalreturn: false,
      modal1: false,
      modal: false,
      cityList: [

      ],
      cityList1: [

      ],
      cityList2: [
        {
          label: '待审批'
        },
        {
          label: '已通过'
        }, {
          label: '已驳回'
        },
      ],
      cityList3: [
        {
          label: '事假'
        }, {
          label: '病假'
        },
        {
          label: '其他'
        },
      ],
      filter: {
        grade: '',
        class: '',
        search: '',
        type: '',
        status: ''
      },
      tableData1: [],
      tableColumns1: [
        {
          title: '学号',
          key: 'studentId',
          tooltip: true
        },
        {
          title: '姓名',
          key: 'personName',
          tooltip: true
        },
        {
          title: '年级',
          key: 'gradeName',
          tooltip: true
        },
        {
          title: '班级',
          key: 'className',
          tooltip: true
        },
        {
          title: '请假类型',
          key: 'leaveType',
          tooltip: true
        },
        {
          title: '开始时间',
          key: 'startTime',
          tooltip: true
        },
        {
          title: '结束时间',
          key: 'finishTime',
          tooltip: true
        },
        {
          title: '请假天数',
          key: 'leaveDays',
          tooltip: true
        },
        {
          title: '请假事由',
          key: 'reason',
          tooltip: true
        },
        {
          title: '申请日期',
          key: 'applyTime',
          tooltip: true
        },
        {
          title: '审批状态',
          key: 'checkStatus',
          tooltip: true
        },
        {
          title: '审批日期',
          key: 'checkTime',
          tooltip: true
        },

        {
          title: '备注',
          key: 'remark',
          tooltip: true
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
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.agree(params.index)
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
                    this.rejuet(params.index)
                  }
                }
              }, '驳回')
            ]);
          }
        }
      ],
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      StuName: '',
      stuID: ''
    }
  },
  created () {
    this.getData()
    this.getGrade()
  },
  methods: {
    leave (status) {
      let a = {
        id: this.stuID,
        status: status,
        remark: this.textarea,
      }
      fetch.put(allApi.leave, a, res => {
        if (res.code === 200) {
          this.$Message.info(res.message);
          this.getData()
          this.modal = false
          this.modal1 = false
          this.textarea = false
        } else {
          this.$Message.info(res.message);
        }
      })
    },
    agree1 () {
      this.leave(1)
    },
    rejected1 () {
      if (this.textarea === '') {
        this.$Message.info('驳回理由不能为空');
        return
      }
      this.leave(2)
    },
    back () {
      this.modal = false
      this.modal1 = false
    },
    ok () {
      this.$Message.info('点击了确定');
    },
    cancel () {
      this.$Message.info('点击了取消');
    },
    getCl (id) {
      this.getClass(id)
    },
    getClass (id) {
      let a = {
        gradeId: id
      }
      fetch.get(allApi.class, a, res => {
        this.cityList1 = res.data
      })
    },
    getGrade () {
      var objone = {}
      fetch.get(allApi.grade, '', res => {
        if (res.code === 200) {
          res.data.forEach((a, i) => {
            objone[i] = {
              gradeName: a.studyPhase + a.gradeName,
              gradeId: a.gradeId
            }
          })
          this.cityList = objone

        } else {

        }
      })
    },
    agree (index) {
      this.modal = true
      this.StuName = this.tableData1[index].personName
      this.stuID = this.tableData1[index].id
    },
    rejuet (index) {
      this.stuID = this.tableData1[index].id
      this.modal1 = true
    },
    formatDate (date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    },
    changePage () {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.getData()
    },
    getData () {
      let a = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        gradeId: this.filter.grade,
        classId: this.filter.class,
        checkStatus: this.filter.status,
        keyWord: this.filter.search,
        leaveType: this.filter.type
      }
      fetch.get(allApi.leaveList, a, res => {
        if (res.code == 200) {
          this.tableData1 = res.data
          this.total = res.total
        } else if (res.code == 201) {
          this.tableData1 = []
          this.total = 0
        }
      })
    },
    handleSubmit () {
      this.pageNumber = 1
      this.getData()
    }
  }
}
</script>