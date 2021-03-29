<template>
  <news-events-page
    :page="page"
    :content="page.fields.description"
    :breadcrumb="breadcrumb"
  >
    <img :src="newsImage" :alt="newsImageAlt" />
    <hr />

    <h3>Type</h3>
    <p>{{ page.fields.eventType }}</p>

    <h3>Date</h3>
    <p>{{ eventDate }}</p>

    <h3>Location</h3>
    <p>{{ page.fields.location }}</p>
  </news-events-page>
</template>

<script>
import { pathOr } from 'ramda'

import NewsEventsPage from '@/components/NewsEventsPage/NewsEventsPage'

import FormatDate from '@/mixins/format-date'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'NewsPage',

  components: {
    NewsEventsPage
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
        },
        {
          label: 'Events',
          to: {
            name: 'news-and-events-events'
          }
        }
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
     * Get event date range, if there is no end date, default to start date
     * @returns {String}
     */
    eventDate: function() {
      const startDate = this.formatDate(this.page.fields.startDate || '')
      const endDate = this.formatDate(this.page.fields.endDate || '')
      return startDate === endDate || !endDate
        ? startDate
        : `${startDate} - ${endDate}`
    }
  }
}
</script>
