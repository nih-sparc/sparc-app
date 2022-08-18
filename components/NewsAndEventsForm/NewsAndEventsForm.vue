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

    <hr/>

    <el-form-item prop="fileAttachment" label="Image Upload">
      <div class="body4 mb-8"><i>To help other users understand your news or event, an image can really help. We recommend images of 600px by 600px.</i></div>
      <el-button class="secondary" @click="onSelectFileAttachment">
        Select image
      </el-button>
    </el-form-item>

    <el-form-item prop="url" label="Supporting Information">
      <el-input placeholder="Enter URL" v-model="form.url">
        <template slot="prepend">Http://</template>
      </el-input>
    </el-form-item>

    <hr/>

    <div class="heading1 mb-16">Event specific details</div>

    <el-form-item prop="location" label="Location">
      <el-input v-model="form.location" placeholder="Enter the location of the event" />
    </el-form-item>

    <el-form-item prop="date" label="Date">
      <el-date-picker
        v-model="form.date"
        type="date"
        placeholder="Enter the date of the event"
      />
    </el-form-item>

    <hr/>

    <div class="body4 mb-16"><i>Before your news or event is published on the SPARC Portal, it will be reviewed. The reviewer may contact you to clarify or seek additional information.</i></div>

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
        fileAttachment: '',
        url: '',
        location: '',
        date: '',
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
          url: this.form.url,
          location: this.form.location,
          date: this.form.date,
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
  margin: 2.5rem 0;
}
.error {
  color: $danger;
}
</style>
