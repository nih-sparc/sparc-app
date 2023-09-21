<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item prop="resourceName" label="What is the name of the tool/resource? *">
      <el-input v-model="form.resourceName" placeholder="Enter tool/resource name" />
    </el-form-item>

    <el-form-item class="mt-32" prop="resourceLinks" label="What is the webpage link for this tool/resource? *">
      <url-list :default-links="form.resourceLinks" @links-updated="form.resourceLinks = $event" @add-link="addResourceLink" placeholder="Enter URL">
        <template slot="prepend">Http://</template>
      </url-list>
    </el-form-item>

    <el-form-item
      class="resource-categories vertical-content mt-32"
      prop="resourceCategories"
      label="Which category, or categories, would you place this tool/resource? *"
    >
      <div class="body4 mb-4"><i>Select all that apply.</i></div>
      <client-only>
        <sparc-checkbox
          v-for="resourceCategory in resourceCategoryOptions"
          v-model="form.resourceCategories"
          :key="resourceCategory"
          :label="resourceCategory"
          :display="resourceCategory"
        />
      </client-only> 
    </el-form-item>

    <el-form-item prop="otherCategoryDescription" label="If you answered 'Other', please describe the category for this tool/resource.">
      <el-input :disabled="!isOtherSelected" v-model="form.otherCategoryDescription" placeholder="Category description" />
    </el-form-item>

    <el-form-item
      class="mt-32 vertical-content"
      prop="isFree"
      label="Is it free and/or open-source? *"
    >
      <client-only>
        <sparc-radio
          v-model="form.isFree"
          label="Yes"
          display="Yes"
        />
        <sparc-radio
          v-model="form.isFree"
          label="No"
          display="No"
        />
      </client-only>
    </el-form-item>

    <el-form-item
      class="mt-32 vertical-content"
      prop="hasSpecificApplications"
      label="Does it have specific applications to the peripheral nervous system or the neural control of organs? *"
    >
      <client-only>
        <sparc-radio
          v-model="form.hasSpecificApplications"
          label="Yes"
          display="Yes"
        />
        <sparc-radio
          v-model="form.hasSpecificApplications"
          label="No"
          display="No"
        />
      </client-only>
    </el-form-item>

    <el-form-item
      class="mt-32 vertical-content"
      prop="isCreator"
      label="Are you the tool/resource creator? *"
    >
      <client-only>
        <sparc-radio
          v-model="form.isCreator"
          label="Yes"
          display="Yes"
        />
        <sparc-radio
          v-model="form.isCreator"
          label="No"
          display="No"
        />
      </client-only>
    </el-form-item>

    <el-form-item class="mt-32" prop="linksToUsages" label="Please provide any links to datasets or publications using this tool/resource">
      <url-list :default-links="form.linksToUsages" @links-updated="form.linksToUsages = $event" @add-link="addUsageLink" placeholder="Enter URL">
        <template slot="prepend">Http://</template>
      </url-list>
    </el-form-item>

    <el-form-item
      class="mt-32 vertical-content"
      prop="tutorialsAvailable"
      label="Do you have any tutorials/user guides available?"
    >
      <client-only>
        <sparc-radio
          v-model="form.tutorialsAvailable"
          label="Yes"
          display="Yes"
        />
        <sparc-radio
          v-model="form.tutorialsAvailable"
          label="No"
          display="No"
        />
      </client-only>
      <url-list class="mt-8" :disabled="!isTutorialAvailable" :default-links="form.linksToTutorials" @links-updated="form.linksToTutorials = $event" @add-link="addTutorialLink" placeholder="Enter URL">
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

    <div class="body4 mb-16"><i>Before your tool or resource is published on the SPARC Portal, it will be reviewed. The reviewer may contact you to clarify or seek additional information.</i></div>

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
import RecaptchaMixin from '@/mixins/recaptcha/index'
import NewsletterMixin from '@/components/ContactUsForms/NewsletterMixin'
import UserContactFormItem from '../UserContactFormItem.vue'
import UrlList from '@/components/Url/UrlList.vue'
import { isEmpty } from 'ramda'
import { mapState, mapGetters } from 'vuex'
import { loadForm, saveForm } from '~/pages/data/utils'

