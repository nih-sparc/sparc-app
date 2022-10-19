<template>
  <el-form
    ref="contactForm"
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

    <el-form-item prop="shouldFollowUp" class="mt-16">
      <el-checkbox v-model="form.shouldFollowUp">
        <span class="body1">Let me know when you resolve this issue</span>
      </el-checkbox>
    </el-form-item>

      <el-form-item prop="firstName" label="First Name" class="">
        <el-input v-model="form.firstName" placeholder="First name here" />
      </el-form-item>

      <el-form-item prop="lastName" label="Last Name">
        <el-input v-model="form.lastName" placeholder="Last name here" />
      </el-form-item>

      <el-form-item prop="email" label="Email" class="mb-0">
        <el-input v-model="form.email" placeholder="Email here" type="email" />
      </el-form-item>

      <el-form-item prop="shouldSubscribe" class="mt-16">
        <el-checkbox v-model="form.shouldSubscribe">
          <span class="body1">Subscribe to the SPARC Newsletter</span>
        </el-checkbox>
      </el-form-item>

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

export default {
  name: 'BugForm',

  mixins: [NewsletterMixin],

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

  mounted() {
    // Reset form fields when showing the form
    this.$refs.contactForm.resetFields()
    this.hasError = false
  },

  methods: {
    /**
     * Submit the form and validate
     */
    onSubmit() {
      this.hasError = false
      this.$refs.contactForm.validate(valid => {
        if (!valid) {
          return
        }
        this.sendForm()
      })
    },

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
    sendForm() {
      this.isSubmitting = true

      this.$axios
        .post(`${process.env.portal_api}/tasks`, {
          title: this.form.title,
          description: `
          What type of user are you?<br>${this.form.typeOfUser}
            <br><br>Is this about a specific page or resource?
            <br>${this.form.pageOrResource}${
            this.form.pageUrl ? ' - ' + this.form.pageUrl : ''
          }
            <br><br>Description
            <br>${this.form.description}
            <br><br>How would you like this experience to improve?
            <br>${this.form.howToImprove}
            <br><br>Let me know when you resolve this issue
            <br>${this.form.shouldFollowUp ? 'Yes' : 'No'}
            <br><br>Email
            <br>${this.form.email}
          `,
          userEmail: this.form.shouldFollowUp ? this.form.email : null
        })
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
