<template>
  <news-events-resources-page
    :page="page"
    :content="page.fields.copy"
    :breadcrumb="breadcrumb"
    :hero-title="page.fields.title"
    :hero-summary="page.fields.summary"
    type="news"
  >
    <template v-if="newsImage">
      <img :src="newsImage" :alt="newsImageAlt" />
      <hr />
    </template>

    <h3>Published Date</h3>
    <p>{{ publishedDate }}</p>

    <h3 v-if="page.fields.url">External Link</h3>
    <p v-if="page.fields.url">
      <a :href="page.fields.url" target="_blank">
        {{ page.fields.url }}
      </a>
    </p>
  </news-events-resources-page>
</template>

<script>
import { pathOr } from 'ramda'

import NewsEventsResourcesPage from '@/components/NewsEventsResourcesPage/NewsEventsResourcesPage'

import FormatDate from '@/mixins/format-date'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'NewsPage',

  components: {
    NewsEventsResourcesPage
  },

  mixins: [FormatDate],

  async asyncData({ route }) {
    try {
      const page = await client.getEntry(route.params.id)
      return { page }
    } catch (error) {
      return {
        page: {
          fields: []
        }
      }
    }
  },

  data() {
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
        }
      ]
    }
  },

  head() {
    return {
      title: this.page.fields.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.page.fields.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.page.fields.summary ? this.page.fields.summary : 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        },
      ]
    }
  },

  computed: {
    /**
     * Get news and event image
     * @returns {String}
     */
    newsImage: function() {
      return pathOr('', ['fields', 'image', 'fields', 'file', 'url'], this.page)
    },

    /**
     * Get news and event image alt tag
     * @returns {String}
     */
    newsImageAlt: function() {
      return pathOr('', ['fields', 'image', 'fields', 'title'], this.page)
    },

    /**
     * Compute and formate start date
     * @returns {String}
     */
    publishedDate: function() {
      return this.page.fields.publishedDate
        ? this.formatDate(this.page.fields.publishedDate)
        : ''
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

hr {
  margin: 1rem 0;
}
</style>
