<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="shortDescription"
      label="Provide a short description of your research *"
    >
      <el-input
        v-model="form.shortDescription"
        placeholder="(Example: I am studying the effects of <approach> on <anatomical structure>)"
      />
    </el-form-item>

    <el-form-item prop="detailedDescription" label="Provide a detailed description of your research *">
      <el-input
        v-model="form.detailedDescription"
        type="textarea"
        :rows="3"
        placeholder="Please provide specifics about your research. Our curation team will then contact you."
      />
    </el-form-item>

    <hr/>

    <user-contact-form-item
      @type-of-user-updated="form.typeOfUser = $event"
      @first-name-updated="form.firstName = $event"
      @last-name-updated="form.lastName = $event"
      @email-updated="form.email = $event"
      @follow-up-updated="form.shouldFollowUp = $event"
      @sned-copy-updated="form.sendCopy = $event"
      @subscribe-updated="form.shouldSubscribe = $event"
    />

    <hr/>

    <div class="heading2">
      Please check the box to proceed
    </div>
    <recaptcha class="recaptcha my-16 pl-16"/>

    <hr/>

    <el-form-item>
      <el-button class="primary" :disabled="isSubmitting" @click="onSubmit">
        Submit
      </el-button>
      <p v-if="hasError" class="error">
        An error has occurred, please try again.
      </p>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import NewsletterMixin from '../NewsletterMixin'
import RecaptchaMixin from '@/mixins/recaptcha/index'
import UserContactFormItem from '../UserContactFormItem.vue'

export default {
  name: 'FeedbackForm',

  mixins: [NewsletterMixin, RecaptchaMixin],

  components: {
    UserContactFormItem
  },

  data() {
    return {
      form: {
        typeOfUser: '',
        detailedDescription: '',
        shortDescription: '',
        firstName: '',
        lastName: '',
        email: '',
        shouldSubscribe: true,
        sendCopy: true
      },
      isSubmitting: false,
      formRules: {
        typeOfUser: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'change'
          }
        ],

        email: [
          {
            required: true,
            message: 'Please enter your email',
            type: 'email',
            trigger: 'blur',
          }
        ],

        firstName: [
          {
            required: true,
            message: 'Please enter your first name',
            trigger: 'blur',
          }
        ],

        lastName: [
          {
            required: true,
            message: 'Please enter your last name',
            trigger: 'blur',
          }
        ],

        shortDescription: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],

        detailedDescription: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],
      }
    }
  },

  computed: {
    ...mapState('pages/contact-us', {
      userTypes: state => state.formOptions.userTypes
    }),
  },

  mounted() {
    // Reset form fields when showing the form
    this.$refs.submitForm.resetFields()
    this.hasError = false
  },

  methods: {
    /**
     * Send form to endpoint
     */
    async sendForm() {
      this.isSubmitting = true
      const description = `
        <b>Detailed description:</b><br>${this.form.detailedDescription}<br><br>
        <b>What type of user are you?</b><br>${this.form.typeOfUser}<br><br>
        <b>Name:</b><br>${this.form.firstName} ${this.form.lastName}<br><br>
        <b>Email:</b><br>${this.form.email}
      `
      let formData = new FormData();
      formData.append("type", "research")
      formData.append("sendCopy", this.form.sendCopy)
      formData.append("title", `SPARC Research Submission: ${this.form.shortDescription}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.email)

      await this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
        .then(() => {
          if (this.form.shouldSubscribe) {
            this.subscribeToNewsletter(this.form.email, this.form.firstName, this.form.lastName)
          } else {
            this.$emit('submit', this.form.firstName)
          }
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

hr {
  border-top: none;
  border-left: none;
  border-width: 2px;
  border-color: $lineColor1;
  margin: 2rem 0;
}
.error {
  color: $danger;
}
.recaptcha {
  display: flex;
  justify-content: left;
}
</style>
