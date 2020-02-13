<template>
  <div class="events-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />

    <div class="page-wrap">
      <div class="container">
        <h2>Events</h2>
        <tab-nav
          :tabs="eventsTabs"
          :active-tab="activeTab"
          @set-active-tab="activeTab = $event"
        />
        <template v-if="activeTab === 'upcoming'">
          <el-row type="flex" :gutter="32">
            <el-col
              v-for="event in upcomingEvents"
              :key="event.sys.id"
              :xs="24"
              :sm="6"
            >
              <div class="upcoming-event">
                <div class="upcoming-event__image">
                  <img :src="eventImage(event)" :alt="eventAlt(event)" />
                  <span>{{ event.fields.eventType }}</span>
                </div>
                <h3>
                  <a :href="event.fields.url" target="_blank">
                    {{ event.fields.title }}
                  </a>
                </h3>
                <p>{{ eventDate(event) }}</p>
                <p>{{ event.fields.location }}</p>
              </div>
            </el-col>
          </el-row>
        </template>

        <div v-if="activeTab === 'all'" class="subpage">
          <event-card
            v-for="(event, index) in events"
            :key="`${event}-${index}`"
            :event="event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import EventCard from '@/components/EventCard/EventCard.vue'
import createClient from '@/plugins/contentful.js'

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import TabNav from '@/components/TabNav/TabNav'

import FormatDate from '@/mixins/format-date'

const client = createClient()

export default {
  name: 'EventPage',

  components: {
    Breadcrumb,
    TabNav,
    EventCard
  },

  mixins: [FormatDate],

  asyncData() {
    return Promise.all([
      // fetch all blog posts sorted by creation date
      client.getEntries({
        content_type: process.env.ctf_event_id,
        order: 'fields.startDate'
      })
    ])
      .then(([events]) => {
        // return data that should be available
        // in the template
        return {
          events: events.items
        }
      })
      .catch(console.error)
  },

  data: function() {
    return {
      title: 'News & Events',
      breadcrumb: {
        name: 'index',
        parent: 'Home'
      },
      activeTab: 'upcoming',
      eventsTabs: [
        {
          label: 'Upcoming',
          type: 'upcoming'
        },
        {
          label: 'All',
          type: 'all'
        }
      ]
    }
  },

  computed: {
    /**
     * Compute upcoming events
     * Used to display four events in the upcoming tab
     * @returns {Array}
     */
    upcomingEvents: function() {
      return this.events.slice(0, 4)
    }
  },

  methods: {
    /**
     * Get event image
     * @returns {String}
     */
    eventImage: function(event) {
      return pathOr('', ['fields', 'image', 'fields', 'file', 'url'], event)
    },
    /**
     * Get event image alt tag
     * @returns {String}
     */
    eventAlt: function(event) {
      return pathOr('', ['fields', 'image', 'fields', 'title'], event)
    },
    /**
     * Get event date range
     * @returns {String}
     */
    eventDate: function(event) {
      const startDate = this.formatDate(event.fields.startDate)
      const endDate = this.formatDate(event.fields.endDate)
      return `${startDate} - ${endDate}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.event-card {
  margin-bottom: 2em;
}
::v-deep .details-tabs__container {
  background: none;
  border: none;
  margin: 1em 0;
  padding: 0;
}
.upcoming-event {
  background: #fff;
  border: 1px solid #dbdfe6;
  color: $dark-sky;
  padding: 1em;
  &__image {
    margin-bottom: 1rem;
    min-height: 262px;
    position: relative;
    img {
      display: block;
      height: auto;
      width: 100%;
    }
    span {
      background: $median;
      border-radius: 15px;
      color: #fff;
      font-size: 0.875rem;
      top: 10px;
      padding: 0 0.65rem;
      position: absolute;
      right: 14px;
    }
  }
  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.375rem;
  }
  a {
    color: $median;
    text-decoration: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
}
</style>
