<template>
  <div :class="['event-list-item', { 'past-events-divider': showPastEventsDivider }]" >
    <hr v-if="showPastEventsDivider" class="divider-text" data-content="PAST EVENTS" />
    <div class="event-content">
      <div class="image">
        <event-banner-image :src="bannerUrl" />
      </div>
      <div class="event-content-wrap">
        <nuxt-link
          class="link1"
          v-if="item.fields.requiresADetailsPage"
          :to="{
            name: 'news-and-events-events-id',
            params: { id: item.sys.id }
          }"
          v-html="highlightMatches(item.fields.title, $route.query.search)"
        />
        <a v-else class="link1" :href="item.fields.url" :target="!opensInNewTab(item.fields.url) ? '_self' : '_blank'">
          <span v-html="highlightMatches(item.fields.title, $route.query.search)"/>
          <svg-icon v-if="!isInternalLink(item.fields.url)" name="icon-open" height="30" width="30" />
        </a>
        <div>
          <div class="body1 my-8" v-html="highlightMatches(item.fields.summary, $route.query.search)"/>
          <table class="property-table">
            <tr>
              <td class="property-name-column">
                Event Type
              </td>
              <td>
                {{ item.fields.eventType }}
              </td>
            </tr>
            <tr>
              <td class="property-name-column">
                Event Date(s)
              </td>
              <td>
                {{ dateRange }}
              </td>
            </tr>
            <tr>
              <td class="property-name-column">
                Location
              </td>
              <td>
                {{ item.fields.location }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, pathOr } from 'ramda'
import eventBannerImage from '@/components/EventBannerImage/EventBannerImage.vue'
import FormatDate from '@/mixins/format-date'

import { isInternalLink, opensInNewTab } from '@/mixins/marked/index'
import { highlightMatches } from '../../pages/data/utils'

export default {
  name: 'EventCard',
  components: {
    eventBannerImage
  },
  mixins: [FormatDate],
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    showPastEventsDivider: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * Compute banner URL
     * @returns {String}
     */
    bannerUrl: function() {
      return pathOr(
        '',
        ['fields', 'image', 'fields', 'file', 'url'],
        this.item
      )
    },

    /**
     * Compute and formate start date
     * @returns {String}
     */
    startDate: function() {
      return this.formatDate(this.item.fields.startDate || '')
    },

    /**
     * Compute and formate end date
     * @returns {String}
     */
    endDate: function() {
      return this.formatDate(this.item.fields.endDate || '')
    },
    dateRange: function() {
      return this.startDate == this.endDate || isEmpty(this.endDate) ? this.startDate : `${this.startDate} - ${this.endDate}`
    },
  },
  methods: {
    isInternalLink,
    highlightMatches,
    opensInNewTab
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.el-table {
  width: 100%;
}
.property-table {
  td {
    background-color: transparent !important;
    padding: 0.25rem 0 0 0;
    border: none;
    cursor: default;
  }
  border: none;
  padding: 0;
}
// The outermost bottom border of the table. Element UI adds psuedo elements to create the bottom table border that we must hide to remove
table:not([class^='el-table__'])::before {
  display: none;
}
.property-name-column {
  width: 180px;
  font-weight: bold;
}
.event-list-item {
  border-radius: 3px 3px 0 0;
  background-color: white;
  margin-bottom: 5px;
}
.divider-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: $grey;
  text-align: center;
  height: 1.5em;
  opacity: .5;
  &:before {
    content: '';
    // use the linear-gradient for the fading effect
    // use a solid background color for a solid bar
    background: linear-gradient(to right, transparent, $grey, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }
  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: $grey;
    padding: 0 .5em;
    line-height: 1.5em;
    font-weight: 500;
    background-color: white;
  }
}
.event-content {
  display: flex;
  flex-direction: row;
  img {
    display: block;
    object-fit: cover;
    width: 8rem;
    height: 8rem;
  }

  .image {
    position: relative;
    margin: 2px;
  }

  .event-content-wrap {
    margin-left: 16px;
  }
}
</style>
