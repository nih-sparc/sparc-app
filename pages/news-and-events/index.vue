<template>
  <div class="events-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ heroData.fields.page_title }}</h1>
      <p>
        {{ heroData.fields.heroCopy }}
      </p>
      <img
        v-if="heroImage"
        slot="image"
        class="page-hero-img"
        :src="heroImage.fields.file.url"
      />
    </page-hero>

    <div class="page-wrap">
      <div class="container">
        <h2>Events</h2>
        <tab-nav
          :tabs="eventsTabs"
          :active-tab="activeTab"
          @set-active-tab="activeTab = $event"
        />
        <div class="events-wrap">
          <template v-if="activeTab === 'upcoming'">
            <div class="upcoming-events">
              <event-card
                v-for="event in displayedUpcomingEvents"
                :key="event.sys.id"
                :event="event"
              />
            </div>

            <div class="show-all-upcoming-events">
              <a
                v-if="!isShowingAllUpcomingEvents"
                class="show-all-upcoming-events__btn"
                href="#"
                @click.prevent="isShowingAllUpcomingEvents = true"
              >
                Show All ({{ upcomingEvents.length }}) Upcoming Events
                <svg-icon name="icon-sort-desc" height="10" width="10" />
              </a>
            </div>
          </template>

          <div v-if="activeTab === 'past'" class="subpage">
            <event-list-item
              v-for="(event, index) in pastEvents"
              :key="`${event}-${index}`"
              :event="event"
            />
          </div>
        </div>

        <h2>Latest News</h2>
        <div class="subpage">
          <div>
            <news-list-item v-for="newsItem in news" :key="newsItem.sys.id" :item="newsItem" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import TabNav from '@/components/TabNav/TabNav.vue'
import EventListItem from '@/components/EventListItem/EventListItem.vue'
import NewsListItem from '@/components/NewsListItem/NewsListItem.vue'
import EventCard from '@/components/EventCard/EventCard.vue'
import PageHero from '@/components/PageHero/PageHero.vue'

import createClient from '@/plugins/contentful.js'

import { EventsEntry, HeroDataEntry, NewsEntry, Data, Computed, fetchData } from './model'

const client = createClient()

export default Vue.extend<Data, never, Computed, never>({
  name: 'EventPage',

  components: {
    Breadcrumb,
    EventCard,
    EventListItem,
    PageHero,
    NewsListItem,
    TabNav
  },

  asyncData() {
    return fetchData(client)
  },

  data: function() {
    return {
      title: 'News & Events',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
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
      isShowingAllUpcomingEvents: false,
      news: [],
      heroData: {} as HeroDataEntry
    }
  },

  computed: {
    /**
     * Compute upcoming events
     * Used to display four events in the upcoming tab
     * @returns {Array}
     */
    displayedUpcomingEvents: function(this: Data) {
      return this.isShowingAllUpcomingEvents
        ? this.upcomingEvents
        : this.upcomingEvents.slice(0, 4)
    }
  }
})
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
.show-all-upcoming-events {
  text-align: center;
  &__btn {
    align-items: center;
    color: $navy;
    display: inline-flex;
    font-weight: 500;
    text-decoration: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
  .svg-icon {
    margin-left: 0.5rem;
  }
}
.events-wrap {
  margin-bottom: 2.625em;
}
.news-list-item {
  border-bottom: 2px solid #d8d8d8;
  padding: 1.5em 0;
  &:first-child {
    padding-top: 0;
  }
}
</style>
