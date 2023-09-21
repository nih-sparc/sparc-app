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

    <el-form-item class="file-upload" prop="fileAttachment" label="Image Upload">
      <div class="body4 mb-8"><i>To help others understand your story, an image can really help. We recommend images of 600px by 600px.</i></div>
      <el-upload
        ref="fileUploader"
        action=""
        :limit="limit"
        :auto-upload="false"
        :on-change="onUploadChange"
        :on-remove="onRemove"
        :before-remove="beforeRemove" >
        <el-button slot="trigger" class="secondary">Select file</el-button>
        <span slot="tip" class="el-upload__tip ml-16">jpg/png file with a size less than 5MB</span>
      </el-upload>
    </el-form-item>

    <el-form-item prop="supportingLinks" label="Supporting Information">
      <url-list v-model="form.supportingLinks" @add-link="addSupportingLink" placeholder="Enter URL">
        <template slot="prepend">Http://</template>
      </url-list>
    </el-form-item>

    <hr/>

    <user-contact-form-item v-model="form.user"/>

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
import { mapGetters } from 'vuex'
import { loadForm, saveForm } from '~/pages/data/utils'

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
        title: '',
        summary: '',
        supportingLinks: [''],
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
    const form = loadForm('communitySpotlightForm')
    if (form) {
      this.form = {
        ...this.form,
        ...form
      }
    }
  },

  computed: {
    supportingLinksText: function() {
      let message = ''
      this.form.supportingLinks.forEach(link => {
        if (!isEmpty(link))
          message += `${link}<br>`
      })
      return isEmpty(message) ? 'N/A<br>' : message
    },
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail'])
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
        <b>First Name:</b><br>${this.form.user.firstName}<br><br>
        <b>Last Name:</b><br>${this.form.user.lastName}<br><br>
        <b>E-mail:</b><br>${this.form.user.email}<br><br>
        <b>Story Details:</b><br><br>
        <b>Title:</b><br>${this.form.title}<br><br>
        <b>Summary:</b><br>${this.form.summary}<br><br>
        ${fileName != '' ? `<b>File Attachment:</b><br>${fileName}<br><br>` : ''}
        <b>Supporting Information links:</b><br>${this.supportingLinksText}<br>
      `

      let formData = new FormData()
      formData.append("type", "communitySpotlight")
      formData.append("sendCopy", this.form.user.sendCopy)
      formData.append("title", `SPARC Story Submission: ${this.form.title}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.user.email)
      if (propOr('', 'name', this.file) != '') {
        formData.append("attachment", this.file, this.file.name)
      }  

      // Save form to sessionStorage
      saveForm(this.form, 'communitySpotlightForm')

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
