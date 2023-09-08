<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="pageOrResource"
      label="What area of the SPARC Portal is this related to?"
    >
      <el-select
        v-model="form.pageOrResource"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="area in areasOfSparc"
          :key="area"
          :label="area"
          :value="area"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="shortDescription"
      label="Provide a short description of your feedback *"
    >
      <el-input
        v-model="form.shortDescription"
        placeholder="(Example: I think it would be great to <your idea>)"
      />
    </el-form-item>

    <el-form-item prop="detailedDescription" label="Provide a detailed description *">
      <el-input
        v-model="form.detailedDescription"
        type="textarea"
        :rows="3"
        placeholder="Provide a detailed description of your feedback"
      />
    </el-form-item>

    <hr/>

    <user-contact-form-item v-model="form.user" showFollowUpOption/>

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
import NewsletterMixin from '../NewsletterMixin'
import RecaptchaMixin from '@/mixins/recaptcha/index'
import UserContactFormItem from '../UserContactFormItem.vue'
import { mapState, mapGetters } from 'vuex'
import { loadForm, saveForm } from '~/pages/data/utils'

export default {
  name: 'FeedbackForm',

  mixins: [NewsletterMixin, RecaptchaMixin],

  components: {
    UserContactFormItem
  },

  data() {
    return {
      form: {
        pageOrResource: '',
        detailedDescription: '',
        shortDescription: '',
        user: {
          typeOfUser: '',
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.profileEmail,
          sendCopy: true,
          shouldFollowUp: true,
          shouldSubscribe: false,
        }
      },
      isSubmitting: false,
      formRules: {
        user: {
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
          ]
        },
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
      areasOfSparc: state => state.formOptions.areasOfSparc
    }),
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail'])
  },

  mounted() {
    // Reset form fields when showing the form
    this.hasError = false
    this.$refs.submitForm.resetFields()
    const form = loadForm('feedbackForm')
    if (form) {
      this.form = form
    }
  },

  methods: {
    /**
     * Send form to endpoint
     */
    async sendForm() {
      this.isSubmitting = true
      const description = `
        <b>What area of the SPARC Portal is this related to?</b><br>${this.form.pageOrResource}<br><br>
        <b>Detailed description:</b><br>${this.form.detailedDescription}<br><br>
        <b>What type of user are you?</b><br>${this.form.user.typeOfUser}<br><br>
        <b>Name:</b><br>${this.form.user.firstName} ${this.form.user.lastName}<br><br>
        <b>Email:</b><br>${this.form.user.email}<br><br>
        <b>I'd like updates about this submission:</b><br>${this.form.user.shouldFollowUp ? 'Yes' : 'No'}
      `
      let formData = new FormData();
      formData.append("type", "feedback")
      formData.append("sendCopy", this.form.user.sendCopy)
      formData.append("title", `SPARC Feedback Submission: ${this.form.shortDescription}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.user.email)

      // Save form to sessionStorage
      saveForm(this.form, 'feedbackForm')

      await this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
        .then(() => {
          if (this.form.user.shouldSubscribe) {
            this.subscribeToNewsletter(this.form.user.email, this.form.user.firstName, this.form.user.lastName)
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
