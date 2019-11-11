<template>
  <div id="app">
    <a-spin :spinning="spinning" tip="loading" size="large">
      <router-view/>
    </a-spin>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    spinning () {
      return this.$store.state.spinning > 0
    }
  }
}
</script>

<style>

</style>
