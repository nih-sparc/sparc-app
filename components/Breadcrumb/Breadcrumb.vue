<template>
  <div class="p-12 breadcrumb nav3">
    <div>
      <template v-for="item in breadcrumb">
        <nuxt-link :key="item.label" :to="item.to">
          {{ item.label }}
        </nuxt-link>
        >
      </template>
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Methods, Props } from './model'

export default Vue.extend<never, Methods, never, Props>({
  name: 'Breadcrumb',

  props: {
    breadcrumb: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
})
</script>

<style lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.breadcrumb {
  background: $lineColor2;
  height: fit-content;
  a {
    text-decoration: none;
    color: $darkBlue;
  }
}
</style>
