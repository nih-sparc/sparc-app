<template>
  <div>
    <a class="heading2 readme-link" :href="doc.url" target="_blank">
      {{ doc.title }}
    </a>
    <p class="truncate" v-html="summary" />
  </div>
</template>

<script>
import { pathOr, isEmpty } from 'ramda'

export default({
  name: 'ReadmeDoc',
  props: {
    doc: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    summary: function() {
      let summary = pathOr('', ['_snippetResult','excerpt', 'value'], this.doc)
      summary = !isEmpty(summary) ?
        summary :
        pathOr('', ['_snippetResult','body', 'value'], this.doc)
      return summary
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.readme-link {
  color: $purple;
}
.truncate {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
