<template>
  <div class="dataset-discovery-visualization-wrapper">
    <h3>{{ visualizationType.label }}</h3>
    <div class="">
      <component
        :is="visualizationComponent"
        :datasetsInfo="datasetsInfo"
        :isLoading="isLoading"
        :isVegaLoaded="isVegaLoaded"
        :isVegaEmbedLoaded="isVegaEmbedLoaded"
        @loading="setToLoadingState(true)"
        @notLoading="setToLoadingState(false)"
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
const DiscoveryImageCluster = () =>
  import('@/components/DatasetDiscoveryVisualization/DiscoveryImageCluster.vue')
const DiscoveryNLP = () =>
  import('@/components/DatasetDiscoveryVisualization/DiscoveryNLP.vue')
const DiscoveryGraphVisualization = () =>
  import('@/components/DatasetDiscoveryVisualization/DiscoveryGraph.vue')
const DiscoveryTabularDataClustering = () =>
  import('@/components/DatasetDiscoveryVisualization/DiscoveryTabularDataClustering.vue')

const visualizationComponents = {
  graph: DiscoveryGraphVisualization,
  nlp: DiscoveryNLP,
  imageCluster: DiscoveryImageCluster,
  tabularDataClustering: DiscoveryTabularDataClustering,
}

// a wrapper around the various visualizations for the KnowMore tool

export default {
  name: 'DatasetDiscoveryVisualizationWrapper',

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
      isLoading: false,
    }
  },

  computed: {
    /**
     * Compute which component to display based on the type passed down from props
     * @returns {Function}
     */
    visualizationComponent: function() {
      return visualizationComponents[this.visualizationType.type]
    },
  },


  beforeMount: function() {
    this.windowWidth = window.innerWidth
  },

  methods: {
    setToLoadingState (status = false) {
      this.isLoading = status
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
