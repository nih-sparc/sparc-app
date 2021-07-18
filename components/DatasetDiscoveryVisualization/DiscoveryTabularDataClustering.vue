<template>
  <div v-loading="isLoading" class="">
    <generic-osparc-vega
      v-if="isVegaLoaded && isVegaEmbedLoaded"
      :osparcData="dataUsedInChart"
      :elementId="DiscoveryTabularDataClusteringVega"
      :exampleImgURL="exampleImgURL"
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


import GenericOsparcVega from '@/components/DatasetDiscoveryVisualization/GenericOsparcVega.vue'
export default {
  name: 'DiscoveryTabularDataClustering',
  components: {
    GenericOsparcVega,
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
      // what we actually send to chart...so we don't have to retrieve from osparc everytime we refresh necessarily
      // ie adds a layer of abstraction from the store, so store stays always in line wiwth osparc data, but we can do what we want in frontend
      dataUsedInChart: {},
      exampleImgURL: "https://www.vertica.com/wp-content/uploads/2019/09/corr_matrix_Titanic.png",
    }
  },

  watch: {
    datasetsInfo: {
      immediate: true,
      handler (values, oldValues) {
        console.log("refreshing visualization...")
        this.refreshVisualization(values)
      }
    },
  },

  computed: {
    osparcDataForChart () {
      // not sure what to do yet
      return this.$store.datasetComparison.osparcResults
    },
  },

  methods: {
    /**
    * takes the updated data and updates the visualization
    */
    updateVis (osparcDataForChart) {
      console.log("updateing vis")
      // updates this, which sends it down to props, triggering a chart refresh
      this.dataUsedInChart = osparcDataForChart
    },

    // receives relevant data (as computed by the computed field) and sets to chart
    async refreshVisualization () {
      this.$emit('loading')

      try {
        const dataForUpdate = this.osparcDataForChart
        this.updateVis(dataForUpdate)

        this.$emit('notLoading')

      } catch (err) {
        console.error(err)
        this.$emit('notLoading')
        
      }

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
