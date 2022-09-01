<template>
  <div class="event-list-item">
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
        >
          {{ item.fields.title }}
        </nuxt-link>
        <a v-else class="link1" :href="item.fields.url" :target="isInternalLink('item.fields.url') ? '_self' : '_blank'">
          {{ item.fields.title }}
          <svg-icon v-if="!isInternalLink('item.fields.url')" name="icon-open" height="30" width="30" />
        </a>
        <div>
          <div class="body1 my-8">
            {{ item.fields.summary }}
          </div>
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

import { isInternalLink } from '@/mixins/marked/index'

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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
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
