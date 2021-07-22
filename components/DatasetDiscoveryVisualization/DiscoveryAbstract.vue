<template>
  <div v-loading="isLoading || !osparcDataForChart" class="">
    {{ osparcDataForChart }}
  </div>
</template>

<script>
import DiscoveryGraphVega from '@/components/DatasetDiscoveryVisualization/DiscoveryGraphVega.vue'
import { 
  elasticsearchRecordToGraphEntities,
  pennsieveRecordToGraphEntities,
}  from './graphUtils.js'

import {
  assocPath,
  clone,
  compose,
  defaultTo,
  equals,
  flatten,
  find,
  filter,
  head,
  mergeLeft,
  pathOr,
  propEq,
  prop,
  propOr,
  pluck,
  uniqBy,
} from 'ramda'


export default {
  name: 'DiscoveryGraph',
  components: {
  },

  props: {
    /**
    * info about each dataset we're comparing
    *
    */
    datasetsInfo: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    // make sure to not to try to render vega until loaded
    isVegaLoaded: {
      type: Boolean,
      default: false
    },
    isVegaEmbedLoaded: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
    }
  },

  watch: {
  },

  computed: {
    osparcDataForChart () {
      const base = this.$store.state.datasetComparison.osparcResults
      const computed = base && base.outputs.output1.abstract

      return computed
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
