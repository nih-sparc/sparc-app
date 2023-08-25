<template>
  <large-modal
    v-if="modalVisible"
    :visible="modalVisible"
    @close-download-dialog="modalVisible = false"
  >
    <div slot="mainContent">
      <h2>Dataset Submission Request</h2>
      <p class="body1">This form allows you to submit a dataset submission request to outline your intention of submitting a dataset, computational, or anatomical model to the SPARC Portal.</p>
      <el-form
        ref="submitForm"
        label-position="top"
        :model="form"
        :rules="formRules"
        :hide-required-asterisk="true"
      >
        <el-form-item
          prop="shortDescription"
          label="Provide a short description of your data *"
        >
          <el-input
            v-model="form.shortDescription"
            placeholder="(Example: I am studying the effects of <approach> on <anatomical structure>)"
          />
        </el-form-item>

        <el-form-item prop="detailedDescription" label="Provide a detailed description of your data *">
          <el-input
            v-model="form.detailedDescription"
            type="textarea"
            :rows="3"
            placeholder="Please provide specifics about your data. Our curation team will then contact you."
          />
        </el-form-item>
        <template v-for="question in questions">
          <el-form-item
            :key="question.id"
            :label="question.question + ' *'"
            :prop="question.id.toString()"
          >
            <el-input
              v-model="form[question.id.toString()]"
              type="textarea"
              :rows="1"
              placeholder="Please provide an answer."
            />
          </el-form-item>
        </template>

        <el-button class="secondary" :disabled="isSubmitting" @click="onSubmit">
          Send Submission Request
        </el-button>
        <p v-if="hasError" class="error">
          An error has occurred, please try again.
        </p>
      </el-form>
    </div>
  </large-modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DatasetSubmissionModal',

  data: function() {
    return {
      modalVisible: false,
      questions: [],
      form: {
        detailedDescription: '',
        shortDescription: '',
      },
      isSubmitting: false,
    }
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showModal: {
      handler: function(show) {
        if (show) {
          this.modalVisible = true
        }
      }
    },
    modalVisible: {
      handler: function(show) {
        if (!show) {
          this.$emit('modal-closed')
        }
      }
    },
    userToken: {
      handler: function(token) {
        if (token) {
          this.fetchQuestions()
        }
      },
      immediate: true
    },
  },
  mounted() {
    // Reset form fields when showing the form
    this.hasError = false
  },
  computed: {
    ...mapGetters('user', ['cognitoUserToken']),
    ...mapState('pages/contact-us', {
      userTypes: state => state.formOptions.userTypes,
    }),
    userToken() {
      return this.cognitoUserToken || this.$cookies.get('user-token')
    },
    formRules() {
      let formRules = {}
      const formRuleValue = [{
        required: true,
        message: 'Please enter a response',
        trigger: 'blur'
      }]
      for (const formKey in this.form) {
        formRules[formKey] = formRuleValue
      }
      return formRules
    },
  },
  methods: {
    async onSubmit() {
      this.hasError = false
      await this.$refs.submitForm.validate(async valid => {
        if (!valid) {
          return
        }
        if (!this.hasError) {
          await this.sendForm()
          this.resetForm()
        }
      })
    },
    fetchQuestions() {
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      const url = `${process.env.PENNSIEVE_API_VERSION_2}/publishing/questions`
      this.$axios
        .get(url, { headers })
        .then(({ data }) => {
          data.forEach(question => {
            question['answer'] =  ""
          })
          this.questions = data
          let form = {
            detailedDescription: '',
            shortDescription: '',
          }
          this.questions.forEach(question => {
            const key = question.id
            const formValue = question.answer
            form[key] = formValue
          })
          this.form = form
        })
        .catch(() => {
          this.hasError = true
        })
    },
    async sendForm() {
      this.isSubmitting = true
      this.modalVisible = false
      const survey = this.questions.map(question => {
        const questionId = parseInt(question.id)
        const answer = this.form[questionId]
        return {
          "questionId": questionId,
          "response": answer
        }
      })
      const headers = { 'Authorization': `Bearer ${this.userToken}` }
      const url = `${process.env.PENNSIEVE_API_VERSION_2}/publishing/repositories`
      let orgNodeId = ''
      await this.$axios
        .get(url, { headers })
        .then(({ data }) => {
          orgNodeId = data.find(repo => repo.name === 'sparc')?.organizationNodeId
        }).catch(() => {
          this.hasError = true
        }).finally(() => {
          const formData = {
            "name": this.form.shortDescription,
            "description": this.form.detailedDescription,
            "organizationNodeId": orgNodeId,
            "survey": survey,
            "contributors": []
          }
          this.$axios
            .post(`${process.env.PENNSIEVE_API_VERSION_2}/publishing/proposal`, formData, { headers })
            .then(({ data }) => {
              this.$emit('proposal-submitted', data.nodeId)
              /*this.$axios
                .post(`${process.env.PENNSIEVE_API_VERSION_2}/publishing/proposal/submit?node_id=${nodeId}`, { headers })
                .catch(() => {
                  this.hasError = true
                }).finally(() => {
                  
                })*/
            })
            .catch(() => {
              this.hasError = true
            })
            .finally(() => {
              this.isSubmitting = false
            })
        })
    },
    resetForm() {
      this.form = {
        detailedDescription: '',
        shortDescription: '',
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
::v-deep .el-form-item__label {
  color: $grey;
  font-size: 1.5rem;
  line-height: 2.25rem;
  font-weight: 500;
  margin-bottom: .5rem;
  padding-bottom: 0;
}
::v-deep .el-select {
  max-width: 20rem;
  width: 100%;
}
::v-deep .el-input,
.el-textarea,
::v-deep .el-select-dropdown__item {
  ::placeholder {
    color: $lightGrey;
  }
}
::v-deep .el-textarea__inner {
  border-color: $lightGrey;
  border-radius: 4px;
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-family: inherit;
}
::v-deep .el-textarea {
  ::placeholder {
    color: $lightGrey;
  }
}
</style>
