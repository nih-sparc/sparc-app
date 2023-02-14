<template>
  <paper
    :text="parseMarkdown(searchPaperText)"
    :button-text="searchPaperCSButton"
    :button-link="'/news-and-events/community-spotlight/submit'"
  />
</template>

<script>
import Paper from '@/components/Paper/Paper.vue'
import createClient from '@/plugins/contentful.js'
import marked from '@/mixins/marked/index'

const client = createClient()

export default {
  name: 'SubmitCommunitySection',

  mixins: [marked],

  components: {
    Paper
  },

  data() {
    return {
      searchPaperText: '',
      searchPaperCSButton: ''
    }
  },

  async fetch() {
    const response = await client.getEntry(process.env.ctf_news_and_events_page_id)
    this.searchPaperCSButton = response.fields.searchPaperCsButton
    this.searchPaperText = response.fields.searchPaperCsText
  }
}
</script>
