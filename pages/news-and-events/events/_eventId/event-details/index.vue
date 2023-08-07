<template>
  <div class="page pb-32">
    <breadcrumb :breadcrumb="breadcrumb" title="Event Details" />
    <page-hero>
      <h1>{{ heroTitle }}</h1>
      <div class="body2">
        {{ heroSummary }}
      </div>
    </page-hero>
    <div class="page-wrap container pt-32">
      <div class="subpage">
        <div class="header mb-32">
          <h2>Event Details</h2>
          <div class="updated">
            <i>Updated at: {{ updatedDate }} </i>
          </div>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <!-- marked will sanitize the HTML injected -->
        <div class="content" v-html="parseMarkdown(htmlDetails)" />
      </div>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns'
import marked from '@/mixins/marked/index'
import createClient from '@/plugins/contentful.js'
import PageHero from "@/components/PageHero/PageHero.vue";
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import FormatDate from '@/mixins/format-date'
import { pathOr, isEmpty } from 'ramda'

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
  name: 'EventDetails',

  components: {
    Breadcrumb,
    PageHero
  },

  mixins: [FormatDate, marked],

  async asyncData({ route, redirect }) {
    try {
      const page = await getEventPage(route.params.eventId)
      const eventDetailsItem = pathOr(null, ['fields','eventDetails'], page)
      if (isEmpty(eventDetailsItem)) {
        redirect(`/news-and-events/events/${route.params.eventId}`)
      }
      return { 
        page,
        eventDetailsItem 
      }
    } catch (error) {
      return {
        page: {
          fields: [],
          eventDetailsItem: null
        },
      }
    }
  },

  head() {
    return {
      title: this.heroTitle,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.heroTitle,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.heroSummary ? this.heroSummary : 'Stimulating Peripheral Activity to Relieve Conditions (SPARC)'
        },
      ]
    }
  },

  computed: {
    /**
     * Compute HTML Event Details for the page
     * @returns {String}
     */
    htmlDetails: function() {
      return pathOr('', ['fields', 'eventDetails'], this.eventDetailsItem)
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
    heroTitle: function() {
      return pathOr('', ['fields', 'title'], this.page)
    },
    heroSummary: function() {
      return pathOr('', ['fields', 'summary'], this.page)
    },
    eventId: function() {
      return this.$route.params.eventId
    },
    /**
     * Compute and convert the date the article was created
     * @returns {String}
     */
    updatedDate: function() {
      return format(parseISO(this.eventDetailsItem.sys.updatedAt), 'MM/dd/yyyy')
    },
    breadcrumb: function() {
      return [
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
        },
        {
          label: `${this.heroTitle}`,
          to: {
            path: `/news-and-events/events/${this.eventId}`
          }
        }
      ]
    }
  }
}

</script>
<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page {
  background-color: $background;
}
.content {
  ::v-deep img {
    height: auto;
    margin: 0.5em 0;
    width: 100%;
  }
}
.subpage {
  margin: 0;
}
</style>
