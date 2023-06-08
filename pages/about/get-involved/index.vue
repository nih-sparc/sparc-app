<template>
    <div class="page-data pb-16">
    <breadcrumb :breadcrumb="breadcrumb" :title="type" />
    <page-hero>
      <h1>{{ title }}</h1>
      <p>{{ summary }}</p>
    </page-hero>
    <div class="container">
      <div class="subpage px-32 py-16">
        <div v-html="parseMarkdown(description)" />
        <hr />
        <div class="body1">
          SHARE
        </div>
        <share-links />
      </div>
      <div v-if="learnMore" class="subpage px-32 mb-0">
        <div class="heading1 mb-16">Learn More</div>
        <template v-for="(item, index) in learnMore">
          <div :key="`${item}-${index}`">
            <learn-more-card
              :about-details-item="item"
              :parent-path="slug"
            />
            <hr v-if="learnMore.length > 1 && index != learnMore.length - 1" />
          </div>
        </template>
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

import { successMessage, failMessage } from '@/utils/notification-messages'
import ShareLinks from '~/components/ShareLinks/ShareLinks.vue'

const client = createClient()

export default {
  name: 'GetInvolvedAboutPage',

  components: {
    Breadcrumb,
    PageHero,
    LearnMoreCard,
    ShareLinks
  },

  mixins: [MarkedMixin],

  async asyncData() {
    const page = await client.getEntry(process.env.ctf_get_involved_page_id)
    return {
      title : page.fields.title,
      type: page.fields.type,
      summary: page.fields.summary,
      description: page.fields.description,
      learnMore: page.fields.learnMore,
      slug: page.fields.slug,
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
        },
        {
          label: 'About SPARC',
          to: {
            name: 'about'
          }
        }
      ]
    }
  },

  head() {
    return {
      title: this.title
    }
  },

  methods: {
    /**
     * Copy file URL to clipboard
     * @param {Object} scope
     */
    copyUrl() {
      this.$copyText(window.location.href).then(
        () => {
          this.$message(successMessage(`URL copied to clipboard.`))
        },
        () => {
          this.$message(failMessage(`Cannot copy to clipboard.`))
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page-data {
  background-color: $background;
}
.heading1 {
  font-weight: 300;
}

hr {
  opacity: 0.3;
}
h1 {
  font-weight: 300;
}
</style>
