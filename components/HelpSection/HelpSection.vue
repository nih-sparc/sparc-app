<template>
  <div class="help-section">
    <h2>
      {{ section.fields.title }}
    </h2>
    <div class="section">
      <help-card
        v-for="(item, index) in section.fields.helpDocuments"
        :key="`${item}-${index}`"
        :help-item="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelpCard from '@/components/HelpCard/HelpCard.vue'
import {HelpSection} from "~/pages/help/model";
import {Sys} from "contentful";

export default Vue.extend<never, never, never, { section: HelpSection }>({
  name: 'HelpSection',
  components: {
    HelpCard
  },
  props: {
    section: {
      type: Object,
      default: () => {
        return {
          sys: {},
          fields: {}
        } as HelpSection
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
</style>
