<template>
  <div :class="[scrollingState ? 'layout' : '']">
    <sparc-header />
    <nuxt />
    <sparc-footer />
    <cookie-notice v-if="!hasAcceptedGDPR" />
  </div>
</template>

<script>
import sparcHeader from '@/components/header/Header.vue'
import sparcFooter from '@/components/footer/Footer.vue'
import CookieNotice from '@/components/CookieNotice/CookieNotice.vue'
import { mapState } from 'vuex'

export default {
  components: {
    CookieNotice,
    sparcHeader,
    sparcFooter
  },
  computed: {
    ...mapState('layouts/default', {
      scrollingState: state => state.disableScrolling
    }),
    ...mapState('layouts/default', {
      hasAcceptedGDPR: state => state.hasAcceptedGDPR
    })
  },
  head() {
    return {
      meta: [
        { 
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.ROOT_URL}${this.$route.fullPath}`,
        },
      ]
    }
  },
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