export default {
  name: 'ToolsAndResourcesForm',

  components: {
    UrlList,
    UserContactFormItem
  },

  mixins: [RecaptchaMixin, NewsletterMixin],

  data() {
    return {
      form: {
        resourceName: '',
        resourceLinks: [''],
        resourceCategories: [],
        otherCategoryDescription: '',
        isFree: '',
        hasSpecificApplications: '',
        isCreator: '',
        linksToUsages: [''],
        tutorialsAvailable: '',
        linksToTutorials: [''],
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
        resourceName: [
          {
            required: true,
            message: 'Please enter the name of the tool/resource',
            trigger: 'blur',
          }
        ],
        resourceLinks: [
          {
            message: 'Please enter at least one link url',
            trigger: 'blur',
            validator: this.validateResourceLinks
          }
        ],
        resourceCategories: [
          {
            required: true,
            message: 'Please select at least one',
            trigger: 'change'
          }
        ],
        otherCategoryDescription: [
          {
            message: 'Please enter a description',
            trigger: 'change',
            validator: this.validateCategoryDescription
          }
        ],
        isFree: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'blur',
          }
        ],
        hasSpecificApplications: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'blur',
          }
        ],
        isCreator: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'blur',
          }
        ]
      }
    }
  },

  computed: {
    ...mapState('pages/contact-us', {
      resourceCategoryOptions: state => state.formOptions.resourceCategories
    }),
    isOtherSelected: function() {
      return this.form.resourceCategories.includes('Other')
    },
    isTutorialAvailable: function() {
      return this.form?.tutorialsAvailable === 'Yes'
    },
    resourceLinksText: function() {
      let message = ''
      this.form.resourceLinks.forEach(link => {
        if (!isEmpty(link))
          message += `${link}<br>`
      })
      return message
    },
    linksToUsagesText: function() {
      let message = ''
      this.form.linksToUsages.forEach(link => {
        if (!isEmpty(link))
          message += `${link}<br>`
      })
      return isEmpty(message) ? 'N/A<br>' : message
    },
    linksToTutorialsText: function() {
      let message = ''
      if (this.isTutorialAvailable) {
        this.form.linksToTutorials.forEach(link => {
          if (!isEmpty(link))
            message += `${link}<br>`
        })
      }
      return isEmpty(message) ? 'N/A<br>' : message
    },
    ...mapGetters('user', ['firstName', 'lastName', 'profileEmail'])
  },

  mounted() {
    // Reset form fields when showing the form
    this.hasError = false
    this.$refs.submitForm.resetFields()
    const form = loadForm('toolsAndResourcesForm')
    if (form) {
      this.form = form
    }
  },

  methods: {
    validateCategoryDescription: function(rule, value, callback) {
      if (this.isOtherSelected && value === '') {
        callback(new Error(rule.message))
      }
      callback()
    },
    validateResourceLinks: function(rule, value, callback) {
      const hasResourceLink = value.some(link => {
        return !isEmpty(link)
      })
      if (!hasResourceLink) {
        callback(new Error(rule.message))
      }
      callback()
    },
    addResourceLink() {
      this.form.resourceLinks.push('')
    },
    addUsageLink() {
      this.form.linksToUsages.push('')
    },
    addTutorialLink() {
      this.form.linksToTutorials.push('')
    },
    /**
     * Send form to endpoint
     */
    async sendForm() {
      this.isSubmitting = true

      const description = `
        <b>What is the name of the tool/resource?</b><br>${this.form.resourceName}<br><br>
        <b>What is the webpage link for this tool/resource?</b><br>${this.resourceLinksText}<br>
        <b>Which category, or categories, would you place this tool/resource?</b><br>${this.form.resourceCategories}<br><br>
        <b>If you answered 'Other', please describe the category for this tool/resource:</b><br>${this.isOtherSelected ? this.form.otherCategoryDescription : 'N/A'}<br><br>
        <b>Is it free and/or open-source?</b><br>${this.form.isFree}<br><br>
        <b>Does it have specific applications to the autonomic nervous system and the neural control of organs?</b><br>${this.form.hasSpecificApplications}<br><br>
        <b>Are you the tool/resource creator?</b><br>${this.form.isCreator}<br><br>
        <b>Please provide any links to datasets or publications using this tool/resource</b><br>${this.linksToUsagesText}<br>
        <b>Do you have any tutorials/user guides available?</b><br>${this.form.tutorialsAvailable}<br><br>
        <b>Links to tutorials/user guides:</b><br>${this.linksToTutorialsText}<br>
        <b>What type of user are you?</b><br>${this.form.user.typeOfUser}<br><br>
        <b>First Name:</b><br>${this.form.user.firstName}<br><br>
        <b>Last Name:</b><br>${this.form.user.lastName}<br><br>
        <b>Email:</b><br>${this.form.user.email}
      `
      let formData = new FormData();
      formData.append("type", "toolsAndResources")
      formData.append("sendCopy", this.form.user.sendCopy)
      formData.append("title", `T&R Submission: ${this.form.resourceName}`)
      formData.append("description", description)
      formData.append("userEmail", this.form.user.email)

      // Save form to sessionStorage
      saveForm(this.form, 'toolsAndResourcesForm')

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
::v-deep .vertical-content {
  .el-form-item__content {
    display: flex;
    flex-direction: column;
    .el-radio {
      line-height: 25px;
      padding-left: 2rem;
    }
  }
}
::v-deep .resource-categories {
  .el-form-item__content {
    .el-checkbox {
      padding-left: 2rem;
      margin: 0;
      line-height: 25px;
    }
  }
  .el-form-item__label {
    margin-bottom: .3rem;
  }
}
</style>
