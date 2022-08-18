<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item prop="name" label="Your name">
      <el-input v-model="form.name" placeholder="Enter your name" />
    </el-form-item>

    <el-form-item prop="email" label="Email address">
      <el-input v-model="form.email" placeholder="Enter your email address" type="email" />
    </el-form-item>

    <hr/>

    <el-form-item prop="title" label="Title">
      <el-input v-model="form.title" placeholder="Enter a title for your news or event" />
    </el-form-item>

    <el-form-item prop="summary" label="Summary">
      <el-input
        v-model="form.summary"
        type="textarea"
        :rows="3"
        placeholder="Tell us some details about your news or event"
      />
    </el-form-item>

    <el-form-item class="submit-button">
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

export default {
  name: 'NewsAndEventsForm',

  data() {
    return {
      hasError: false,
      form: {
        name: '',
        email: '',
        title: '',
        summary: '',
      },
      isSubmitting: false,
      formRules: {
        email: [
          {
            required: true,
            message: 'Please enter your email',
            type: 'email',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: 'Please enter your name',
            trigger: 'blur',
            validator: this.validateForNewsletter
          }
        ],
        title: [
          {
            required: true,
            message: 'Please a title',
            trigger: 'blur',
          }
        ],
        summary: [
          {
            required: true,
            message: 'Please enter a summary',
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
     * Submit the form and validate
     */
    onSubmit() {
      this.hasError = false

      this.$refs.submitForm.validate(valid => {
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
          name: this.form.name,
          email: this.form.email,
          title: this.form.title,
          message: `
            <br>Summary
            <br>${this.form.summary}
          `
        })
        .then(() => {
          this.$emit('submit', this.form.name)
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
  text-align: right;
  margin-bottom: 0 !important;
}
hr {
  border-top: none;
  border-width: 2px;
  border-color: $lineColor1;
}
.error {
  color: $danger;
}
</style>
