<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="typeOfUser"
      label="What type of user are you? *"
    >
      <el-select
        v-model="form.typeOfUser"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="typeOfUserOption in questionOptions.typeOfUser"
          :key="typeOfUserOption"
          :label="typeOfUserOption"
          :value="typeOfUserOption"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="pageOrResource"
      label="Is this about a specific page or resource?"
    >
      <el-select
        v-model="form.pageOrResource"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="pageOrResource in questionOptions.pageOrResource"
          :key="pageOrResource"
          :label="pageOrResource"
          :value="pageOrResource"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="message" label="Your question or comment *">
      <el-input
        v-model="form.message"
        type="textarea"
        :rows="3"
        placeholder="Description here"
      />
    </el-form-item>

    <el-form-item prop="firstName" label="First Name">
      <el-input v-model="form.firstName" placeholder="First name here" />
    </el-form-item>

    <el-form-item prop="lastName" label="Last Name">
      <el-input v-model="form.lastName" placeholder="Last name here" />
    </el-form-item>

    <el-form-item prop="email" label="Email *" class="mb-0">
      <el-input v-model="form.email" placeholder="Email here" type="email" />
    </el-form-item>

    <el-form-item prop="shouldSubscribe" class="mt-16">
      <el-checkbox v-model="form.shouldSubscribe">
        <span class="body1">Subscribe to the SPARC Newsletter</span>
      </el-checkbox>
    </el-form-item>

    <recaptcha class="mb-16"/>

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
import { typeOfUser, pageOrResource } from '../questions'
import NewsletterMixin from '../NewsletterMixin'
import RecaptchaMixin from '@/mixins/recaptcha/index'

export default {
  name: 'GeneralForm',

  mixins: [NewsletterMixin, RecaptchaMixin],

  data() {
    return {
      form: {
        typeOfUser: '',
        pageOrResource: '',
        message: '',
        firstName: '',
        lastName: '',
        email: '',
        shouldSubscribe: false
      },
      questionOptions: {
        typeOfUser,
        pageOrResource
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
            trigger: 'blur'
          }
        ],

        firstName: [
          {
            required: true,
            message: 'Please enter your first name',
            trigger: 'blur',
            validator: this.validateForNewsletter
          }
        ],

        lastName: [
          {
            required: true,
            message: 'Please enter your last name',
            trigger: 'blur',
            validator: this.validateForNewsletter
          }
        ],

        message: [
          {
            required: true,
            message: 'Please enter a message',
            trigger: 'change'
          }
        ]
      }
    }
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

      await this.$axios
        .post(`${process.env.portal_api}/contact`, {
          name: `${this.form.firstName} ${this.form.lastName}`,
          email: this.form.email,
          message: `
            What type of user are you?<br>${this.form.typeOfUser}
            <br><br>Is this about a specific page or resource?
            <br>${this.form.pageOrResource}
            <br><br>Message
            <br>${this.form.message}
          `
        })
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
@import '../../../assets/_variables.scss';

.error {
  color: $facial;
}
</style>
