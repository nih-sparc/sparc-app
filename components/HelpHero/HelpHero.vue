<template>
  <page-hero justify="left">
    <h2>{{ title }}</h2>
    <p>
      {{ summary }}
    </p>
    <HelpSearchControls />
  </page-hero>
</template>

<script lang="ts">
import Vue from 'vue';
import HelpSearchControls from "~/components/help-search-controls/HelpSearchControls.vue";
import PageHero from "~/components/PageHero/PageHero.vue";

export default Vue.extend<never, never, never, { title: string, summary: string }>({
  name: 'HelpHero',

  props: {
    title: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
  },

  components: {
    HelpSearchControls,
    PageHero
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.page-hero {
  background-color: $navy;
  background-image: none;
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}
::v-deep h2 {
  font-size: 1.5em;
  font-weight: 500;
  line-height: 2rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 2rem;
  }
}
</style>