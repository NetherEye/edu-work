<style lang="less" scoped>
</style>

<template>
  <div class="pub">
    <Breadcrumb :style="{margin: '16px 0'}">
      <BreadcrumbItem>教务管理</BreadcrumbItem>
      <BreadcrumbItem>成绩管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div style="min-height: 600px;">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter" inline label-position="right">
            <FormItem label="年级" :label-width="36">
              <Select v-model="filter.grade" @on-change="getCl(filter.grade)" clearable style="width:162px" placeholder="年级">
                <Option v-for="item in cityList" :value="item.gradeId" :key="item.gradeId">{{ item.gradeName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="班级" :label-width="72">
              <Select v-model="filter.class" clearable style="width:162px" placeholder="班级">
                <Option v-for="item in cityList1" :value="item.classId" :key="item.classId">{{ item.className }}</Option>
              </Select>
            </FormItem>
            <FormItem label="学号" :label-width="36">
              <Input type="text" v-model="filter.number" clearable placeholder="请输入..." :maxlength="20">
              </Input>
            </FormItem>
            <FormItem label="学年" :label-width="36">
              <Select v-model="filter.year" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="2017-2018">2017-2018</Option>
                <Option value="2018-2019">2018-2019</Option>
              </Select>
            </FormItem>
            <FormItem label="学期" :label-width="36">
              <Select v-model="filter.xueqi" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="第一学期">第一学期</Option>
                <Option value="第二学期">第二学期</Option>
              </Select>
            </FormItem>
            <FormItem label="类型" :label-width="36">
              <Select v-model="filter.type" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="期中考试">期中考试</Option>
                <Option value="期末考试">期末考试</Option>
                <Option value="小测验">小测验</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')">查询</Button>
              <Button style="margin-left: 10px" type="primary" @click="exported">导入</Button>
              <Button type="primary" @click="uploadMb" style="margin-left: 10px">下载导入模板</Button>

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
    <Modal v-model="modal" title="导入文件" width="500" footer-hide>

      <Form :label-width="80">
        <div class="filter">
          <!-- label-width 一个字18px -->
          <Form :model="filter1" inline label-position="right">
            <FormItem label="年级" :label-width="36">
              <Select v-model="filter1.grade" @on-change="getCl(filter1.grade)" clearable style="width:162px" placeholder="年级">
                <Option v-for="item in cityList" :value="item.gradeId" :key="item.gradeId">{{ item.gradeName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="班级" :label-width="36">
              <Select v-model="filter1.class" clearable style="width:162px" placeholder="班级">
                <Option v-for="item in cityList1" :value="item.classId" :key="item.classId">{{ item.className }}</Option>
              </Select>
            </FormItem>
            <FormItem label="学年" :label-width="36">
              <Select v-model="filter1.year" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="2017-2018">2017-2018</Option>
                <Option value="2018-2019">2018-2019</Option>
              </Select>
            </FormItem>
            <FormItem label="学期" :label-width="36">
              <Select v-model="filter1.xueqi" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="第一学期">第一学期</Option>
                <Option value="第二学期">第二学期</Option>
              </Select>
            </FormItem>
            <FormItem label="类型" :label-width="36">
              <Select v-model="filter1.type" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option value="期中考试">期中考试</Option>
                <Option value="期末考试">期末考试</Option>
                <Option value="小测验">小测验</Option>
              </Select>
            </FormItem>
            <FormItem label="学科" :label-width="36">
              <Select v-model="filter1.subject" clearable maxlength="20" style="width: 162px" placeholder="全部">
                <Option v-for="item in cityList2" :value="item.courseId" :key="item.courseId">{{ item.subject }}</Option>
              </Select>
            </FormItem>
          </Form>
          <div>
            <input type="file" @change="changeFile1" ref="file">
            <!--<Upload-->
            <!--enctype="multipart/form-data"-->
            <!--type="drag"-->
            <!--:format="['xls','xlsx']"-->
            <!--:on-success="handleSuccess"-->
            <!--:action="imgUrl">-->
            <!--<div style="padding: 20px 0">-->
            <!--<Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>-->
            <!--<p>点击或将文件拖拽到这里上传</p>-->
            <!--</div>-->
            <!--</Upload>-->
          </div>
        </div>
        <FormItem>
          <Button type="primary" @click="upLoading">同意</Button>
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
      tableColumns1: [
        // {
        //   title: '序号',
        //   render: (h, params) => {
        //     let index = params.index
        //     let i = this.pageSize * (this.pageNumber - 1) + index + 1
        //     return h('span', i)
        //   },
        //   tooltip: true
        // },
        {
          title: '学号',
          key: 'studentId',
          tooltip: true
        },
        {
          title: '姓名',
          key: 'studentName',
          tooltip: true
        },
        {
          title: '年级',
          key: 'grade',
          tooltip: true
        },
        {
          title: '班级',
          key: 'className',
          tooltip: true
        },
        {
          title: '学年',
          key: 'schoolYear',
          tooltip: true
        },
        {
          title: '班级排名',
          tooltip: true,
          key: 'ranking',
        },
        {
          title: '总成绩',
          tooltip: true,
          key: 'totalScore',
        },
        {
          title: '考试类别',
          tooltip: true,
          key: 'examType',
        }
      ],
      modal: false,
      cityList: [],
      filter: {
        grade: '',
        class: '',
        number: '',
        year: "",
        xueqi: "",
        type: ''
      },
      filter1: {
        grade: '',
        class: '',
        number: '',
        year: "",
        xueqi: "",
        type: '',
        subject: ''
      },
      tableData1: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      cityList1: [],
      cityList2: [],
      imgUrl: '',
      excelData: "",
      className: '',
      sub: "",
      excelUrl: '',
      gradeName: ''
    }
  },
  created () {
    this.imgUrl = allApi.file
    this.getData()
    this.getGrade()
    this.getSub()
  },
  methods: {
    uploadMb () {
      window.location.href = 'https://store.gzeducard.com/academic-office/%E6%88%90%E7%BB%A9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls'
    },
    changeFile1 () {
      var file = this.$refs['file'].files[0];
      this.excelUrl = file

    },
    getSub (id) {
      let a = {
        gradeId: id
      }
      fetch.get(allApi.course, a, res => {
        this.cityList2 = res.data
      })
    },
    handleSuccess (res, file) {
      this.excelData = file
    },
    exported () {
      this.modal = true
    },
    getCl (id) {
      this.filter.class = ''
      this.getClass(id)
      this.getSub(id)
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
      var objone = []
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
    getData () {
      let a = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        gradeId: this.filter.grade,
        classId: this.filter.class,
        studentId: this.filter.number,
        schoolYear: this.filter.year,
        semester: this.filter.xueqi,
        examType: this.filter.type,
      }
      fetch.get(allApi.score, a, res => {
        console.log(res)
        if (res.code === 200) {
          this.tableData1 = res.data
          this.total = res.total
        } else {
          this.tableData1 = []
          this.total = 0
        }

      })
    },
    upLoading () {
      this.cityList1.forEach(a => {
        if (a.classId === this.filter1.class) {
          this.className = a.className
        }
      })
      this.cityList2.forEach(a => {
        if (a.courseId === this.filter1.subject) {
          this.sub = a.subject
        }
      })
      this.cityList.forEach(a => {
        if (a.gradeId === this.filter1.grade) {
          this.gradeName = a.gradeName
        }
      })
      var file = this.$refs['file'].files[0];
      let param = new FormData(); //创建form对象
      param.append('file', file); //通过append向form对象添加数据
      param.append('gradeId', this.filter1.grade); //通过append向form对象添加数据
      param.append('grade', this.gradeName); //通过append向form对象添加数据
      param.append('classId', this.filter1.class); //通过append向form对象添加数据
      param.append('schoolYear', this.filter1.year); //通过append向form对象添加数据
      param.append('semester', this.filter1.xueqi); //通过append向form对象添加数据
      param.append('examType', this.filter1.type); //通过append向form对象添加数据
      param.append('className', this.className); //通过append向form对象添加数据
      param.append('subject', this.sub); //通过append向form对象添加数据
      param.append('courseId', this.filter1.subject); //通过append向form对象添加数据
      fetch.post1(allApi.import, param, res => {
        if (res.code === 200) {
          this.$Message.info(res.message);
          this.filter1 = []
          this.sub = ''
          this.className = ''
          this.gradeName = ''
          this.excelUrl = ''
          this.modal = false
          this.param = ''
          this.excelUrl.name = ''

        } else {
          this.$Message.info(res.message);
        }
      })
    },
    mockTableData1 () {
      let data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          id: i,
          name: '李' + i,
          grade: '八年级',
          class: '八年级（' + i + '）班',
          ranking: '第' + i + '名',
          totalGrade: i * 10
        })
      }
      return data;
    },
    handleSubmit () {
      this.pageNumber = 1
      this.getData()
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
    back () {
      this.filter1 = []
      this.sub = ''
      this.className = ''
      this.gradeName = ''
      this.excelUrl = []
      this.modal = false
    }
  }
}
</script>