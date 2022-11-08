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
      <el-upload
        ref="fileUploader"
        action=""
        :limit="limit"
        :auto-upload="false"
        :on-change="onUploadChange"
        :on-remove="onRemove"
        :before-remove="beforeRemove" >
        <el-button slot="trigger" class="secondary">Select file</el-button>
        <div slot="tip" class="el-upload__tip">jpg/png file with a size less than 5MB</div>
      </el-upload>
    </el-form-item>

    <el-form-item prop="url" label="Supporting Information">
      <el-input placeholder="Enter URL" v-model="form.url">
        <template slot="prepend">Http://</template>
      </el-input>
    </el-form-item>

    <hr/>

    <div class="heading1 mb-16">Event specific details</div>

    <el-form-item prop="location" label="Location">
      <el-input v-model="form.location" placeholder="Enter the location of the event. If there is no physical location, please enter 'virtual'" />
    </el-form-item>

    <el-form-item prop="startDate" label="Start Date">
      <el-date-picker
        v-model="form.startDate"
        type="date"
        placeholder="Enter the start date"
      />
    </el-form-item>

    <el-form-item prop="endDate" label="End Date">
      <el-date-picker
        v-model="form.endDate"
        type="date"
        placeholder="Enter the end date"
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

import FileUploadMixin from '@/mixins/file-upload/index'
import { propOr } from 'ramda'

export default {
  name: 'NewsAndEventsForm',

  mixins: [FileUploadMixin],

  data() {
    return {
      hasError: false,
      form: {
        name: '',
        email: '',
        title: '',
        summary: '',
        url: '',
        location: '',
        startDate: '',
        endDate: ''
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

      const description = `
        <b>Contact Information</b><br><br>
        <b>Name:</b><br>${this.form.name}<br><br>
        <b>E-mail:</b><br>${this.form.email}<br><br>
        <b>News or Event Details:</b><br><br>
        <b>Title:</b><br>${this.form.title}<br><br>
        <b>Summary:</b><br>${this.form.summary}<br><br>
        <b>Supporting Information URL:</b><br>${this.form.url == '' ? 'N/A' : this.form.url}<br><br>
        <b>Event Specific Details:</b><br><br>
        <b>Location:</b><br>${this.form.location == '' ? 'N/A' : this.form.location}<br><br>
        <b>Start Date:</b><br>${this.form.startDate == '' ? 'N/A' : new Date(this.form.startDate).toDateString()}<br><br>
        <b>End Date:</b><br>${this.form.endDate == '' ? 'N/A' : new Date(this.form.endDate).toDateString()}<br><br>
      `
      let formData = new FormData();
      formData.append("title", `News or Event creation request - ${this.form.title}`)
      formData.append("description", description)
      if (propOr('', 'name', this.file) != '') {
        formData.append("attachment", this.file, this.file.name)
      }

      this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
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
  border-left: none;
  border-width: 2px;
  border-color: $lineColor1;
  margin: 2.5rem 0;
}
.error {
  color: $danger;
}
</style>
