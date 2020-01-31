<template>
  <div :class="[scrollingState ? 'layout' : '']">
    <sparc-header />
    <nuxt />
    <sparc-footer />
  </div>
</template>

<script>
import sparcHeader from '@/components/header/Header.vue'
import sparcFooter from '@/components/footer/Footer.vue'
import { mapState } from 'vuex'

export default {
  components: {
    sparcHeader,
    sparcFooter
  },
  computed: {
    ...mapState({
      scrollingState: 'disableScrolling'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.layout {
  @media screen and (max-width: 768px) {
    overflow: hidden;
    position: fixed;
  }
}
</style>
