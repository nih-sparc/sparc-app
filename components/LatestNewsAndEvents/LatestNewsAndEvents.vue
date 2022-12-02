<template>
  <div class="container py-32">
    <div class="heading2 mb-16 section-title">Stay up to date</div>
    <el-row :gutter="32">
      <el-col class="mb-16" :sm="12">
        <div class="heading2 subheading mb-16">Latest News</div>
        <div class="subpage news-wrap">
          <div>
            <news-list-item v-for="newsItem in news.items" :key="newsItem.sys.id" :item="newsItem" />

            <nuxt-link
              class="btn-load-more mt-16"
              :to="{
                name: 'news-and-events-news'
              }"
            >
              View All News &gt;
            </nuxt-link>
          </div>
        </div>
      </el-col>
      <el-col :sm="12">
        <div class="heading2 subheading mb-16">Events</div>
        <!--
          Server side rendering does not work with the following
          combination of components
        -->
        <client-only>
          <content-tab-card
            class="tabs p-32"
            :tabs="eventsTabs"
            :active-tab-id="activeTabId"
            @tab-changed="eventsTabChanged"
          >
            <template v-if="activeTabId === 'upcoming'">
              <div class="upcoming-events">
                <event-card
                  v-for="event in upcomingEvents.items"
                  :key="event.sys.id"
                  :event="event"
                />
              </div>

            </template>

            <template v-if="activeTabId === 'past'">
              <div class="past-events">
                <event-card
                  v-for="event in pastEvents.items"
                  :key="event.sys.id"
                  :event="event"
                />
              </div>
            </template>
            <div class="mt-16">
              <nuxt-link
                class="btn-load-more"
                :to="{
                  name: 'news-and-events-events',
                }"
              >
                View All Events >
              </nuxt-link>
            </div>
          </content-tab-card>
        </client-only>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TabNav from '@/components/TabNav/TabNav.vue';
import EventListItem from '@/components/EventListItem/EventListItem.vue';
import NewsListItem from '@/components/NewsListItem/NewsListItem.vue';
import EventCard from '@/components/EventCard/EventCard.vue';
import MarkedMixin from '@/mixins/marked'

import createClient from '@/plugins/contentful.js';

import { fetchData, fetchNews } from '@/pages/news-and-events/model';

const client = createClient()

export default {
  name: 'LatestNewsAndEvents',

  mixins: [
    MarkedMixin
  ],

  components: {
    EventCard,
    EventListItem,
    NewsListItem,
    TabNav,
  },

  async mounted() {
    const { upcomingEvents, pastEvents, news } = await fetchData(client, '', 2)
    this.news = news
    this.upcomingEvents = upcomingEvents
    this.pastEvents = pastEvents
  },

  data: function() {
    return {
      activeTabId: 'upcoming',
      eventsTabs: [
        {
          label: 'Upcoming',
          id: 'upcoming'
        },
        {
          label: 'Past',
          id: 'past'
        }
      ],
      upcomingEvents: {},
      pastEvents: {},
      news: {},
    }
  },

  methods: {
    /**
     * Get all news
     */
    getAllNews: async function() {
      const news = await fetchNews(client, '', undefined, undefined, undefined, undefined, this.news.total, 2)
      this.news = { ...this.news, items: { ...this.news.items, ...news.items } }
    },
    eventsTabChanged(newTab) {
      this.activeTabId = newTab.id
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.subpage {
  margin: 0;
}
.subheading {
  font-weight: 100;
}
.section-title {
  text-align: center;
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
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
}
.upcoming-event {
  margin: 0;
  width: 100%;
  @media (min-width: 48em) {
    width: calc(50% - 2.4rem); // Account for the margins and the border
  }
}
.news-list-item {
  border-bottom: 2px solid #d8d8d8;
  padding: 1.5em 0;
  &:first-child {
    padding-top: 0;
  }
}

.btn-load-more {
  background: none;
  border: none;
  color: $darkBlue;
  cursor: pointer;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  padding: 0;
  &:hover,
  &:active {
    text-decoration: underline;
  }
}

::v-deep .el-button {
  a {
    text-decoration: none !important;
  }
}

::v-deep .tabs {
  padding: 0;
}
</style>
