<template>
  <div>
    <page-hero>
      <h3>{{ event.fields.title }}</h3>
      <p>{{ startDate }} - {{ endDate }}</p>
    </page-hero>

    <div class="page-wrap container">
      <div class="subpage">
        <el-row :gutter="32" type="flex">
          <el-col :xs="24" :md="6">
            <event-banner-image :src="bannerUrl" />
          </el-col>
          <el-col :xs="24" :md="18">
            <template v-if="event.fields.summary">
              <h2>Overview</h2>
              <p>{{ event.fields.summary }}</p>
            </template>
            <p>
              {{ event.fields.eventType }} - SPARC Attendees:
              {{ event.fields.sparcAttendees }}
            </p>
            <template v-if="event.fields.location">
              <h2>Location</h2>
              <p>{{ event.fields.location }}</p>
            </template>
            <template v-if="event.fields.url">
              <h2>Website</h2>
              <p>
                <a :href="event.fields.url" target="_blank">
                  <bf-button>Visit website</bf-button>
                </a>
              </p>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr } from 'ramda'
import { format, parseISO } from 'date-fns'

import eventBannerImage from '@/components/EventBannerImage/EventBannerImage.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'EventDetail',

  components: {
    BfButton,
    eventBannerImage,
    PageHero
  },

  asyncData(ctx) {
    return Promise.all([
      // fetch all blog posts sorted by creation date
      client.getEntry(ctx.route.params.eventId)
    ])
      .then(([events]) => {
        // return data that should be available
        // in the template
        return {
          event: events
        }
      })
      .catch(console.error)
  },

  computed: {
    /**
     * Compute the banner URL for the event
     * @returns {String}
     */
    bannerUrl: function() {
      return pathOr(
        '',
        ['fields', 'image', 'fields', 'file', 'url'],
        this.event
      )
    },
    /**
     * Compute the start date of the event
     * @returns {String}
     */
    startDate: function() {
      return format(parseISO(this.event.fields.startDate), 'MM/dd/yyyy')
    },
    /**
     * Compute the end date of the event
     * @returns {String}
     */
    endDate: function() {
      return format(parseISO(this.event.fields.endDate), 'MM/dd/yyyy')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.header {
  .gradient {
    padding: 1.5em 0;
    color: #f0f2f5;
    background-image: linear-gradient(90deg, #0026ff 0%, #00ffb9 100%);

    .breadcrumb {
      width: 75%;
    }
  }
}
</style>
