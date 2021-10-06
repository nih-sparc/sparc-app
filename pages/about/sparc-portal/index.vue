<template>
  <div>
    <breadcrumb :breadcrumb="breadcrumb" :title="type" />
    <page-hero>
      <h1>{{ title }}</h1>
      <p>{{ summary }}</p>
    </page-hero>
    <div class="container">
      <div class="subpage">
        <div v-html="parseMarkdown(description)" />
        <hr />
        <p class="share-text">
          SHARE
        </p>
        <share-links />
      </div>
      <div v-if="learnMore" class="subpage">
        <h1>Learn More</h1>
        <learn-more-card
          v-for="(item, index) in learnMore"
          :key="`${item}-${index}`"
          :about-details-item="item"
          :parent-path="slug"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import LearnMoreCard from '@/components/LearnMoreCard/LearnMoreCard.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import ShareLinks from '~/components/ShareLinks/ShareLinks.vue'

import MarkedMixin from '@/mixins/marked'
import createClient from '@/plugins/contentful.js'

import { successMessage, failMessage } from '@/utils/notification-messages'

const client = createClient()

export default {
  name: 'SparcPortalAboutPage',

  components: {
    Breadcrumb,
    PageHero,
    LearnMoreCard,
    ShareLinks
  },

  mixins: [MarkedMixin],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_about_portal_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
      })
      .catch(console.error)
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

  computed: {
    pageUrl: function() {
      return `${process.env.ROOT_URL}${this.$route.fullPath}`
    }
  },

  methods: {
    /**
     * Copy file URL to clipboard
     * @param {Object} scope
     */
    copyUrl() {
      this.$copyText(this.pageUrl).then(
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
@import '@/assets/_variables.scss';

.subpage {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #dcdfe6;
  background: white;

  @media (min-width: 48em) {
    margin: 2.5em 0;
    padding: 1em 2em;
  }

  hr {
    opacity: 0.3;
  }

  h1 {
    font-size: 1.75em;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
}

.share-text {
  font-weight: 500;
  margin-bottom: 0;
}
</style>
