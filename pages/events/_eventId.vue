<template>
  <div>
    <div class="header">
      <div class="gradient">
        <el-row type="flex" justify="center">
          <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="18">
            <div class="breadcrumb">
              <h3>{{ event.fields.title }}</h3>
              <p>{{ startDate }} - {{ endDate }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div :key="$route.fullPath" class="event-content">
      <div class="image">
        <event-banner-image :src="bannerUrl" />
      </div>

      <div class="description">
        <h3>Overview</h3>
        <p>{{ event.fields.description }}</p>
      </div>
    </div>

    <div class="section">
      {{ event.fields }}
    </div>
  </div>
</template>

<script>
import createClient from '@/plugins/contentful.js'
import { format, parseISO } from 'date-fns'
import eventBannerImage from '@/components/EventBannerImage/EventBannerImage.vue'
import { pathOr } from 'ramda'

const client = createClient()

export default {
  name: 'EventDetail',

  components: {
    eventBannerImage
  },

  asyncData(env) {
    return Promise.all([
      // fetch all blog posts sorted by creation date
      client.getEntry(env.params.eventId)
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
    bannerUrl: function() {
      return pathOr(
        '',
        ['fields', 'image', 'fields', 'file', 'url'],
        this.event
      )
    },
    startDate: function() {
      return format(parseISO(this.event.fields.startDate), 'MM/dd/yyyy')
    },
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

.event-content {
  display: flex;
  flex-direction: row;
  padding: 24px 16px;
  img {
    display: block;
    width: 200px;
    height: 200px;
  }

  h3: {
    margin-bottom: 8px;
  }

  .image {
    margin: 16px;
  }

  .description {
    max-width: 600px;
  }

  .event-content-wrap {
    margin-left: 16px;
  }
}
</style>
