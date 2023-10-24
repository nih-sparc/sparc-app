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
      <div v-for="callToAction in callsToAction" :key="callToAction.sys.id" class="call-to-action-container">
        <call-to-action :data="callToAction.fields"/>
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
</div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import LearnMoreCard from '@/components/LearnMoreCard/LearnMoreCard.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'
import CallToAction from '~/components/CallToAction/CallToAction.vue'

const client = createClient()

export default {
  name: 'ShareDataPage',
  components: {
    Breadcrumb,
    PageHero,
    LearnMoreCard,
    CallToAction
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
      ]
    }
  }
}
</script>

<style scoped>
.call-to-action-container {
  margin-bottom: 1.8em
}
</style>
