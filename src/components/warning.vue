<template>
  <div class="box">
    <div class="main">
      <img src="@/assets/images/形状.png" alt="">
      <div class="warning">报警！</div>
      <div class="text">{{this.message}}有施工风险，请即刻查看。</div>
      <div class="btn">
        <a-button @click="close">关闭</a-button>
      </div>
      <audio :src="music" loop autoplay="autoplay" controls hidden="true"></audio>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      music: require('../assets/music.mp3')
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },

    ready () {
      console.log('play click')
    },
    pause () {
      console.log('pause click')
    }
  },
  watch: {
    message (val) {
      console.log(val, '---')
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.3);
  z-index: 99;
  cursor: pointer;
  .main{
    width: 400px;
    height: 400px;
    margin: 200px auto;
    text-align: center;
    .warning{
      font-size:32px;
      font-family:PingFangSC;
      font-weight:500;
      color:rgba(202,0,28,1);
      line-height:45px;
      margin-top: 30px;
      margin-left: 35px;
    }
    .text{
      font-size:16px;
      font-family:PingFangSC;
      font-weight:400;
      color:rgba(255,255,255,1);
      background:rgba(0,0,0,0.8);
      border-radius:2px;
      margin-top: 20px;
      padding: 23px 26px;
      line-height: 24px;
    }
    .btn{
      margin: 24px 0;
    }
  }
}
</style>
