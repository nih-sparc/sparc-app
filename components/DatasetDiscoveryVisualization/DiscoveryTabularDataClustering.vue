<template>
  <div v-loading="isLoading" class="">
    <generic-plotly
      v-if="isVegaLoaded && isVegaEmbedLoaded"
      :osparcData="osparcDataForChart"
      :elementId="'discovery-tabular-data-clustering-vega'"
      :generateSpec="generateSpec"
    />
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
  prop,
  propOr,
  pluck,
  uniqBy,
} from 'ramda'


import GenericPlotly from '@/components/DatasetDiscoveryVisualization/GenericPlotly.vue'
import { generateDefaultScatterplotSpec } from '@/components/DatasetDiscoveryVisualization/chartUtils.js'

export default {
  name: 'DiscoveryTabularDataClustering',
  components: {
    GenericPlotly,
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
    // whether chart is loading 
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
      // what we actually send to chart...so we don't have to retrieve from osparc everytime we refresh necessarily
      // ie adds a layer of abstraction from the store, so store stays always in line wiwth osparc data, but we can do what we want in frontend
      dataUsedInChart: {},
      exampleImgURL: "https://www.vertica.com/wp-content/uploads/2019/09/corr_matrix_Titanic.png",
      generateSpec: generateDefaultScatterplotSpec,
    }
  },

  watch: {
  },

  computed: {
    osparcDataForChart () {
      const base = this.$store.state.datasetComparison.osparcResults

      // not sure what to do yet TODO
      return base && {}
    },
  },

  methods: {
    /**
    * takes the updated data and updates the visualization
    */
    // updateVis (osparcDataForChart) {
    //   console.log("updateing vis")
    //   // updates this, which sends it down to props, triggering a chart refresh
    //   this.dataUsedInChart = osparcDataForChart
    // },

    // // receives relevant data (as computed by the computed field) and sets to chart
    // async refreshVisualization () {
    //   this.$emit('loading')

    //   try {
    //     const dataForUpdate = this.osparcDataForChart
    //     this.updateVis(dataForUpdate)

    //     this.$emit('notLoading')

    //   } catch (err) {
    //     console.error(err)
    //     this.$emit('notLoading')
    //     
    //   }

    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
