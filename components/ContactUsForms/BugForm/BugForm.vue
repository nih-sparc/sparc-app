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

    <el-form-item prop="pageUrl" label="Provide the problematic page's URL">
      <el-input v-model="form.pageUrl" placeholder="URL">
        <template slot="prepend">Http://</template>
      </el-input>
    </el-form-item>

    <el-form-item
      prop="title"
      label="Provide a short description of what you were doing *"
    >
      <el-input
        v-model="form.title"
        placeholder="(Example: When I click <this button>, <this happens>.)"
      />
    </el-form-item>

    <el-form-item prop="description" label="Provide a detailed description *">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="Please provide specific steps so our team can reproduce your experience in order to resolve the issue."
      />
    </el-form-item>

    <el-form-item prop="fileAttachment" label="File Attachment">
      <div class="body4 mb-8"><i>Feel free to attach a screenshot to help us better understand the problem. We recommend images of 600px by 600px.</i></div>
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

    <el-form-item
      prop="howToImprove"
      label="How would you like this experience to improve? *"
      class="mb-0"
    >
      <el-input
        v-model="form.howToImprove"
        type="textarea"
        :rows="3"
        placeholder="Description here"
      />
    </el-form-item>

    <el-form-item prop="firstName" label="First Name" class="mt-16">
      <el-input v-model="form.firstName" placeholder="First name here" />
    </el-form-item>

    <el-form-item prop="lastName" label="Last Name">
      <el-input v-model="form.lastName" placeholder="Last name here" />
    </el-form-item>

    <el-form-item prop="email" label="Email" class="mb-0">
      <el-input v-model="form.email" placeholder="Email here" type="email" />
    </el-form-item>

    <el-form-item prop="shouldFollowUp" class="mt-16 mb-0">
      <el-checkbox v-model="form.shouldFollowUp">
        <span class="body1">Let me know when you resolve this issue</span>
      </el-checkbox>
    </el-form-item>

    <el-form-item prop="shouldSubscribe">
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
import FileUploadMixin from '@/mixins/file-upload/index'
import RecaptchaMixin from '@/mixins/recaptcha/index'
import { propOr } from 'ramda'

export default {
  name: 'BugForm',

  mixins: [NewsletterMixin, FileUploadMixin, RecaptchaMixin],

  data() {
    return {
      form: {
        typeOfUser: '',
        pageOrResource: '',
        title: '',
        description: '',
        howToImprove: '',
        shouldFollowUp: false,
        firstName: '',
        lastName: '',
        email: '',
        shouldSubscribe: false,
        pageUrl: ''
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
            message: 'Please enter your email',
            type: 'email',
            trigger: 'blur',
            validator: this.validateEmail
          }
        ],

        firstName: [
          {
            required: false,
            message: 'Please enter your first name',
            trigger: 'blur',
            validator: this.validateForNewsletter
          }
        ],

        lastName: [
          {
            required: false,
            message: 'Please enter your last name',
            trigger: 'blur',
            validator: this.validateForNewsletter
          }
        ],

        title: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],

        description: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],

        howToImprove: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],

        pageUrl: [
          {
            required: true,
            message: "Please enter the problematic page's URL",
            trigger: 'change',
            validator: this.validateUrl
          }
        ]
      }
    }
  },

  computed: {
    bugSourceUrl() {
      return this.$route.query.source_url
    }
  },

  mounted() {
    // Reset form fields when showing the form
    this.$refs.submitForm.resetFields()
    this.hasError = false

    if (this.bugSourceUrl != undefined) {
      const fullUrl = process.env.ROOT_URL + this.bugSourceUrl
      this.form.pageUrl = 'www.' + fullUrl.replace(/^https?:\/\//, '')
    }
  },

  methods: {
    validateEmail: function(rule, value, callback) {
      if (this.form.shouldFollowUp && value === '') {
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
      const fileName = propOr('', 'name', this.file)
      const description = `
        <b>What type of user are you?</b><br>${this.form.typeOfUser}<br><br>
        <b>Is this about a specific page or resource?</b><br>${this.form.pageOrResource}${this.form.pageUrl ? ' - ' + this.form.pageUrl : ''}<br><br>
        <b>Description</b><br>${this.form.description}<br><br>
        ${fileName != '' ? `<b>File Attachment:</b><br>${fileName}<br><br>` : ''}
        <b>How would you like this experience to improve?</b><br>${this.form.howToImprove}<br><br>
        <b>Let me know when you resolve this issue</b><br>${this.form.shouldFollowUp ? 'Yes' : 'No'}<br><br>
        <b>Email</b><br>${this.form.email}
      `
      let formData = new FormData();
      formData.append("type", "bug")
      formData.append("title", this.form.title)
      formData.append("description", description)
      formData.append("userEmail", this.form.email)
      if (propOr('', 'name', this.file) != ''){
        formData.append("attachment", this.file, this.file.name)
      }

      await this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
        .then(() => {
          if (this.form.shouldSubscribe) {
            this.subscribeToNewsletter(this.form.email, this.form.firstName, this.form.lastName)
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
