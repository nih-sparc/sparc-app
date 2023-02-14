<template>
  <paper
    :text="parseMarkdown(searchPaperText)"
    :button-text="searchPaperButton"
    :button-link="'/resources/submit'"
  />
</template>

<script>
import Paper from '@/components/Paper/Paper.vue'
import createClient from '@/plugins/contentful.js'
import marked from '@/mixins/marked/index'

const client = createClient()

export default {
  name: 'SubmitToolSection',

  mixins: [marked],

  components: {
    Paper
  },

  data() {
    return {
      searchPaperText: '',
      searchPaperButton: ''
    }
  },

  async fetch() {
    const response = await client.getEntry(process.env.ctf_tools_and_resources_page_id)
    this.searchPaperButton = response.fields.searchPaperButton
    this.searchPaperText = response.fields.searchPaperText
  }
}
</script>
