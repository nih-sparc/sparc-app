<template>
  <div class="events-page">
    <page-hero>
      <h3>SPARC Events:</h3>
      <p>
        Join the SPARC teams at the following events, conferences and workshops
      </p>
    </page-hero>

    <div class="page-wrap container">
      <div class="subpage">
        <el-row type="flex" justify="center">
          <el-col :row="24">
            <event-card
              v-for="(event, index) in events"
              :key="`${event}-${index}`"
              :event="event"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard/EventCard.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'EventPage',
  components: {
    EventCard,
    PageHero
  },

  asyncData() {
    console.log('fetching data ' + process.env.ctf_event_id)
    return Promise.all([
      // fetch all blog posts sorted by creation date
      client.getEntries({
        content_type: process.env.ctf_event_id,
        order: 'fields.startDate'
      })
    ])
      .then(([events]) => {
        // return data that should be available
        // in the template
        console.log('returning entries ' + events)
        return {
          events: events.items
        }
      })
      .catch(console.error)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.event-card {
  margin-bottom: 2em;
}
</style>
