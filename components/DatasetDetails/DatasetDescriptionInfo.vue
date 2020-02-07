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

<style lang="scss" scoped>
.dataset-description-info {
  // Markdown styles
  .description-container {
    color: #000;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 92px;

    h1,
    p,
    h2,
    h3,
    blockquote,
    h4,
    pre {
      max-width: 616px;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      margin: 0 0 8px;
    }

    h1 {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
    }

    p {
      margin-bottom: 16px;
    }

    img {
      height: auto;
      max-width: 170%;
      margin-bottom: 20px;
      flex-basis: 50%;
      margin-top: 24px;
    }

    h2 {
      font-size: 24px;
      font-weight: bold;
      line-height: 32px;
    }

    h3 {
      font-size: 20px;
      font-weight: bold;
      line-height: 24px;
      letter-spacing: 0px;
    }

    h4 {
      font-size: 16px;
      font-weight: bold;
      line-height: 24px;
      text-transform: uppercase;
      letter-spacing: 0px;
    }

    ul {
      margin: 0 0 16px;
      padding: 0 0 0 18px;
    }

    blockquote {
      font-weight: normal;
      line-height: 24px;
      font-size: 16px;
      border-left: 8px solid #2760ff;
      margin-left: 0;

      p {
        margin-left: 16px;
      }
    }
    pre {
      background-color: #f1f1f3;
      line-height: 24px;
      padding: 16px;

      code {
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
}
</style>
