<template>
  <div class="help-card">
    <h3>
      <nuxt-link class="help-link"
        :to="{ name: 'help-helpId', params: { helpId: helpItem.sys.id } }"
      >
        {{ helpItem.fields.title || '' }}
      </nuxt-link>
    </h3>
    <p>{{ helpItem.fields.summary || '' }}</p>
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
.help-card {
  h3 {
    margin-bottom: 0;
  }
}
.help-link {
  color: $median;
  font-size: 24px;
}
.help-link:not(:hover) {
  text-decoration: none;
}
</style>
