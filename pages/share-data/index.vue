<template>
  <div class="page-data pb-16">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ title }}</h1>
      <p>{{ summary }}</p>
    </page-hero>
    <div class="container">
      <div class="subpage px-32 py-16">
        <div v-html="parseMarkdown(description)" />
        <hr />
        <div v-for="callToAction in callsToAction" :key="callToAction.sys.id" class="mb-16">
          <call-to-action :data="callToAction.fields" @click="showLoginDialog = true"/>
        </div>
      </div>
      <div v-if="learnMore" class="subpage px-32 mb-0">
        <div class="heading1 mb-16">Learn More</div>
        <div v-for="(item, i) in learnMore" :key="item.sys.id">
          <learn-more-card
            :about-details-item="item"
            :parent-path="slug"
          />
          <hr v-if="i < learnMore.length - 1" />
        </div>
      </div>
    </div>
    <login-modal
      :show-dialog="showLoginDialog"
      @dialog-closed="showLoginDialog = false"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import LearnMoreCard from '@/components/LearnMoreCard/LearnMoreCard.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'
import CallToAction from '~/components/CallToAction/CallToAction.vue'
import LoginModal from '@/components/LoginModal/LoginModal.vue'

const client = createClient()

export default {
  name: 'ShareDataPage',
  components: {
    Breadcrumb,
    PageHero,
    LearnMoreCard,
    CallToAction,
    LoginModal
  },
  mixins: [MarkedMixin],

  async asyncData() {
    const pageData = await client.getEntry(process.env.ctf_share_data_page_id)
    return {
      title: pageData.fields.title,
      summary: pageData.fields.summary,
      description: pageData.fields.description,
      learnMore: pageData.fields.learnMore,
      callsToAction: pageData.fields.callsToAction,
      slug: pageData.fields.slug
    }
  },

  data: () => {
    return {
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      showLoginDialog: false
    }
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page-data {
  background-color: $background;
}
hr {
  opacity: 0.3;
}
::v-deep h1 {
  font-size:2rem;
  font-weight:500;
  line-height:2.75rem;
}

::v-deep h2 {
  font-size:1.5rem;
  font-weight:500;
  line-height:2.25rem;
}

::v-deep h3 {
  font-size:1rem;
  font-weight:500;
  line-height:1.875rem;
}
</style>
