<template>
  <div class="help-card">
    <h3>
      <nuxt-link
        :to="{ name: 'help-helpId', params: { helpId: helpItem.sys.id } }"
      >
        {{ helpItem.fields.title }}
      </nuxt-link>
    </h3>
    <p>{{ helpItem.fields.summary }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {HelpDocument} from "~/pages/help/model";

export default Vue.extend<never, never, never, { helpItem: HelpDocument }>({
  name: 'HelpCard',
  props: {
    helpItem: {
      type: Object,
      default: () => {
        return {
          sys: {},
          fields: {}
        } as HelpDocument
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
</style>
