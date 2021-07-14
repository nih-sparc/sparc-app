<template>
  <div class="">
    <h3>{{ visualizationType.label }}</h3>
    <div v-loading="isLoading" class="">
      <component
        :is="visualizationComponent"
        :datasetsInfo="datasetsInfo"
      />
    </div>
  </div>
</template>

<script>
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
  propOr,
  pluck
} from 'ramda'
const DiscoveryGraphVisualization = () =>
  import('@/components/DatasetDiscoveryVisualization/DiscoveryGraph.vue')

const visualizationComponents = {
  graph: DiscoveryGraphVisualization,
  // TODO change out when these components are built
  nlp: DiscoveryGraphVisualization,
  // TODO change out when these components are built
  imageCluster: DiscoveryGraphVisualization,
  // TODO change out when these components are built
  tabularDataClustering: DiscoveryGraphVisualization
}

// a wrapper around the various visualizations for the KnowMore tool

export default {
  name: 'DatasetDiscoveryVisualization',

  props: {
    /**
    * what type of visualization this component is for
    *
    */
    visualizationType: {
      type: Object, 
    },

    /**
    * info about each dataset we're comparing
    *
    */
    datasetsInfo: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      isLoading: true,
    }
  },

  computed: {
    /**
     * Compute which component to display based on the type passed down from props
     * @returns {Function}
     */
    visualizationComponent: function() {
      return defaultTo('', visualizationComponents[this.visualizationType])
    },
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
