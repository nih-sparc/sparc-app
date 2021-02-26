<template>
  <div class="contact-us-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="pageTitle" />
    <page-hero v-if="heroCopy">
      <h1>{{ pageTitle }}</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(heroCopy)" />
    </page-hero>
    <div class="page-wrap container">
      <div class="subpage">
        <h2>Let us know why you’re contacting us:</h2>
        <el-select
          v-model="formType"
          class="input-reason"
          placeholder="Select a reason"
        >
          <el-option
            v-for="option in formTypeOptions"
            :key="option.key"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <general-form v-if="formType === 'general'" />
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
  name: 'ContactUsPage',

  components: {
    Breadcrumb,
    PageHero,
    GeneralForm
  },

  mixins: [MarkedMixin],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_contact_us_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
      })
      .catch(console.error)
  },

  data: () => {
    return {
      heroCopy: '',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      formType: '',
      formTypeOptions: [
        {
          label: 'I couldn’t find the information in Help',
          value: 'general'
        },
        {
          label: 'I want to report an error or a technical issue',
          value: 'bug'
        }
      ]
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
.input-reason {
  max-width: 36rem;
  width: 100%;
  ::placeholder {
    color: $dark-sky;
  }
}
</style>
