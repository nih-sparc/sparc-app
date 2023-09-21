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
      label="Is this about a specific page or resource? *"
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

    <el-form-item prop="pageUrl" label="Please provide the specific page URL">
      <el-input v-model="form.pageUrl" placeholder="URL">
        <template slot="prepend">Http://</template>
      </el-input>
    </el-form-item>

    <el-form-item
      prop="description"
      label="Provide a short description of your inquiry *"
    >
      <el-input
        v-model="form.description"
        placeholder="(Example: I have a question about <area of inquiry>)"
      />
    </el-form-item>

    <el-form-item prop="message" label="Your question or comment *">
      <el-input
        v-model="form.message"
        type="textarea"
        :rows="3"
        placeholder="Enter your question or comment"
      />
    </el-form-item>

    <hr />

    <user-contact-form-item showFollowUpOption v-model="form.user"/>

    <hr />

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
  name: 'GeneralForm',

  mixins: [NewsletterMixin, RecaptchaMixin],

  components: {
    UserContactFormItem
  },

  data() {
    return {
      form: {
        description: '',
        pageUrl: '',
        pageOrResource: '',
        message: '',
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
        description: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],
        pageOrResource: [
          {
            required: true,
            message: 'Please select an option',
            trigger: 'change'
          }
        ],
        message: [
          {
            required: true,
            message: 'Please enter a message',
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
    this.$refs.submitForm.resetFields()
    this.hasError = false
    const form = loadForm('generalForm')
    if (form) {
      this.form = {
        ...this.form,
        ...form
      }
    }
  },

  methods: {
    validateEmail: function(rule, value, callback) {
      if (value === '') {
        callback(new Error(rule.message))
      }
      callback()
    },

    validateUrl: function(rule, value, callback) {
      if (!value.includes('.') || value.lastIndexOf('.') == value.length - 1 || value.indexOf('.') == 0) {
        callback(new Error(rule.message))
      }
      callback()
    },
    /**
     * Send form to endpoint
     */
    async sendForm() {
      this.isSubmitting = true
      const description = `
        <b>Is this about a specific page or resource?</b><br>${this.form.pageOrResource}<br><br>
        <b>Your question or comment?</b><br>${this.form.message}<br><br>
        <b>Name:</b><br>${this.form.user.firstName} ${this.form.user.lastName}<br><br>
        <b>Email:</b><br>${this.form.user.email}<br><br>
        <b>I'd like updates about this submission:</b><br>${this.form.user.shouldFollowUp ? 'Yes' : 'No'}
      `
      let formData = new FormData();
      formData.append("type", "general")
      formData.append("sendCopy", this.form.user.sendCopy)
      formData.append("title", `SPARC Question or Inquiry Submission: ${this.form.description}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.user.email)

      // Save form to sessionStorage
      saveForm(this.form, 'generalForm')

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

.submit-button {
  text-align: left;
  margin-bottom: 0 !important;
}
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
::v-deep .file-upload {
  .el-form-item__label {
    margin-bottom: .3rem;
  }
}
</style>
