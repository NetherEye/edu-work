<style lang="less" scoped>

</style>

<template>
	<div class="pub">
		<Breadcrumb :style="{margin: '16px 0'}">
			<BreadcrumbItem>办公管理</BreadcrumbItem>
			<BreadcrumbItem>场地管理</BreadcrumbItem>
		</Breadcrumb>
		<Card>
			<div style="min-height: 600px;">

				<div class="filter">
					<!-- label-width 一个字18px -->
					<Form :model="filter" inline label-position="right">
						<FormItem>
							<Button type="primary" @click="handleSubmit">新增</Button>
						</FormItem>
					</Form>
				</div>
				<div class="table">
					<Table :data="tableData" :columns="tableColumns" stripe></Table>
					<div style="margin: 10px;overflow: hidden">
						<div style="float: right;">
							<Page :total="page.total" :page-size="page.pageSize" :current="page.pageNumber" @on-change="handlePg"></Page>
						</div>
					</div>
				</div>

			</div>
		</Card>
		<!--弹框-->
		<Modal v-model="modal" title="新增场地" width="360" footer-hide @on-visible-change="reset(formItem)">
			<Form :model="formItem" :label-width="80">
				<FormItem label="场地名称">
					<Input v-model="formItem.placeName" :maxlength="15"></Input>
				</FormItem>
				<FormItem label="可容纳人数">
					<Input v-model.number="formItem.containPerson"  :maxlength="3"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="save">保存</Button>
				</FormItem>
			</Form>
		</Modal>
		
		<!--弹框-->
		<Modal v-model="update_modal" title="编辑场地" width="360" footer-hide @on-visible-change="reset(update_formItem, update_modal)">
			<Form :model="update_formItem" :label-width="80">
				<FormItem label="场地名称">
					<Input v-model="update_formItem.placeName" :maxlength="15"></Input>
				</FormItem>
				<FormItem label="可容纳人数">
					<Input  :maxlength="3" v-model.number="update_formItem.containPerson"></Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="edit(update_formItem.containPerson,update_formItem.placeName)">保存</Button>
				</FormItem>
			</Form>
		</Modal>
		
		<!--弹框-->
		<Modal v-model="look_modal" title="预约记录" width="800" footer-hide @on-visible-change="dialogReset">
			<div class="filter">
					<!-- label-width 一个字18px -->
				<Form :model="dialog_filter" inline label-position="right">
					<FormItem label="状态" :label-width="36">
						<Select v-model="dialog_filter.reservationStatus" placeholder="全部" clearable style="width:140px">
					        <Option v-for="item in stateOps" :value="item.label" :key="item.label">{{ item.label }}</Option>
					   </Select>
					</FormItem>
					<FormItem label="使用月份" :label-width="72">
						<Date-picker type="month" placeholder="选择月" @on-change="time1" style="width: 140px" clearable></Date-picker>
					</FormItem>
					<FormItem>
					<Button type="primary" @click="getHistory">查询</Button>
				</FormItem>
				</Form>
			</div>
			<div class="table">
				<Table :data="tableData1" :columns="tableColumns1" stripe></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="dialog_page.total" :page-size="dialog_page.pageSize" :current.sync="dialog_page.pageNumber"  @on-change="changePage1"></Page>
					</div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	import fetch from '@/assets/tools/fetch'
	import school from '@/assets/api/school'
	export default {
		data() {
			return {
			    useT:"",
                regEn : /[`~!@#$%^&*_+<>?:"{},.\/;'[\]]/im,
                regCn :/[·！#￥——：；“”‘、，|《。》？、【】[\]]/im,
				filter: {},
				page: {
					pageSize: 10,
					pageNumber: 1,
					total: 0
				},
				regNum:/^[1-9]\d{0,2}$/,
				modal: false,
				formItem: {
					placeName: '',
					containPerson: ''
				},
				update_modal: false,
				update_formItem: {
					placeName: '',
					containPerson: '',
					id: ''
				},
				tableData: [],
				tableData1: [],
				look_modal: false,
				dialog_page: {
					total: 0,
					pageSize: 3,
					pageNumber: 1
				},
				dialog_filter: {
					id: '',
					reservationStatus: '',
					month: ''
				},
				stateOps: [
					{
                        label: '已预约'
                    },
                    {
                        label: '已取消'
                    },
                    {
                        label: '已结束'
                    },

				],
				tableColumns: [
				    {
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
						align: 'center',
						title: '场地名称',
						key: 'placeName',
					},
					{
						align: 'center',
						title: '可容纳人数',
						key: 'containPerson',
					},
					{
						title: '预约记录',
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
										this.dialog_filter.id = row.id
										this.getHistory()
										this.look_modal = true
									}
								}
							}, '查看');
						}
					},
					{
						title: '操作',
						align: 'center',
						render: (h, params) => {
							let row = params.row
							return h('ButtonGroup', [
								h('Button', {
									props: {
										type: 'info',
										size: 'small'
									},
									on: {
										click: () => {
											this.update_formItem.placeName = row.placeName
											this.update_formItem.containPerson = row.containPerson
											this.update_formItem.id = row.id
											this.update_modal = true
										}
									}
								}, '编辑'),
								h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									on: {
										click: () => {
											this.$Modal.confirm({
							                    title: '提示',
							                    okText: '删除',
							                    content: '<p>删除后，预约记录也将一并删除确定删除该场地？</p>',
                    							cancelText: '取消',
							                    onOk: () => {
							                        fetch.delete(school.place, {id: row.id}, res =>{
							                        	if(res.code === 200) {
							                        		this.$Message.success(res.message);
															this.getData()
														} else {
															this.$Message.warning(res.message);
														}
							                        })
							                    }
							                });
										}
									}
								}, '删除')
							])
						}
					}
				],
				tableColumns1: [
				    {
						title: '序号',
						width: 60,
                        render: (h, params) => {
                            let index = params.index
                            let i = this.dialog_page.pageSize * (this.dialog_page.pageNumber - 1) + index + 1
                            return h('span', i)
                        }
					},
					{
						align: 'center',
						title: '预约人',
						key: 'reservationPersonName',
					},
					{
						align: 'center',
						title: '使用日期',
						key: 'useTime'
					},
					{
						align: 'center',
						width: 140,
						title: '使用时间',
						render: (h, params) => {
							let row = params.row
							return h('p', {
								props: {
									
								},
							}, row.startTime + '-' + row.finishTime);
						}
					},
					{
						align: 'center',
						title: '活动描述',
						key: 'describe',
					},
					{
						align: 'center',
						title: '预约时间',
						key: 'reservationTime',
					},
					{
						title: '预约状态',
						align: 'center',
						render: (h, params) => {
							let row = params.row
							let color = row.reservationStatus === '已预约' ? 'success' : row.reservationStatus === '已取消' ? 'warning' : 'error'
							return h('Tag', {
								props: {
									color: color
								},
							}, row.reservationStatus);
						}
					},
					
				]
			}
		},
		created () {
		    this.getData()
		},
		methods: {
            time1(val){
                this.useT = val
			},
            changePage1(val){
                this.dialog_page.pageNumber= val
				this.getHistory()
			},
			handleSubmit() {
				this.modal = true
			},
			// 充值对象函数
			reset(row, bl){ // 如果bl === true 
				if(bl === true){
					return
				}
				for (let key in row) {
					row[key] = ''
				}
			},
			handlePg(pg){
				this.page.pageNumber = pg
				this.getData()
			},
			dialogReset(v){
				if(v === true){
					return
				}
				this.dialog_page = {
					total: 0,
					pageSize: 10,
					pageNumber: 1
				}
				this.dialog_filter = {
					id: '',
					reservationStatus: '',
					useTime: ''
				}
			},
			save(){
				if(this.formItem.placeName === '' || this.formItem.containPerson === ''){
					this.$Message.warning('请填写完整！');
					return
				}
                if(this.regEn.test(this.formItem.placeName) || this.regCn.test(this.formItem.placeName)) {
                    this.$Message.warning('包含非法字符！');
                    return false;
                }
                if (!this.regNum.test(this.formItem.containPerson)) {
                    this.$Message.warning('只能是3位数字！');
                    return false;
				}
				let par = {
					...this.formItem
				}
				fetch.post(school.place, par, res => {
					if(res.code === 200) {
						this.modal = false
						this.getData()
					} else {
						this.$Message.warning(res.message);
					}
				})
			},
			edit(value,value2){
				if(value2 === '' || value === ''){
					this.$Message.warning('请填写完整！');
					return
				}
                if(this.regEn.test(value2) || this.regCn.test(value2)) {
                    this.$Message.warning('包含非法字符！');
                    return false;
                }
                if (!this.regNum.test(value)) {
                    this.$Message.warning('人数不能超过3位数字！');
                    return false;
                }
				let par = {
					...this.update_formItem
				}
				fetch.put(school.place, par, res => {
					if(res.code === 200) {
						this.update_modal = false
						this.getData()
					} else {
						this.$Message.warning(res.message);
					}
				})
			},
			getData() {
				let par = {
					...this.page
				}
				delete par.total
				fetch.get(school.place, par, res => {
					if(res.code === 200) {
						this.tableData = res.data
						this.page.total = res.total
					} else {
						this.tableData = []
						this.page.total = 0
						this.$Message.warning(res.message);
					}
				})
			},
			getHistory() {
				let par = {
                    id:this.dialog_filter.id,
                    reservationStatus:this.dialog_filter.reservationStatus,
                    pageNumber :this.dialog_page.pageNumber,
                    pageSize :this.dialog_page.pageSize,
                    useTime :this.useT,
				}
				fetch.get(school.history, par, res => {
					if(res.code === 200) {
						this.tableData1 = res.data
						this.dialog_page.total = res.total
					} else {
						this.tableData1 = []
						this.dialog_page.total = 0
						// this.$Message.warning(res.message);
					}
				})
			},
			formatDate(date) {
				const y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				return y + '-' + m + '-' + d;
			}
		}
	}
</script>