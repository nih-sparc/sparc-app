<template>
  <el-form
    ref="contactForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="sparcInvestigator"
      label="Are you a SPARC investigator?*"
    >
      <el-select v-model="form.sparcInvestigator" aria-placeholder="Select one">
        <el-option
          v-for="sparcInvestigatorOption in questionOptions.sparcInvestigator"
          :key="sparcInvestigatorOption"
          :label="sparcInvestigatorOption"
          :value="sparcInvestigatorOption"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="pageOrResource"
      label="Is this about a specific page or resource?"
    >
      <el-select v-model="form.pageOrResource" aria-placeholder="Select one">
        <el-option
          v-for="pageOrResource in questionOptions.pageOrResource"
          :key="pageOrResource"
          :label="pageOrResource"
          :value="pageOrResource"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      class="mb-0"
      prop="message"
      label="Your question or comment:*"
    >
      <el-input
        v-model="form.message"
        type="textarea"
        :rows="3"
        placeholder="Description here"
      />
    </el-form-item>

    <el-form-item prop="shouldSendCopy">
      <el-checkbox v-model="form.shouldSendCopy">
        Please send me a copy of this message
      </el-checkbox>
    </el-form-item>

    <el-form-item prop="firstName" label="First Name">
      <el-input v-model="form.firstName" placeholder="First name here" />
    </el-form-item>

    <el-form-item prop="lastName" label="Last Name">
      <el-input v-model="form.lastName" placeholder="Last name here" />
    </el-form-item>

    <el-form-item prop="email" label="Email" class="mb-0">
      <el-input v-model="form.email" placeholder="Email here" type="email" />
    </el-form-item>

    <el-form-item prop="shouldSubscribe">
      <el-checkbox v-model="form.shouldSubscribe">
        Subscribe to the SPARC Newsletter
      </el-checkbox>
    </el-form-item>

    <el-form-item>
      <el-button class="primary" :disabled="isSubmitting" @click="onSubmit">
        Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { sparcInvestigator, pageOrResource } from '../questions'

export default {
  name: 'GeneralForm',

  data() {
    return {
      form: {
        sparcInvestigator: '',
        pageOrResource: '',
        message: '',
        shouldSendCopy: false,
        firstName: '',
        lastName: '',
        email: '',
        shouldSubscribe: false
      },
      questionOptions: {
        sparcInvestigator,
        pageOrResource
      },
      isSubmitting: false,
      formRules: {
        sparcInvestigator: [
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
    this.$refs.contactForm.resetFields()
  },

  methods: {
    /**
     * Submit the form and validate
     */
    onSubmit() {
      this.$refs.contactForm.validate(valid => {
        if (!valid) {
          return
        }
        this.sendForm()
      })
    },

    /**
     * Send form to endpoint
     */
    sendForm() {
      this.isSubmitting = true

      this.$axios
        .post(`${process.env.portal_api}/contact`, {
          name: `${this.form.firstName} ${this.form.lastName}`,
          email: this.form.email,
          message: `
            Are you a SPARC investigator?<br>${this.form.sparcInvestigator}
            <br><br>Is this about a specific page or resource?
            <br>${this.form.pageOrResource}
            <br><br>Message
            <br>${this.form.message}
          `
        })
        .then(() => {
          if (this.form.shouldSubscribe) {
            this.subscribeToNewsletter()
          } else {
            this.$emit('submit')
          }
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },

    /**
     * Subscribe to Newsletter
     */
    subscribeToNewsletter() {
      this.isSubmitting = true

      this.$axios
        .post(`${process.env.portal_api}/mailchimp`, {
          email_address: this.form.email
        })
        .then(() => {
          this.$emit('submit', this.form.firstName)
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

<style lang="scss" scoped></style>
