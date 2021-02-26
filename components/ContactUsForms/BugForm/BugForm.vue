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
      prop="title"
      label="Provide a short description of what you were doing.*"
    >
      <el-input
        v-model="form.title"
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
      <el-button class="primary" :disabled="isSubmitting" @click="onSubmit">
        Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BugForm',

  data() {
    return {
      form: {
        sparcInvestigator: '',
        pageOrResource: '',
        title: '',
        description: '',
        howToImprove: '',
        shouldSendCopy: false,
        shouldFollowUp: false
      },
      isSubmitting: false,
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
      this.isSubmitting = true

      this.$axios
        .post(`${process.env.portal_api}/tasks`, {
          title: this.form.title,
          description: `
            Are you a SPARC investigator?<br>${this.form.sparcInvestigator}
            <br><br>Is this about a specific page or resource?
            <br>${this.form.pageOrResource}
            <br><br>Description
            <br>${this.form.description}
            <br><br>How would you like this experience to improve?
            <br>${this.form.howToImprove}
            <br><br>Let me know when you resolve this issue
            <br>${this.form.shouldFollowUp ? 'Yes' : 'No'}
          `
        })
        .then(() => {
          this.$emit('submit')
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

<style lang="scss" scoped></style>
