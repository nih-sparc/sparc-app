<template>
  <div class="submit-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Submit" />
    <page-hero>
      <h1>Submit your Tool or Resource</h1>
      <p>Thank you for responding to this SPARC survey! Our goal is to collect useful Tools and Resources to share with the Community to enable researchers to access and enhance the current datasets and knowledge they can gain from the SPARC Portal for their own research.</p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <template v-if="!isFormSubmitted">
          <tools-and-resources-form
            @submit="onFormSubmit($event)"
          />
        </template>

        <div v-if="isFormSubmitted" class="msg-success">
          <template v-if="name">
            <p>{{ name }},</p>
          </template>
          <p>
            Thank you for your response! A member of the SPARC team will contact
            you within two business days.
          </p>
          <a href="#" @click="resetForms">Submit another tool and resource</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import ToolsAndResourcesForm from '@/components/ToolsAndResourcesForm/ToolsAndResourcesForm.vue'

export default {
  name: 'SubmitToolsAndResourcesPage',

  components: {
    Breadcrumb,
    PageHero,
    ToolsAndResourcesForm,
  },

  data: () => {
    return {
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        },
        {
          label: 'Tools & Resources',
          to: {
            name: 'resources'
          }
        },
      ],
      isFormSubmitted: false,
      name: ''
    }
  },

  methods: {
    /**
     * Reset all form data
     */
    resetForms: function() {
      this.isFormSubmitted = false
      this.name = ''
    },
    onFormSubmit: function(name) {
      this.name = name
      this.isFormSubmitted = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.submit-page {
  background-color: $background;
  padding-bottom: 2rem;
}
h2 {
  font-size: 1.5rem;
  line-height: 2rem;
}
.msg-success {
  font-size: 1.5rem;
  line-height: 2rem;
}
.subpage {
  margin-bottom: 0;
}
::v-deep .el-form-item:not(.mb-0) {
  margin-bottom: 1rem;
}
::v-deep .el-form-item__label {
  color: #000;
  font-size: 1.625rem;
  line-height: 1.2;
  margin-bottom: .5rem;
  padding-bottom: 0;
}
::v-deep .el-select {
  max-width: 32rem;
  width: 100%;
}
::v-deep .el-input, ::v-deep .el-textarea, ::v-deep .el-select-dropdown__item {
  ::placeholder {
    color: $lightGrey;
  }
}
::v-deep .el-input__inner, ::v-deep .el-textarea__inner {
  border-color: $lightGrey;
  border-radius: 4px;
  padding-right: 1rem;
}
::v-deep .el-textarea__inner {
  font-family: inherit;
  padding-top: .75rem;
}
::v-deep .input-reason {
  max-width: 36rem;
  width: 100%;
  ::placeholder {
    color: $grey;
  }
}
::v-deep .el-upload__tip{
  margin-top: 0;
}
::v-deep .el-upload-list {
  width: fit-content;
}
</style>
