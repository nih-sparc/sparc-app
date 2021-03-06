<template>
  <div class="upcoming-event">
    <div class="upcoming-event__image">
      <img :src="eventImage(event)" :alt="eventAlt(event)" />
      <span>{{ event.fields.eventType }}</span>
    </div>
    <h3>
      <nuxt-link
        :to="{
          name: 'news-and-events-events-id',
          params: { id: event.sys.id }
        }"
      >
        {{ event.fields.title }}
      </nuxt-link>
    </h3>
    <div class="upcoming-event__detail">
      <svg-icon name="icon-calendar" height="16" width="16" />
      <p>{{ eventDate(event) }}</p>
    </div>
    <div v-if="event.fields.location" class="upcoming-event__detail">
      <svg-icon name="icon-map" height="16" width="16" />
      <p>{{ event.fields.location }}</p>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import FormatDate from '@/mixins/format-date'

export default {
  name: 'EventCard',

  mixins: [FormatDate],

  props: {
    event: {
      type: Object,
      default: () => {}
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
     * Get event date range, if there is no end date, default to start date
     * @returns {String}
     */
    eventDate: function(event) {
      const startDate = this.formatDate(event.fields.startDate || '')
      const endDate = this.formatDate(event.fields.endDate || '')
      return startDate === endDate || !endDate
        ? startDate
        : `${startDate} - ${endDate}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.upcoming-event {
  background: #fff;
  border: 1px solid #dbdfe6;
  color: $dark-sky;
  padding: 1em;
  &__image {
    margin-bottom: 1rem;
    padding-top: 100%;
    position: relative;
    img {
      display: block;
      height: auto;
      left: 0;
      position: absolute;
      top: 0;
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
  &__detail {
    align-items: baseline;
    display: flex;
    margin-bottom: 0.625rem;
    &:last-child {
      margin: 0;
    }
    .svg-icon {
      flex-shrink: 0;
      margin-right: 0.5rem;
    }
    p {
      margin: 0;
    }
  }
  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 1rem;
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
