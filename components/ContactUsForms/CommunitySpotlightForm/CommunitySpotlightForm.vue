<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item prop="title" label="Title *">
      <el-input v-model="form.title" placeholder="Enter a title for your story" />
    </el-form-item>

    <el-form-item prop="summary" label="Summary *">
      <el-input
        v-model="form.summary"
        type="textarea"
        :rows="3"
        placeholder="Tell us some details about your story"
      />
    </el-form-item>

    <hr/>

    <user-contact-form-item
      @type-of-user-updated="form.typeOfUser = $event"
      @first-name-updated="form.firstName = $event"
      @last-name-updated="form.lastName = $event"
      @email-updated="form.email = $event"
      @follow-up-updated="form.shouldFollowUp = $event"
      @sned-copy-updated="form.sendCopy = $event"
      @subscribe-updated="form.shouldSubscribe = $event"
    />

    <hr/>

    <div class="heading2">
      Please check the box to proceed
    </div>
    <recaptcha class="recaptcha my-16 pl-16"/>

    <hr/>

    <div class="body4 mb-16"><i>Before your story is published on the SPARC Portal, it will be reviewed. The reviewer may contact you to clarify or seek additional information.</i></div>

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
import RecaptchaMixin from '@/mixins/recaptcha/index'
import NewsletterMixin from '@/components/ContactUsForms/NewsletterMixin'
import UserContactFormItem from '../UserContactFormItem.vue'
import UrlList from '@/components/Url/UrlList.vue'
import { propOr, isEmpty } from 'ramda'
import { mapState } from 'vuex'

export default {
  name: 'CommunitySpotlightForm',

  mixins: [FileUploadMixin, RecaptchaMixin, NewsletterMixin],

  components: {
    UrlList,
    UserContactFormItem
  },

  data() {
    return {
      allowVideos: true,
      hasError: false,
      form: {
        typeOfUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        summary: '',
        supportingLinks: [''],
        sendCopy: true,
        shouldSubscribe: true
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
        ],
        title: [
          {
            required: true,
            message: 'Please enter a title',
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

  computed: {
    ...mapState('pages/contact-us', {
      userTypes: state => state.formOptions.userTypes
    }),
    supportingLinksText: function() {
      let message = ''
      this.form.supportingLinks.forEach(link => {
        if (!isEmpty(link))
          message += `${link}<br>`
      })
      return isEmpty(message) ? 'N/A<br>' : message
    },
  },

  methods: {
    addSupportingLink() {
      this.form.supportingLinks.push('')
    },
    /**
     * Send form to endpoint
     */
    async sendForm() {
      this.isSubmitting = true
      const fileName = propOr('', 'name', this.file)
      const description = `
        <b>Contact Information</b><br><br>
        <b>First Name:</b><br>${this.form.firstName}<br><br>
        <b>Last Name:</b><br>${this.form.lastName}<br><br>
        <b>E-mail:</b><br>${this.form.email}<br><br>
        <b>Story Details:</b><br><br>
        <b>Title:</b><br>${this.form.title}<br><br>
        <b>Summary:</b><br>${this.form.summary}<br><br>
        ${fileName != '' ? `<b>File Attachment:</b><br>${fileName}<br><br>` : ''}
        <b>Supporting Information links:</b><br>${this.supportingLinksText}<br>
      `

      let formData = new FormData()
      formData.append("type", "communitySpotlight")
      formData.append("sendCopy", this.form.sendCopy)
      formData.append("title", `SPARC Story Submission: ${this.form.title}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.email)
      if (propOr('', 'name', this.file) != '') {
        formData.append("attachment", this.file, this.file.name)
      }  
      await this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
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
