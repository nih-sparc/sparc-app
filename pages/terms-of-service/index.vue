<template>
  <MarkdownPage :copy="copy" />
</template>

<script lang="ts">
import Vue from 'vue';
import MarkdownPage from '~/components/MarkdownPage/MarkdownPage.vue'
import {asyncMarkdown} from "~/components/MarkdownPage/asyncMarkdown";
export default Vue.extend<{ copy: string }, never, never, never>({
  name: 'TermsOfService',

  data() {
    return { copy: '' }
  },

  components: {
    MarkdownPage
  },

  asyncData() {
    return asyncMarkdown(process.env.ctf_terms_id as string, 'termsOfServiceCopy')
  }
})
</script>
