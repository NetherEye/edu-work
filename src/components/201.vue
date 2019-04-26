<template>
  <div style="height:667px;margin: 100px auto;position: relative;">
    <img style="width: 50%;margin: 0 auto;display: block;" src="../assets/img/title.png" alt="">
    <div @click="quit" style="widht:4%;float: right;margin-right:30px;position: absolute;top:10px;right: 31%;width: 4%;cursor: pointer;"><img style="width:80%" src="../assets/img/logout.png" alt=""></div>
  </div>
</template>

<script>
import fetch from '@/assets/tools/fetch'
import allApi from '@/assets/api/test'
export default {
  data () {
    return {

    }
  },
  methods: {

    quit () {
      fetch.get(allApi.logout, '', res => {
        if (res.code == 200) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = res.data
        }
      })
    },
  }
}
</script>

<style scoped>
</style>