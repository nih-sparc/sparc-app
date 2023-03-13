<template>
  <div class="loading-container" v-if="loading">
    <img class="logo" alt="SPARC logo" :src="logo" />
  </div>
</template>
<script>
export default {
  name: 'Loading',
  data: () => ({
    loading: false,
    loaded: false,
    logo: require('~/assets/sparcLogoFast.gif'),
  }),
  methods: {
    start() {
      this.loaded = false
      this.loading = false
      setTimeout(() => {
        if (!this.loaded)
          this.loading = true
      }, 1000)
    },
    finish() {
      this.loading = false
      this.loaded = true
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  z-index: 1;
  background-color: white;
  opacity: .5;
  width: 100vw;
  height: 100vh;
}
.logo {
  position: absolute;
  height: 5rem;
  z-index: 2;
  left: calc(50vw - 5rem);
  top: calc(50vh - 5rem);
}
</style>