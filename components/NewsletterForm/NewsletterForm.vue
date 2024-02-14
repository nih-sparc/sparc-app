<template>
  <!-- Generated from MailChimp. Docs: https://mailchimp.com/help/add-a-signup-form-to-your-website/ -->
  <div id="mc_embed_signup">
    <form
      id="mc-embedded-subscribe-form"
      action="https://eepurl.com/hgBxgv"
      method="post"
      name="mc-embedded-subscribe-form"
      class="validate"
      target="_blank"
      novalidate
    >
      <div id="mc_embed_signup_scroll">
        <div class="clear">
          <div class="clear">
            <el-button
              id="mc-embedded-subscribe"
              native-type="submit"
              name="subscribe"
              class="secondary"
              @click="sendGtmEvent"
            >
              Sign Up <svg-icon icon="icon-open" height="16" width="16" />
            </el-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'NewsletterForm',
  props: {
    location: {
      type: String,
      default: ""
    }
  },
  methods: {
    sendGtmEvent() {
      this.$gtm.push({
        event: 'interaction_event',
        event_name: 'newsletter_signup',
        files: "",
        file_name: "",
        file_path: "",
        file_type: "",
        location: this.location,
        category: "",
        dataset_id: "",
        version_id: "",
        doi: "",
        citation_type: ""
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

form,
.mc-field-group {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
}
label {
  font-size: 1.5rem;
}
.input-text {
  border: 1px solid $medium-gray;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  &:focus {
    border-color: $app-primary-color;
  }
}
</style>
