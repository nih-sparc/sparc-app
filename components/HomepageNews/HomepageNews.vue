<template>
  <div class="featured-datasets container pt-32">
    <h2 class="heading2">
      News &amp; Upcoming Events
    </h2>
    <sparc-card
      v-for="(item, idx) in upcomingNews"
      :key="item.sys.id"
      :image-align="idx % 2 ? 'right' : ''"
    >
      <template slot="image">
        <div class="sparc-card__image-container">
          <a class="centered" v-if="item.fields.requiresADetailsPage" :href="href(item)">
            <img
              class="sparc-card__image"
              :src="getImageSrc(item)" 
              :alt="getImageAlt(item)" 
            />
          </a>
          <template v-else>
            <div class="centered" v-if="item.fields.url">
              <a :href="item.fields.url" :target="isInternalLink(item.fields.url) ? '_self' : '_blank'">
                <img
                  class="sparc-card__image"
                  :src="getImageSrc(item)" 
                  :alt="getImageAlt(item)" 
                />
              </a>
            </div>
            <div v-else class="centered">
              <img
                  class="sparc-card__image"
                  :src="getImageSrc(item)" 
                  :alt="getImageAlt(item)" 
                />
            </div>
          </template>
        </div>
      </template>
      <div>
        <h3>
          <nuxt-link
            v-if="item.fields.requiresADetailsPage"
            :to="nuxtLink(item)"
          >
            {{ item.fields.title }}
          </nuxt-link>
          <a
            v-else
            :href="item.fields.url"
            :target="isInternalLink(item.fields.url) ? '_self' : '_blank'"
          >
            {{ item.fields.title }}
          </a>
        </h3>
        <div class="sparc-card__detail" v-if="eventDate(item) || item.fields.location">
          <template v-if="eventDate(item)">
            <svg-icon name="icon-calendar" height="16" width="16" />
            <p>{{ eventDate(item) }}</p>
          </template>
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
        <div class="markdown-text" v-html="parseMarkdown(item.fields.summary)" />
      </div>
      <nuxt-link v-if="item.fields.requiresADetailsPage" :to="nuxtLink(item)">
        <el-button size="medium" class="secondary">
          Learn More
        </el-button>
      </nuxt-link>
      <a
        v-else
        :href="item.fields.url"
        :target="isInternalLink(item.fields.url) ? '_self' : '_blank'"
      >
        <el-button size="medium" class="secondary">
          Learn More
        </el-button>
      </a>
    </sparc-card>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import SparcCard from '@/components/SparcCard/SparcCard.vue'
import MarkedMixin from '@/mixins/marked'
import FormatDate from '@/mixins/format-date'
import { isInternalLink } from '@/mixins/marked/index'
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
    isInternalLink,
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
    },
    /**
     * Create nuxt link based on type
     * @param {Object} item
     * @returns {Object}
     */
     nuxtLink: function(item) {
      const contentTypeId = pathOr("", ["sys","contentType","sys","id"], item)
      const itemId = pathOr("", ["sys","id"], item)
      const name = contentTypeId == 'news'
          ? 'news-and-events-news-id'
          : 'news-and-events-events-id'
      return {
        name,
        params: { id: itemId }
      }
    },
    href: function(item) {
      const contentTypeId = pathOr("", ["sys","contentType","sys","id"], item)
      const itemId = pathOr("", ["sys","id"], item)
      return contentTypeId == 'news'
          ? `news-and-events/news/${itemId}`
          : `news-and-events/events/${itemId}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
$tablet-small: 48em;
$tablet-large: 64em;
.centered {
  margin: auto;
}
h2 a:not(:hover) {
  color: #000;
  text-decoration: none;
}
div.sparc-card {
  margin-bottom: 1.5rem;
  @media (min-width: $tablet-small) {
    margin-bottom: 2.5rem;
  }
  ::v-deep &__content-wrap {
    flex: 7 0 0rem;
    &__content {
      @media (min-width: $tablet-small) {
        font-size: 0.9rem;
        line-height: 1.5rem;
        padding: 2rem;
        .markdown-text {
          p {
            margin: 0 0 1.5rem;
          }
        }
      }
      @media (min-width: $tablet-large) {
        font-size: 1rem;
      }
    }
  }
  h3 {
    font-size: 1.333333333rem;
    line-height:1.33333333rem;
    margin:0 0 1rem;
  }
  &__detail {
    align-items: baseline;
    display: flex;
    margin-bottom: 1rem;
    .svg-icon {
      flex-shrink: 0;
      margin-right: 0.5rem;
    }
    p {
      margin-bottom: 0rem;
      margin-right: 2rem;
    }
    &--location {
      margin-left: 1.25rem;
    }
  }
}
</style>
