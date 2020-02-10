<template>
  <div :class="[scrollingState ? 'layout' : '']">
    <sparc-header />
    <nuxt />
    <sparc-footer />
    <cookie-notice v-if="!hasAccepteedGDPR" />
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
    ...mapState({
      scrollingState: 'disableScrolling'
    }),

    /**
     * Compute if the user has accepted GDPR cookie notice
     */
    hasAccepteedGDPR: function() {
      return this.$cookies.get('GDPR:accepted')
    }
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
