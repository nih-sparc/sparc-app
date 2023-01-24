<template>
  <div>
    {{ userBehaviors }}
  </div>
</template>

<script>

import { propOr } from 'ramda'

export default {
  name: 'UserBehaviors',

  props: {
    metricsData: {
      type: Object,
      default: () => {}
    },
  },

  computed: {
    userBehaviors() {
      return propOr({}, 'userBehaviors', this.metricsData)
    }
  }
}

</script>
