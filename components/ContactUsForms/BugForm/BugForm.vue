<template>
  <el-form
    ref="contactForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="sparcInvestigator"
      label="Are you a SPARC investigator?*"
    >
      <el-select v-model="form.sparcInvestigator" aria-placeholder="Select one">
        <el-option label="Yes" value="Yes" />
        <el-option label="No" value="No" />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="pageOrResource"
      label="Is this about a specific page or resource?"
    >
      <el-select v-model="form.pageOrResource" aria-placeholder="Select one">
        <el-option label="Yes" value="Yes" />
        <el-option label="No" value="No" />
      </el-select>
    </el-form-item>

    <el-form-item
      prop="reproduceExample"
      label="Provide a short description of what you were doing.*"
    >
      <el-input
        v-model="form.reproduceExample"
        placeholder="(Example: When I click <this button>, <this happens>.)"
      />
    </el-form-item>

    <el-form-item prop="description" label="Provide a detailed description*">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="Please provide specific steps so our team can reproduce your experience in order to resolve the issue."
      />
    </el-form-item>

    <el-form-item
      prop="howToImprove"
      label="How would you like this experience to improve?*"
    >
      <el-input
        v-model="form.howToImprove"
        type="textarea"
        :rows="3"
        placeholder="Description here"
      />
    </el-form-item>

    <el-form-item prop="shouldFollowUp" class="mb-0">
      <el-checkbox v-model="form.shouldFollowUp">
        Let me know when you resolve this issue
      </el-checkbox>
    </el-form-item>

    <el-form-item prop="shouldSendCopy">
      <el-checkbox v-model="form.shouldSendCopy">
        Please send me a copy of this message
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
  name: 'Form',

  data() {
    return {
      form: {
        sparcInvestigator: '',
        pageOrResource: '',
        reproduceExample: '',
        description: '',
        howToImprove: '',
        shouldSendCopy: false,
        shouldFollowUp: false
      },
      formRules: {
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

        reproduceExample: [
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
