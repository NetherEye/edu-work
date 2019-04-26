<style scoped>
.layout,
.ivu-layout {
  height: 100%;
}

.layout {
  /* border: 1px solid #d7dde4; */
  background: #f5f7f9;
  position: relative;
  /* border-radius: 4px; */
  overflow: hidden;
}
.layout .icon {
  width: 200px;
  height: 64px;
  /* border-left: none; */
  position: absolute;
  /* overflow: auto; */
  top: 0;
  left: 0;
  bottom: 0px;
  background-color: rgb(45, 140, 240);
}
.layout .icon .icon-log {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
<template>
  <div class="layout">
    <div class="icon">
      <div class="icon-log">
        <img src="../assets/img/tu.png" alt="">
      </div>
    </div>
    <Sider :style="{position: 'fixed',top:'64px', height: '100vh',  left: 0,  overflow: 'auto'}">
      <Menu theme="dark" width="auto" v-if="userInfo.role === '学校'">
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            办公管理
          </template>
          <MenuItem name="3-1" :to="{name: '场地管理'}">场地管理</MenuItem>
          <MenuItem name="3-2" :to="{name: '报修管理'}">报修管理</MenuItem>
        </Submenu>
      </Menu>
      <Menu theme="dark" width="auto" v-if="userInfo.role === '教师'">
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-navigate"></Icon>
            教务管理
          </template>
          <MenuItem name="2-1" :to="{name: '请假审批'}">请假审批</MenuItem>
          <MenuItem name="2-2" :to="{name: '成绩管理'}">成绩管理</MenuItem>
        </Submenu>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            办公管理
          </template>
          <MenuItem name="3-1" :to="{name: '用车申请'}">用车申请</MenuItem>
          <MenuItem name="3-2" :to="{name: '用车审批'}">用车审批</MenuItem>
          <MenuItem name="3-3" :to="{name: '场地预约'}">场地预约</MenuItem>
          <MenuItem name="3-4" :to="{name: '设备报修'}">设备报修</MenuItem>
        </Submenu>
      </Menu>
    </Sider>
    <Layout :style="{marginLeft: '200px'}">
      <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
        <div style="text-align: right;margin-right: 20px;cursor: pointer" @click="logout">
          <img src="../assets/img/exit.png" alt="" style="position: relative;top:10px;">
          退出登陆
        </div>
      </Header>
      <Content :style="{padding: '0 16px 16px'}">
        <router-view></router-view>

      </Content>
    </Layout>
  </div>
</template>
<script>
import fetch from '@/assets/tools/fetch'
import allApi from '@/assets/api/test'
export default {
  data () {
    return {
      userInfo: { role: '' },
      timer: null, // 获取本地userInfo 计数器
      count: 1000
    }
  },
  created () {
    this.timer = setInterval(() => {
      if (localStorage.getItem('userInfo')) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        clearInterval(this.timer)
      }
    }, 100)
  },
  mounted () {

  },
  methods: {
    logout () {
      fetch.get(allApi.logout, '', res => {
        if (res.code === 200) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = res.data
        }
      })
    }
  }
}
</script>