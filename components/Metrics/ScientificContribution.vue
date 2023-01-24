<template>
  <div>
    {{ scientificContribution }}
  </div>
</template>

<script>

import { propOr } from 'ramda'

export default {
  name: 'ScientificContribution',

  props: {
    metricsData: {
      type: Object,
      default: () => {}
    },
  },

  computed: {
    scientificContribution() {
      return propOr({}, 'scientificContribution', this.metricsData)
    }
  }
}

</script>
