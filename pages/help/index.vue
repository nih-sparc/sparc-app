<template>
    <div class="events-page">
        <div class="header">
            <div class="gradient">
                <el-row type="flex" justify="center">
                <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="18">
                    <div class="breadcrumb">
                        <h3>Support Center:</h3> <p>SPARC Portal Support center with help documents, tutorials, and or relevant information</p>
                    </div>
                </el-col>
                </el-row>
            </div>
        </div>

        
        <div class="section events">

            <div v-for="(event, index) in items"  
                :key="`${event}-${index}`">
                <help-card :item=event />
            </div> 
        </div>


    </div>
</template>

<script>
import helpCard from "@/components/HelpCard/HelpCard.vue";
import createClient from '@/plugins/contentful.js'
import showdown from 'showdown'
import {pathOr} from 'ramda'


const client = createClient()

export default {
    name: "help-page",
    components: {
        helpCard
    },

    computed: {
   
    },

    asyncData (env) {
        console.log('fetching data: ' + process.env.ctf_help_id)
        return Promise.all([
            // fetch all blog posts sorted by creation date
            client.getEntries({
            'content_type': process.env.ctf_help_id,
            'fields': ['title']
            })
        ]).then(([items]) => {
            // return data that should be available
            // in the template
            console.log('returning entries ' + items)
            return {
                items: items.items
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

    .help-section  {
        margin-left: 32px;
        & ::v-deep p {
            margin-bottom: 8px;
        }

        
    }
</style>