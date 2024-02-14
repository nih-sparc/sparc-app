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
import { propOr } from 'ramda'
import DOMPurify from 'isomorphic-dompurify'

export default {
  components: {
    CookieNotice,
    sparcHeader,
    sparcFooter
  },
  computed: {
    ...mapState('layouts/default', {
      scrollingState: state => state.disableScrolling,
      hasAcceptedGDPR: state => state.hasAcceptedGDPR,
      hasSeenPortalNotification: state => state.hasSeenPortalNotification,
      portalNotification: state => state.portalNotification
    }),
  },
  mounted() {
    this.showPortalNotification()
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
  methods: {
    showPortalNotification() {
      const displayOnHomePageOnly = propOr("", 'displayOn', this.portalNotification) === 'Homepage Only'
      const currentlyOnHomePage = this.$route.fullPath === "/"
      const message = DOMPurify.sanitize(propOr("", 'message', this.portalNotification).trim(), {
        ALLOWED_TAGS: ['a', 'br', 'sup'], // We allow links, line breaks, and sup tags
        ALLOWED_ATTR: ['href'], // We allow the href attribute for links
      })
      const messageType = propOr("", 'messageType', this.portalNotification)
      const onlyShowOnce = propOr(true, 'showOnce', this.portalNotification)
      const stopShowingDate = propOr(undefined, 'stopShowingDate', this.portalNotification)
      // If the stop showing time is not set then always display message, therwise check if the date has passed
      const stopShowing = stopShowingDate === undefined ? false : new Date(stopShowingDate).getTime() < new Date().getTime()
      if (message != "" && !stopShowing) {
        if (!onlyShowOnce || !this.hasSeenPortalNotification) {
          if (!displayOnHomePageOnly || (displayOnHomePageOnly && currentlyOnHomePage)) {
            switch (messageType) {
              case 'Error': {
                this.$message({
                  message: message,
                  showClose: true,
                  iconClass: 'el-icon-circle-close',
                  customClass: 'el-message--error',
                  dangerouslyUseHTMLString: true,
                  duration: 0
                })
                break
              }
              case 'Success': {
                this.$message({
                  message: message,
                  showClose: true,
                  iconClass: 'el-icon-circle-check',
                  customClass: 'el-message--success',
                  dangerouslyUseHTMLString: true,
                  duration: 0
                })
                break
              }
              case 'Information': {
                this.$message({
                  message: message,
                  showClose: true,
                  iconClass: 'about-icon',
                  customClass: 'el-message--info',
                  dangerouslyUseHTMLString: true,
                  duration: 0
                })
                break
              }
            }
            const today = new Date()
            const expirationDate = new Date(today.setDate(today.getDate() + 30))
            this.$cookies.set('PortalNotification:hasBeenSeen', true, { expires: expirationDate })
          }
        }
      }
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
