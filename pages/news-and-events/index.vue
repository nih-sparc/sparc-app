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
          <div class="upcoming-events">
            <event-card
              v-for="event in displayedUpcomingEvents"
              :key="event.sys.id"
              :event="event"
            />
          </div>

          <a
            v-if="!isShowingAllUpcomingEvents"
            href="#"
            @click.prevent="isShowingAllUpcomingEvents = true"
          >
            Show All ({{ upcomingEvents.length }}) Upcoming Events
          </a>
        </template>

        <div v-if="activeTab === 'past'" class="subpage">
          <event-list-item
            v-for="(event, index) in pastEvents"
            :key="`${event}-${index}`"
            :event="event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventListItem from '@/components/EventListItem/EventListItem.vue'
import EventCard from '@/components/EventCard/EventCard.vue'
import createClient from '@/plugins/contentful.js'

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import TabNav from '@/components/TabNav/TabNav'

const client = createClient()

export default {
  name: 'EventPage',

  components: {
    Breadcrumb,
    EventCard,
    EventListItem,
    TabNav
  },

  asyncData() {
    const todaysDate = new Date()
    return Promise.all([
      // Fetch upcoming events
      client.getEntries({
        content_type: process.env.ctf_event_id,
        order: 'fields.startDate',
        'fields.startDate[gte]': todaysDate.toISOString()
      }),

      // Fetch past events
      client.getEntries({
        content_type: process.env.ctf_event_id,
        order: 'fields.startDate',
        'fields.startDate[lt]': todaysDate.toISOString()
      }),

      // Fetch news
      client.getEntries({
        content_type: process.env.ctf_news_id,
        order: 'fields.publishedDate'
      })
    ])
      .then(([upcomingEvents, pastEvents, news]) => {
        // return data that should be available
        // in the template
        return {
          upcomingEvents: upcomingEvents.items,
          pastEvents: pastEvents.items,
          news
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
          label: 'Past',
          type: 'past'
        }
      ],
      upcomingEvents: [],
      pastEvents: [],
      isShowingAllUpcomingEvents: false
    }
  },

  computed: {
    /**
     * Compute upcoming events
     * Used to display four events in the upcoming tab
     * @returns {Array}
     */
    displayedUpcomingEvents: function() {
      return this.isShowingAllUpcomingEvents
        ? this.upcomingEvents
        : this.upcomingEvents.slice(0, 4)
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
.upcoming-events {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1em;
}
.upcoming-event {
  margin: 0 1em 2em;
  @media (min-width: 48em) {
    width: calc(50% - 4.125em); // Account for the margins and the border
  }
  @media (min-width: 64em) {
    width: calc(25% - 4.125em); // Account for the margins and the border
  }
}
</style>
