<template>
  <div class="submit-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Submit" />
    <page-hero>
      <h1>Share your Community Spotlight story</h1>
      <p>Submit your story on how you have used the SPARC Program to advance neuromodulation of the ANS. We will then be in contact about how we share this to the SPARC community.</p>
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <template v-if="!isCommunitySpotlightFormSubmitted">
          <community-spotlight-form
            @submit="onCommunitySpotlightFormSubmit($event)"
          />
        </template>

        <div v-if="isCommunitySpotlightFormSubmitted" class="msg-success">
          <template v-if="name">
            <p>{{ name }},</p>
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
import CommunitySpotlightForm from '@/components/CommunitySpotlightForm/CommunitySpotlightForm.vue'

export default {
  name: 'SubmitCommunitySpotlightPage',

  components: {
    Breadcrumb,
    PageHero,
    CommunitySpotlightForm,
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
      isCommunitySpotlightFormSubmitted: false,
      name: ''
    }
  },

  methods: {
    /**
     * Reset all form data
     */
    resetForms: function() {
      this.isCommunitySpotlightFormSubmitted = false
      this.name = ''
    },
    onCommunitySpotlightFormSubmit: function(name) {
      this.name = name
      this.isCommunitySpotlightFormSubmitted = true
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
  max-width: 20rem;
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
</style>
