<template>
  <el-form
    ref="contactForm"
    label-position="top"
    :model="generalForm"
    :rules="generalFormRules"
  >
    <el-form-item
      prop="sparcInvestigator"
      label="Are you a SPARC investigator?*"
    >
      <el-select
        v-model="generalForm.sparcInvestigator"
        aria-placeholder="Select one"
      >
        <el-option label="Yes" value="Yes" />
        <el-option label="No" value="No" />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="pageOrResource"
      label="Is this about a specific page or resource?"
    >
      <el-select
        v-model="generalForm.pageOrResource"
        aria-placeholder="Select one"
      >
        <el-option label="Yes" value="Yes" />
        <el-option label="No" value="No" />
      </el-select>
    </el-form-item>

    <el-form-item prop="message" label="Your question or comment:*">
      <el-input
        v-model="generalForm.message"
        type="textarea"
        :rows="3"
        placeholder="Description here"
      />
    </el-form-item>

    <el-form-item prop="shouldSendCopy">
      <el-checkbox v-model="generalForm.shouldSendCopy">
        Please send me a copy of this message
      </el-checkbox>
    </el-form-item>

    <el-form-item prop="firstName" label="First Name">
      <el-input v-model="generalForm.firstName" placeholder="First name here" />
    </el-form-item>

    <el-form-item prop="lastName" label="Last Name">
      <el-input v-model="generalForm.lastName" placeholder="Last name here" />
    </el-form-item>

    <el-form-item prop="email" label="Email">
      <el-input
        v-model="generalForm.email"
        placeholder="Email here"
        type="email"
      />
    </el-form-item>

    <el-form-item prop="shouldSubscribe">
      <el-checkbox v-model="generalForm.shouldSubscribe">
        Subscribe to the SPARC Newsletter
      </el-checkbox>
    </el-form-item>

    <el-form-item>
      <el-button class="primary" @click="onSubmit">
        Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'GeneralForm',

  data() {
    return {
      generalForm: {
        sparcInvestigator: '',
        pageOrResource: '',
        message: '',
        shouldSendCopy: false,
        firstName: '',
        lastName: '',
        email: '',
        shouldSubscribe: false
      },
      generalFormRules: {
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
            trigger: 'change'
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
      console.log('sent!')
    }
  }
}
</script>

<style lang="scss" scoped></style>
