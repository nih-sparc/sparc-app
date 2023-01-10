<template>
  <paper
    :text="parseMarkdown(searchPaperText)"
    :button-text="searchPaperNEButton"
    :button-link="'/news-and-events/submit'"
  />
</template>

<script>
import Paper from '@/components/Paper/Paper.vue'
import createClient from '@/plugins/contentful.js'
import marked from '@/mixins/marked/index'

const client = createClient()

export default {
  name: 'SubmitNewsSection',

  mixins: [marked],

  components: {
    Paper
  },

  data() {
    return {
      searchPaperText: '',
      searchPaperNEButton: ''
    }
  },

  async fetch() {
    const response = await client.getEntry(process.env.ctf_news_and_events_page_id)
    console.log(response.fields)
    this.searchPaperNEButton = response.fields.searchPaperNeButton
    this.searchPaperText = response.fields.searchPaperText
  }
}
</script>
