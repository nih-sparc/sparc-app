<template>
    <div class="events-page">
        <div class="header">
            <div class="gradient">
                <el-row type="flex" justify="center">
                <div class="search">
                    <el-row type="flex" justify="center">
                        <!-- <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="18"> -->
                        <HelpSearchControls
                            :search-on-load="true"
                            submit-text="Go"
                            @query="onSearchQuery"
                        />
                        <!-- </el-col> -->
                    </el-row>
                </div>    
                <!-- <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="18">
                    <div class="breadcrumb">
                        <h3>{{ event.fields.title  }}</h3> <p>{{ event.fields.summary }}</p>
                    </div>
                </el-col> -->
                </el-row>
            </div>
        </div>


        <div class="help-section"> 
            <div class="header">
                <h2>{{ event.fields.title  }}</h2> 
                <div class="summary">{{ event.fields.summary }}</div>
                <div class="updated"><i>Updated at: {{ updateDate }} </i></div>
            </div>
            <div class="content" v-html="outputHtml"></div>
        </div>


    </div>
</template>

<script>
import eventCard from "@/components/EventCard/EventCard.vue";
import createClient from '@/plugins/contentful.js'
import { format, formatDistance, formatRelative, subDays, parseISO } from 'date-fns'
import showdown from 'showdown'
import {pathOr} from 'ramda'
import HelpSearchControls from "@/components/help-search-controls/HelpSearchControls.vue";



const client = createClient()

export default {
    name: "event-page",
    components: {
        eventCard,
        HelpSearchControls
    },

    computed: {
        converter () {
            // converter instance of showdown
            const converter = new showdown.Converter()
            converter.setFlavor('github')
            return converter
        },

        htmlContent () {
            return pathOr('',['fields','helpContent'], this.event)
        },

        outputHtml () {
            return this.converter ? this.converter.makeHtml(this.htmlContent) : ''
        },
        updateDate: function() {
            return format(parseISO(this.event.sys.updatedAt),'MM/dd/yyyy')
        },
        
    },
    

    asyncData (env) {
        console.log('fetching data: ' + process.env.ctf_help_id)
        return Promise.all([
            client.getEntry(env.params.eventId)
        ]).then(([events]) => {
            return {
                event: events
            }
        }).catch(console.error)
    },

    methods: {
        onSearchQuery: function(terms) {
            return 0
        },
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

        .search {
            width:80%
        }

    }

    .help-section  {
        color: $vestibular;
        margin-top: 32px;
        margin: 24px auto;
        width: 80%;
        background-color: #FFF;
        padding: 16px 120px;
        border-radius: 16px;
        max-width: 900px;
        
        .content {
            & ::v-deep {
                color: $vestibular
            }
            & ::v-deep p {
                margin-bottom: 8px;
            }
            & ::v-deep img {
                width:100%;
                margin: 5px 0
            }
        }

        .header {
            margin-bottom: 48px;
            h2 {
                color:$vagus;
            }
            .summary {
                font-size: 1.1em;
                color: grey;
                margin-bottom: 8px;
            }

            .updated {
                color: #AAA
            }
        }

        
    }
</style>