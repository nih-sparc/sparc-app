<template>
  <news-events-resources-page
    :page="page"
    :content="page.fields.description"
    :breadcrumb="breadcrumb"
    :hero-title="page.fields.title"
    :hero-summary="page.fields.summary"
    :has-event-details-page="hasEventDetailsPage"
    type="event"
  >
    <a :href="page.fields.url" target="_blank">
      <img :src="newsImage" :alt="newsImageAlt" />
    </a>
    <hr />

    <h3>Type</h3>
    <p>{{ page.fields.eventType }}</p>

    <h3>Date</h3>
    <p>{{ eventDate }}</p>

    <h3>Location</h3>
    <p>{{ page.fields.location }}</p>

    <h3 v-if="page.fields.url">External Link</h3>
    <p v-if="page.fields.url">
      <a :href="page.fields.url" target="_blank">{{ page.fields.url }}</a>
    </p>
  </news-events-resources-page>
</template>

<script>
import { pathOr } from 'ramda'

import NewsEventsResourcesPage from '@/components/NewsEventsResourcesPage/NewsEventsResourcesPage'

import FormatDate from '@/mixins/format-date'

import createClient from '@/plugins/contentful.js'

const client = createClient()
const getEventPage = async id => {
  try {
    const isSlug = id.split('-').length > 1

    const item = isSlug
      ? await client.getEntries({
          content_type: process.env.ctf_event_id,
          'fields.slug': id
        })
      : await client.getEntry(id)
    return isSlug ? item.items[0] : item
  } catch (error) {
    return {}
  }
}

export default {
  name: 'EventPage',

  components: {
    NewsEventsResourcesPage
  },

  mixins: [FormatDate],

  async asyncData({ route, redirect }) {
    try {
      const page = await getEventPage(route.params.id)
      const slug = pathOr(null, ['fields', 'slug'], page)
      if (slug !== null && route.params.id !== slug) {
        redirect(`/news-and-events/events/${slug}`)
      }
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
          content: this.page.fields.summary ? this.page.fields.summary : 'The open community platform for bridging the body and the brain through neuroscience and systems physiology data, computational and spatial modeling, and device design.'
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

    eventDetails: function() {
      return pathOr(null, ['fields', 'eventDetails'], this.page)
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
    },

    hasEventDetailsPage: function() {
      return this.eventDetails !== null
    },
  }
}
</script>
