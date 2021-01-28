<template>
  <div class="events-page">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>{{ heroData.fields.page_title }}</h1>
      <p>
        {{ heroData.fields.heroCopy }}
      </p>
      <search-controls-contentful
        placeholder="Search news and events"
        path="/news-and-events"
      />
      <img
        v-if="heroData.fields.heroImage"
        slot="image"
        class="page-hero-img"
        :src="heroData.fields.heroImage.fields.file.url"
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

          <template v-if="activeTab === 'past'">
            <div class="past-events">
              <event-card
                v-for="event in displayedPastEvents"
                :key="event.sys.id"
                :event="event"
              />
            </div>

            <div class="show-more-past-events">
              <a
                v-if="!isShowingAllPastEvents && pastEventsChunkMax > 1"
                class="show-more-past-events__btn"
                href="#"
                @click.prevent="pastEventChunk += 1"
              >
                View More
              </a>
            </div>
          </template>
        </div>

        <h2>Latest News</h2>
        <div class="subpage">
          <div>
            <news-list-item v-for="newsItem in news.items" :key="newsItem.sys.id" :item="newsItem" />

            <button v-if="news.total > news.items.length" class="btn-load-more mt-16" @click="getAllNews">View All News &gt;</button>
          </div>
        </div>

        <h2>Stay Connected</h2>
        <div class="subpage">
          <el-row :gutter="32">
            <el-col :xs="24" :sm="12" class="newsletter-wrap">
              <h3 class="mb-24">Sign up to the SPARC Newsletter</h3>
              <p class="mb-40">Keep up to date with all the latest news and events from the SPARC portal.</p>
              <newsletter-form />
            </el-col>
            <el-col :xs="24" :sm="12" class="twitter-wrap">
              <div v-twitter-widgets>
                <a
                  class="twitter-timeline"
                  href="https://twitter.com/sparc_science?ref_src=twsrc%5Etfw"
                  data-height="500"
                  target="_blank"
                >
                  Tweets by sparc_science
                </a>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue';
import TabNav from '@/components/TabNav/TabNav.vue';
import EventListItem from '@/components/EventListItem/EventListItem.vue';
import NewsListItem from '@/components/NewsListItem/NewsListItem.vue';
import EventCard from '@/components/EventCard/EventCard.vue';
import PageHero from '@/components/PageHero/PageHero.vue';
import SearchControlsContentful from '@/components/SearchControlsContentful/SearchControlsContentful.vue';
import NewsletterForm from '@/components/NewsletterForm/NewsletterForm.vue';

import createClient from '@/plugins/contentful.js';

import { Computed, Data, Methods, fetchData, fetchNews, HeroDataEntry, NewsAndEventsComponent, NewsCollection } from './model';

const client = createClient()
const MAX_PAST_EVENTS = 8

export default Vue.extend<Data, Methods, Computed, never>({
  name: 'EventPage',

  components: {
    Breadcrumb,
    EventCard,
    EventListItem,
    PageHero,
    NewsListItem,
    TabNav,
    SearchControlsContentful,
    NewsletterForm
  },

  asyncData() {
    return fetchData(client)
  },

  watch: {
    '$route.query': {
      handler: async function(this: NewsAndEventsComponent) {
        const { upcomingEvents, pastEvents, news, heroData } = await fetchData(client, this.$route.query.search as string)
        this.upcomingEvents = upcomingEvents;
        this.pastEvents = pastEvents;
        this.news = news;
        this.heroData = heroData;
      },
      immediate: true
    }
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
      isShowingAllPastEvents: false,
      news: {} as NewsCollection,
      heroData: {} as HeroDataEntry,
      pastEventChunk: 1
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
    },

    /**
     * Compute maximum chunk value
     * @returns {Number}
     */
    pastEventsChunkMax: function(this: Data) {
      return Math.ceil(this.pastEvents.length / MAX_PAST_EVENTS)
    },

    /**
     * Compute past events to display based on
     * current chunk value
     * @returns {Array}
     */
    displayedPastEvents: function (this: Data & Computed) {
      if (this.pastEventChunk === this.pastEventsChunkMax) this.isShowingAllPastEvents = true;
      const endChunk = this.pastEventChunk * MAX_PAST_EVENTS
      return this.pastEvents.slice().reverse().slice(0, endChunk)
    }
  },

  methods: {
    /**
     * Get all news
     */
    getAllNews: async function() {
      const news = await fetchNews(client, this.$route.query.search as string, this.news.total, 4)
      this.news = { ...this.news, items: { ...this.news.items, ...news.items } }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
}

h3 {
  color: $navy;
  font-size: 1.375rem;
  line-height: 2rem;
}
.subpage {
  @media (min-width: 48em) {
    margin: 3rem 0;
  }
}
.event-card {
  margin-bottom: 2em;
}
::v-deep .details-tabs__container {
  background: none;
  border: none;
  margin: 1em 0;
  padding: 0;
}
.upcoming-events, .past-events {
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

.show-more-past-events {
  text-align: center;
  &__btn {
    display: inline-flex;
    border: 1px solid $dark-gray;
    border-radius: 5px;
    text-decoration: none;
    padding: 8px 10px;
    font-size: 11pt;
    font-weight: bold;
    color: $dark-gray;
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
.newsletter-wrap {
  font-size: 1.125rem;
  line-height: 1.5rem;
  margin-bottom: 2rem;
  @media (min-width: 48em) {
    margin-bottom: 0;
  }
  p {
    color: $navy
  }
}
.twitter-wrap {
  @media (min-width: 48em) {
    border-left: 2px solid #d8d8d8;
  }
}

.btn-load-more {
  background: none;
  border: none;
  color: $navy;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  padding: 0;
  &:hover,
  &:active {
    text-decoration: underline;
  }
}
</style>
