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

    <user-contact-form-item v-model="form.user"/>

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
import { mapGetters } from 'vuex'
import NewsletterMixin from '../NewsletterMixin'
import RecaptchaMixin from '@/mixins/recaptcha/index'
import UserContactFormItem from '../UserContactFormItem.vue'
import { saveForm, loadForm } from '~/pages/data/utils'

export default {
  name: 'FeedbackForm',

  mixins: [NewsletterMixin, RecaptchaMixin],

  components: {
    UserContactFormItem
  },

  data() {
    return {
      form: {
        detailedDescription: '',
        shortDescription: '',
        user: {
          typeOfUser: '',
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.profileEmail,
          sendCopy: true,
          shouldFollowUp: true,
          shouldSubscribe: false
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
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail'])
  },

  mounted() {
    // Reset form fields when showing the form
    this.hasError = false
    this.$refs.submitForm.resetFields()
    const form = loadForm('researchForm')
    if (form) {
      this.form = {
        ...this.form,
        ...form
      }
    }
  },

  methods: {
    /**
     * Send form to endpoint
     */
    async sendForm() {
      this.isSubmitting = true
      const description = `
        <b>Detailed description:</b><br>${this.form.detailedDescription}<br><br>
        <b>What type of user are you?</b><br>${this.form.user.typeOfUser}<br><br>
        <b>Name:</b><br>${this.form.user.firstName} ${this.form.user.lastName}<br><br>
        <b>Email:</b><br>${this.form.user.email}
      `
      let formData = new FormData();
      formData.append("type", "research")
      formData.append("sendCopy", this.form.user.sendCopy)
      formData.append("title", `SPARC Research Submission: ${this.form.shortDescription}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.user.email)

      // Save form to sessionStorage
      saveForm(this.form, 'researchForm')

      await this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
        .then(() => {
          if (this.form.user.shouldSubscribe) {
            this.subscribeToNewsletter(this.form.user.email, this.form.user.firstName, this.form.user.lastName)
          } else {
            this.$emit('submit', this.form.user.firstName)
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
