<template>
  <div class="cookie-notice">
    <div class="container">
      <div class="cookie-notice__content">
        <div class="cookie-notice__copy">
          <h2>
            This website uses cookies to ensure that you get the best
            experience.
          </h2>
          <p>
            To learn more, please refer to the
            <nuxt-link to="privacy">
              Privacy Policy.
            </nuxt-link>
            By closing this banner or clicking accept, you agree to the use of
            cookies.
          </p>
        </div>
        <div>
          <bf-button class="primary" @click="closeNotice">
            Accept
          </bf-button>
        </div>
      </div>
    </div>
    <button class="btn-close" @click="closeNotice">
      <svg-icon name="icon-remove" height="10" width="10" />
    </button>
  </div>
</template>

<script>
import BfButton from '@/components/shared/BfButton/BfButton'
export default {
  name: 'CookieNotice',

  components: {
    BfButton
  },

  methods: {
    /**
     * Close notice and accept the policy
     */
    closeNotice: function() {
      this.$cookies.set('GDPR:accepted', true)
      this.$store.dispatch('setHasAcceptedGdpr', true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.cookie-notice {
  background: #fff;
  bottom: 0;
  box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.07);
  color: $navy;
  left: 0;
  right: 0;
  padding: 1.625em 0;
  position: fixed;
  z-index: 9;
}
.cookie-notice__content {
  max-width: 80%;
  @media (min-width: 48em) {
    align-items: center;
    display: flex;
    max-width: none;
    justify-content: space-between;
  }
}
.cookie-notice__copy {
  margin-bottom: 1em;
  @media (min-width: 48em) {
    margin: 0 1em 0 0;
    max-width: 53.75em;
  }
}
h2 {
  font-size: 1.1em;
  margin: 0;
  line-height: 1.2;
  @media (min-width: 48em) {
    font-size: 1.5em;
  }
}
p {
  font-size: 0.875em;
  line-height: 1.2;
  margin: 0;
}
.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25em;
  position: absolute;
  right: 1em;
  top: 1em;
}
</style>
