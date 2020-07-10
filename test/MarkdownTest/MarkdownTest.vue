<template>
  <!-- eslint-disable vue/no-v-html -->
  <!-- marked will sanitize the HTML injected -->
  <div v-html="parseMarkdown(markdown)" />
</template>

<script>
import MarkedMixin from '@/mixins/marked'

export default {
  name: 'MarkdownTest',

  mixins: [MarkedMixin],

  data() {
    return {
      markdown: `[go to SPARC](https://sparc.science) \n # This is a heading
      `
    }
  }
}
</script>

<style lang="scss" scoped></style>
