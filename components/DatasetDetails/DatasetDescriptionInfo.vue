<template>
  <div class="dataset-description-info">
    <div
      v-loading="loadingMarkdown"
      class="col-xs-12 description-container"
      v-html="parsedMarkdown"
    />
  </div>
</template>

<script>
import marked from 'marked'

marked.setOptions({
  sanitize: true
})
export default {
  name: 'DatasetDescriptionInfo',

  props: {
    loadingMarkdown: {
      type: Boolean,
      default: false
    },
    markdown: {
      type: String,
      default: ''
    }
  },

  computed: {
    /**
     * Parses the markdown text
     */
    parsedMarkdown: function() {
      return marked(this.markdown)
    }
  }
}
</script>

<style lang="scss" scoped></style>
