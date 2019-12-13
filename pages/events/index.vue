<template>
    <div class="events-page">
        <div class="header">
            <div class="gradient">
                <el-row type="flex" justify="center">
                <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="18">
                    <div class="breadcrumb">
                        <h3>SPARC Events:</h3> <p>Join the SPARC teams at the following events, conferences and workshops</p>
                    </div>
                </el-col>
                </el-row>
            </div>
        </div>

        <div class="section events">

            <div v-for="(event, index) in events"  
                :key="`${event}-${index}`">
                <event-card :event=event />
            </div> 
        </div>
    </div>
</template>

<script>
import eventCard from "@/components/EventCard/EventCard.vue";
import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
    name: "event-page",
    components: {
        eventCard
    },
    

    asyncData (env) {
        console.log('fetching data ' + process.env.ctf_event_id)
        return Promise.all([
            // fetch all blog posts sorted by creation date
            client.getEntries({
            'content_type': process.env.ctf_event_id,
            order: 'fields.startDate'
            })
        ]).then(([events]) => {
            // return data that should be available
            // in the template
            console.log('returning entries ' + events)
            return {
                events: events.items
            }
        }).catch(console.error)
    },

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

.events {
    margin-left: 32px;
}
</style>