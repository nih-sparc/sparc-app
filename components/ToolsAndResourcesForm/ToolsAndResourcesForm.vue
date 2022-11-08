<template>
  <el-form
    ref="submitForm"
    label-position="top"
    :model="form"
    :rules="formRules"
    :hide-required-asterisk="true"
  >
    <el-form-item
      prop="sparcFunded"
      label="Are you involved in SPARC-funded research? *"
    >
      <el-select
        v-model="form.sparcFunded"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="sparcFundedOption in questionOptions.sparcFunded"
          :key="sparcFundedOption"
          :label="sparcFundedOption"
          :value="sparcFundedOption"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      class="mt-32"
      prop="levelOfInvolvement"
      label="What is your highest level of involvement in research projects? *"
    >
      <el-select
        v-model="form.levelOfInvolvement"
        placeholder="Select one"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="levelOfInvolvementOption in questionOptions.levelOfInvolvement"
          :key="levelOfInvolvementOption"
          :label="levelOfInvolvementOption"
          :value="levelOfInvolvementOption"
        />
      </el-select>
    </el-form-item>

    <el-form-item class="mt-32" prop="resourceName" label="What is the name of the tool/resource? *">
      <el-input v-model="form.resourceName" placeholder="Enter tool/resource name" />
    </el-form-item>

    <el-form-item class="mt-32" prop="resourceLink" label="What is the webpage link for this tool/resource? *">
      <el-input placeholder="Enter URL" v-model="form.resourceLink">
        <template slot="prepend">Http://</template>
      </el-input>
    </el-form-item>

    <el-form-item
      class="mt-32"
      prop="resourceCategories"
      label="Which category, or categories, would you place this tool/resource? Select all that apply. *"
    >  
      <client-only>
        <sparc-checkbox
          v-for="item in questionOptions.resourceCategories"
          v-bind:key="item.label"
          v-model="form.resourceCategories"
          :label="item.label"
          :display="item.display"
        />
      </client-only> 
    </el-form-item>

    <el-form-item prop="otherCategoryDescription" label="If you answered 'Other', please describe the category for this tool/resource.">
      <el-input :disabled="!isOtherSelected" v-model="form.otherCategoryDescription" placeholder="Category description" />
    </el-form-item>

    <el-form-item
      class="mt-32"
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
      class="mt-32"
      prop="howBroadlyUsed"
      label="How broadly is it used in biomedical science? (Uncommon 1 2 3 4 5 Common) *"
    >
      <client-only>
        <sparc-radio
          v-model="form.howBroadlyUsed"
          label="1"
          display="1"
        />
        <sparc-radio
          v-model="form.howBroadlyUsed"
          label="2"
          display="2"
        />
        <sparc-radio
          v-model="form.howBroadlyUsed"
          label="3"
          display="3"
        />
        <sparc-radio
          v-model="form.howBroadlyUsed"
          label="4"
          display="4"
        />
        <sparc-radio
          v-model="form.howBroadlyUsed"
          label="5"
          display="5"
        />
      </client-only>
    </el-form-item>

    <el-form-item
      class="mt-32"
      prop="hasSpecificApplications"
      label="Does it have specific applications to the autonomic nervous system and the neural control of organs? *"
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

    <el-form-item class="mt-32" prop="experienceDescription" label="Briefly describe your experience using this tool. *">
      <el-input
        v-model="form.experienceDescription"
        type="textarea"
        :rows="3"
        placeholder="Tell us some details about your use of this tool/resource"
      />
    </el-form-item>

    <el-form-item
      class="mt-32"
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

    <el-form-item class="mt-32" prop="primaryGoal" label="If yes, what was your primary goal in creating this tool/resource?">
      <el-input
        v-model="form.primaryGoal"
        type="textarea"
        :rows="3"
        :disabled="form.isCreator != 'Yes'"
        placeholder="Tell us your goal in creating this tool/resource"
      />
    </el-form-item>

    <el-form-item
      class="mt-32"
      prop="hasBeenUsed"
      label="To date, has this tool been used in an NIH SPARC-funded project? *"
    >
      <client-only>
        <sparc-radio
          v-model="form.hasBeenUsed"
          label="Yes"
          display="Yes"
        />
        <sparc-radio
          v-model="form.hasBeenUsed"
          label="No"
          display="No"
        />
        <sparc-radio
          v-model="form.hasBeenUsed"
          label="Not sure"
          display="Not sure"
        />
      </client-only>
    </el-form-item>

    <el-form-item class="mt-32" prop="howUsed" label="If yes, how has it been used in NIH SPARC-funded research?">
      <el-input
        v-model="form.howUsed"
        type="textarea"
        :rows="3"
        :disabled="form.hasBeenUsed != 'Yes'"
        placeholder="Tell us how it has been used"
      />
    </el-form-item>

    <el-form-item
      class="mt-32"
      prop="isWilling"
      label="Are you willing to participate in other user research to support the development of the SPARC Portal? *"
    >
      <client-only>
        <sparc-radio
          v-model="form.isWilling"
          label="Yes"
          display="Yes"
        />
        <sparc-radio
          v-model="form.isWilling"
          label="No"
          display="No"
        />
      </client-only>
    </el-form-item>

    <hr/>

    <div class="heading1">
      Contact Information
    </div>

    <el-form-item class="mt-16" prop="name" label="Name *">
      <el-input v-model="form.name" placeholder="Enter your name" />
    </el-form-item>

    <el-form-item class="mt-32" prop="email" label="Email *">
      <el-input v-model="form.email" placeholder="Enter your email address" type="email" />
    </el-form-item>

    <div class="body4 mb-16"><i>Your submission will be reviewed and the reviewer may contact you to clarify or seek additional information.</i></div>

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
import { sparcFunded, levelOfInvolvement, resourceCategories } from './questions.js'

