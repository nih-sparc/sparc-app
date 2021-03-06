<template>
  <div class="featured-datasets container">
    <div class="home-container">
      <h2>
        <nuxt-link to="/news-and-events">
          News &amp; Upcoming Events
        </nuxt-link>
      </h2>
      <sparc-card
        v-for="(item, idx) in upcomingNews"
        :key="item.sys.id"
        :image="getImageSrc(item)"
        :image-alt="getImageAlt(item)"
        :image-align="idx % 2 ? 'right' : ''"
      >
        <div>
          <h3>
            <nuxt-link
              :to="{
                name: 'news-and-events-news-id',
                params: { id: item.sys.id }
              }"
            >
              {{ item.fields.title }}
            </nuxt-link>
          </h3>
          <div class="sparc-card__detail">
            <svg-icon name="icon-calendar" height="16" width="16" />
            <p>{{ eventDate(item) }}</p>
            <template v-if="item.fields.location">
              <svg-icon
                class="sparc-card__detail--location"
                name="icon-map"
                height="16"
                width="16"
              />
              <p>{{ item.fields.location }}</p>
            </template>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <!-- marked will sanitize the HTML injected -->
          <div v-html="parseMarkdown(item.fields.summary)" />
        </div>
        <nuxt-link
          :to="{
            name: 'news-and-events-news-id',
            params: { id: item.sys.id }
          }"
        >
          <el-button size="medium">
            Learn More
          </el-button>
        </nuxt-link>
      </sparc-card>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import SparcCard from '@/components/SparcCard/SparcCard.vue'

import MarkedMixin from '@/mixins/marked'

import FormatDate from '@/mixins/format-date'

export default {
  name: 'HomepageNews',

  components: {
    SparcCard
  },

  mixins: [MarkedMixin, FormatDate],

  props: {
    news: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    /**
     * Filter news to remove past events
     * @returns {Array}
     */
    upcomingNews: function() {
      return this.news.filter(event => this.isUpcoming(event))
    }
  },

  methods: {
    /**
     * Get image source
     * @param {Object} item
     * @returns {String}
     */
    getImageSrc: function(item) {
      return pathOr('', ['fields', 'image', 'fields', 'file', 'url'], item)
    },
    /**
     * Get image source
     * @param {Object} item
     * @returns {String}
     */
    getImageAlt: function(item) {
      return pathOr(
        '',
        ['fields', 'image', 'fields', 'file', 'description'],
        item
      )
    },
    /**
     * Get event date range, if there is no end date, default to start date
     * @returns {String}
     */
    eventDate: function(event) {
      const startDate = this.formatDate(event.fields.startDate || '')
      const endDate = this.formatDate(event.fields.endDate || '')
      return startDate === endDate || !endDate
        ? startDate
        : `${startDate} - ${endDate}`
    },
    /**
     * Check if an event is upcoming, if there is no end date, default to start date
     * @param {Object} item
     * @returns {Boolean}
     */
    isUpcoming: function(item) {
      const today = new Date()
      const checkDate = item.fields.endDate || item.fields.startDate || ''
      return checkDate ? Date.parse(checkDate) > Date.parse(today) : true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.home-container {
  padding-left: 1rem;
  padding-right: 1rem;
  @media (min-width: 768px) {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}
h2 a:not(:hover) {
  color: #000;
  text-decoration: none;
}
.sparc-card {
  margin-bottom: 24px;
  @media (min-width: 768px) {
    margin-bottom: 40px;
  }
  h3 {
    font-size: 1.333333333em;
  }
  &__detail {
    align-items: baseline;
    display: flex;
    margin-bottom: 0.625rem;
    .svg-icon {
      flex-shrink: 0;
      margin-right: 0.5rem;
    }
    p {
      margin-bottom: 0rem;
    }
    &--location {
      margin-left: 1.25rem;
    }
  }
}
</style>
