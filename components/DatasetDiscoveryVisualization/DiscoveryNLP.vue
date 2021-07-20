<template>
  <div v-loading="isLoading" class="">
    <generic-vega
      :dataForChart="dataUsedInChart"
      :elementId="'discovery-nlp-vega'"
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

import GenericVega from '@/components/DatasetDiscoveryVisualization/GenericVega.vue'
import { generateWordCloudSpec } from '@/components/DatasetDiscoveryVisualization/chartUtils.js'
export default {
  name: 'DiscoveryNLP',
  components: {
    GenericVega,
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
  },

  data() {
    return {
      // what we actually send to chart...so we don't have to retrieve from osparc everytime we refresh necessarily
      // ie adds a layer of abstraction from the store, so store stays always in line wiwth osparc data, but we can do what we want in frontend
      dataUsedInChart: {},
      exampleImgURL: "https://ak.picdn.net/shutterstock/videos/29502877/thumb/11.jpg",
      generateSpec: generateWordCloudSpec,
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
      const base = this.$store.state.datasetComparison.osparcResults
      const computed = base && base.outputs.keywords
      return computed
    },
  },

  methods: {
    /**
    * takes the updated data and updates the visualization
    */
    updateVis (osparcDataForChart) {
      console.log("updateing Wordcloud")
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