export default {
  name: 'ToolsAndResourcesForm',

  data() {
    return {
      hasError: false,
      form: {
        sparcFunded: '',
        levelOfInvolvement: '',
        resourceName: '',
        resourceLink: '',
        resourceCategories: [],
        otherCategoryDescription: '',
        isFree: '',
        howBroadlyUsed: '',
        hasSpecificApplications: '',
        experienceDescription: '',
        isCreator: '',
        primaryGoal: '',
        hasBeenUsed: '',
        howUsed: '',
        isWilling: '',
        name: '',
        email: '',
      },
      isSubmitting: false,
      questionOptions: {
        sparcFunded,
        levelOfInvolvement,
        resourceCategories
      },
      formRules: {
        sparcFunded: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'change'
          }
        ],
        levelOfInvolvement: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'change'
          }
        ],
        resourceName: [
          {
            required: true,
            message: 'Please enter the name of the tool/resource',
            trigger: 'blur',
          }
        ],
        resourceLink: [
          {
            required: true,
            message: 'Please enter the link url',
            trigger: 'blur',
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
        howBroadlyUsed: [
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
        experienceDescription: [
          {
            required: true,
            message: 'Please enter a description',
            trigger: 'change'
          }
        ],
        isCreator: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'blur',
          }
        ],
        primaryGoal: [
          {
            message: 'Please enter your goal',
            trigger: 'change',
            validator: this.validatePrimaryGoal
          }
        ],
        hasBeenUsed: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'blur',
          }
        ],
        howUsed: [
          {
            message: 'Please enter how it was used',
            trigger: 'change',
            validator: this.validateHowUsed
          }
        ],
        isWilling: [
          {
            required: true,
            message: 'Please select one',
            trigger: 'blur',
          }
        ],
        name: [
          {
            required: true,
            message: 'Please enter your name',
            trigger: 'blur',
          }
        ],
        email: [
          {
            required: true,
            message: 'Please enter your email',
            type: 'email',
            trigger: 'blur'
          }
        ],
      }
    }
  },

  computed: {
    isOtherSelected: function() {
      return this.form?.resourceCategories.some(resource => {
        return resource == 'Other'
      })
    }
  },

  mounted() {
    // Reset form fields when showing the form
    this.$refs.submitForm.resetFields()
    this.hasError = false
  },

  methods: {
    /**
     * Submit the form and validate
     */
    onSubmit() {
      this.hasError = false

      this.$refs.submitForm.validate(valid => {
        if (!valid) {
          return
        }
        this.sendForm()
      })
    },

    validateHowUsed: function(rule, value, callback) {
      if (this.form.hasBeenUsed == 'Yes' && value === '') {
        callback(new Error(rule.message))
      }
      callback()
    },

    validateCategoryDescription: function(rule, value, callback) {
      if (this.isOtherSelected && value === '') {
        callback(new Error(rule.message))
      }
      callback()
    },

    validatePrimaryGoal: function(rule, value, callback) {
      if (this.form.isCreator == 'Yes' && value === '') {
        callback(new Error(rule.message))
      }
      callback()
    },
    /**
     * Send form to endpoint
     */
     sendForm() {
      this.isSubmitting = true

      const description = `
        <b>Are you involved in SPARC-funded research?</b>
        <br>
        ${this.form.sparcFunded}
        <br>
        <br>
        <b>What is your highest level of involvement in research projects?</b>
        <br>
        ${this.form.levelOfInvolvement}
        <br>
        <br>
        <b>What is the name of the tool/resource?</b>
        <br>
        ${this.form.resourceName}
        <br>
        <br>
        <b>What is the webpage link for this tool/resource?</b>
        <br>
        ${this.form.resourceLink}
        <br>
        <br>
        <b>Which category, or categories, would you place this tool/resource?</b>
        <br>
        ${this.form.resourceCategories}
        <br>
        <br>
        <b>If you answered 'Other', please describe the category for this tool/resource:</b>
        <br>
        ${this.isOtherSelected ? this.form.otherCategoryDescription : 'N/A'}
        <br>
        <br>
        <b>Is it free and/or open-source?</b>
        <br>
        ${this.form.isFree}
        <br>
        <br>
        <b>How broadly is it used in biomedical science?</b>
        <br>
        ${this.form.howBroadlyUsed}
        <br>
        <br>
        <b>Does it have specific applications to the autonomic nervous system and the neural control of organs?</b>
        <br>
        ${this.form.hasSpecificApplications}
        <br>
        <br>
        <b>Briefly describe your experience using this tool:</b>
        <br>
        ${this.form.experienceDescription}
        <br>
        <br>
        <b>Are you the tool/resource creator?</b>
        <br>
        ${this.form.isCreator}
        <br>
        <br>
        <b>If yes, what was your primary goal in creating this tool/resource?</b>
        <br>
        ${this.form.isCreator == 'Yes' ? this.form.primaryGoal : 'N/A'}
        <br>
        <br>
        <b>To date, has this tool been used in an NIH SPARC-funded project?</b>
        <br>
        ${this.form.hasBeenUsed}
        <br>
        <br>
        <b>If yes, how has it been used in NIH SPARC-funded research?</b>
        <br>
        ${this.form.hasBeenUsed == 'Yes' ? this.form.howUsed : 'N/A'}
        <br>
        <br>
        <b>Are you willing to participate in other user research to support the development of the SPARC Portal?</b>
        <br>
        ${this.form.isWilling}
        <br>
        <br>
        <b>Contact Information</b>
        <br>
        <br>
        <b>Name:</b>
        <br>
        ${this.form.name}
        <br>
        <br>
        <b>Email:</b>
        <br>
        ${this.form.email}
        <br>
        <br>
      `
      let formData = new FormData();
      formData.append("title", `Tool or resource creation request - ${this.form.resourceName}`)
      formData.append("description", description)

      this.$axios
        .post(`${process.env.portal_api}/tasks`, formData)
        .then(() => {
          this.$emit('submit', this.form.name)
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
  text-align: right;
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
</style>
