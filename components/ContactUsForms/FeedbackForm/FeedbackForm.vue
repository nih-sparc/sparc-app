<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="pageOrResource"
      label="What area of the SPARC Portal is this related to?"
    >
      <el-select
        v-model="form.pageOrResource"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="area in areasOfSparc"
          :key="area"
          :label="area"
          :value="area"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="shortDescription"
      label="Provide a short description of your feedback *"
    >
      <el-input
        v-model="form.shortDescription"
        placeholder="(Example: I think it would be great to <your idea>)"
      />
    </el-form-item>

    <el-form-item prop="detailedDescription" label="Provide a detailed description *">
      <el-input
        v-model="form.detailedDescription"
        type="textarea"
        :rows="3"
        placeholder="Provide a detailed description of your feedback"
      />
    </el-form-item>

    <hr/>

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
          v-for="userType in userTypes"
          :key="userType"
          :label="userType"
          :value="userType"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="firstName" label="First Name *" class="mt-16">
      <el-input v-model="form.firstName" placeholder="Enter your first name" />
    </el-form-item>

    <el-form-item prop="lastName" label="Last Name *">
      <el-input v-model="form.lastName" placeholder="Enter your last name" />
    </el-form-item>

    <el-form-item prop="email" label="Email *" class="mb-0">
      <el-input v-model="form.email" placeholder="Enter your email address" type="email" />
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

    <hr/>

    <div class="heading2">
      Please check the box to proceed
    </div>
    <recaptcha class="recaptcha my-16 pl-16"/>

    <hr/>

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
import NewsletterMixin from '../NewsletterMixin'
import RecaptchaMixin from '@/mixins/recaptcha/index'
import { mapState } from 'vuex'

export default {
  name: 'FeedbackForm',

  mixins: [NewsletterMixin, RecaptchaMixin],

  data() {
    return {
      form: {
        pageOrResource: '',
        typeOfUser: '',
        detailedDescription: '',
        shortDescription: '',
        shouldFollowUp: false,
        firstName: '',
        lastName: '',
        email: '',
        shouldSubscribe: false,
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
        ],

        shortDescription: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],

        detailedDescription: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],
      }
    }
  },

  computed: {
    ...mapState('pages/contact-us', {
      userTypes: state => state.formOptions.userTypes,
      areasOfSparc: state => state.formOptions.areasOfSparc
    }),
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
      const description = `
        <b>What area of the SPARC Portal is this related to?</b><br>${this.form.pageOrResource}<br><br>
        <b>Detailed description:</b><br>${this.form.detailedDescription}<br><br>
        <b>What type of user are you?</b><br>${this.form.typeOfUser}<br><br>
        <b>Let me know when you resolve this issue:</b><br>${this.form.shouldFollowUp ? 'Yes' : 'No'}<br><br>
        <b>Email:</b><br>${this.form.email}
      `
      let formData = new FormData();
      formData.append("type", "feedback")
      formData.append("title", this.form.shortDescription)
      formData.append("description", description)
      formData.append("userEmail", this.form.email)

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
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

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
</style>
