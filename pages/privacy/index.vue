<template>
  <MarkdownPage :copy="copy" />
</template>

<script lang="ts">
import Vue from 'vue';
import {asyncMarkdown} from "~/components/MarkdownPage/asyncMarkdown";
import MarkdownPage from "~/components/MarkdownPage/MarkdownPage.vue";

export default Vue.extend<{ copy: string }, never, never, never>({
  name: 'PrivacyPolicy',

  data() {
    return { copy: '' }
  },

  components: {
    MarkdownPage
  },

  asyncData() {
    return asyncMarkdown(process.env.ctf_privacy_policy_id as string, 'privacyPolicyCopy')
  }
})
</script>

<style lang="scss" scoped></style>
