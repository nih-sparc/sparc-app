<template>
  <div class="contact-us-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Submit" />
    <page-hero>
      <h1>Share your Community Spotlight story</h1>
      <p>Submit your story on how you have used the SPARC Program to advance neuromodulation of the ANS. We will then be in contact about how we share this to the SPARC community.</p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <template v-if="!isGeneralSubmitted">
          <general-form
            @submit="onGeneralFormSubmit($event)"
          />
        </template>

        <div v-if="isGeneralSubmitted" class="msg-success">
          <template v-if="firstName">
            <p>{{ firstName }},</p>
          </template>
          <p>
            Thank you for your inquiry. A member of the SPARC team will contact
            you within two business days.
          </p>
          <a href="#" @click="resetForms">Submit another inquiry</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import GeneralForm from '@/components/ContactUsForms/GeneralForm/GeneralForm.vue'

import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'SubmitNewsAndEventsPage',

  components: {
    Breadcrumb,
    PageHero,
    GeneralForm,
  },

  mixins: [MarkedMixin],

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
          label: 'News & Events',
          to: {
            name: 'news-and-events'
          }
        },
        {
          label: 'Community Spotlight',
          to: {
            name: 'news-and-events-community-spotlight'
          }
        },
      ],
      isGeneralSubmitted: false,
      firstName: ''
    }
  },

  methods: {
    /**
     * Reset all form data
     */
    resetForms: function() {
      this.isGeneralSubmitted = false
      this.firstName = ''
    },

    /**
     * On general form meetings
     * @param {String} firstName
     */
    onGeneralFormSubmit: function(firstName) {
      this.firstName = firstName
      this.isGeneralSubmitted = true
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';
.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}
h2 {
  font-size: 1.5rem;
  line-height: 2rem;
}
.msg-success {
  font-size: 1.5rem;
  line-height: 2rem;
}
</style>

<style lang="scss">
@import '@/assets/_variables.scss';
.contact-us-page {
  .el-form-item:not(.mb-0) {
    margin-bottom: 3.25rem;
  }
  .el-form-item__label {
    color: #000;
    font-size: 1.625rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    padding-bottom: 0;
  }
  .el-select {
    max-width: 20rem;
    width: 100%;
  }
  .el-input,
  .el-textarea,
  .el-select-dropdown__item {
    ::placeholder {
      color: $medium-gray;
    }
  }
  .el-input__inner,
  .el-textarea__inner {
    border-color: $medium-gray;
    border-radius: 4px;
    padding: 0.5rem 1rem;
  }
  .el-textarea__inner {
    font-family: inherit;
  }
  .input-reason {
    max-width: 36rem;
    width: 100%;
    ::placeholder {
      color: $dark-sky;
    }
  }
}
</style>
