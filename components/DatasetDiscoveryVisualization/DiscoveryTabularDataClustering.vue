<template>
  <div v-loading="!osparcDataForChart" class="">
    <generic-plotly
      v-if="isPlotlyLoaded"
      :osparcData="osparcDataForChart"
      :elementId="'discovery-tabular-data-clustering-vega'"
      :generateSpec="generateSpec"
    />
  	<div class="chart-images" v-loading="!isMatlabJobFinished">
  	  <div class="chart-images-wrapper" v-if="isMatlabJobFinished">
        <div v-for="imageName in generatedImageNames" class="chart-image">
          <img class="" :src="apiImageUrlBase(imageName)" />
        </div>
      </div>
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
  prop,
  propOr,
  pluck,
  uniqBy,
} from 'ramda'


import GenericPlotly from '@/components/DatasetDiscoveryVisualization/GenericPlotly.vue'
import { generateDefaultScatterplotSpec } from '@/components/DatasetDiscoveryVisualization/chartUtils.js'

// a for using just images from example output from matlab jobs
//const usingExampleImages = true

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
    // make sure to not to try to render plotly until loaded
    isPlotlyLoaded: {
      type: Boolean,
      default: false
    },
    isVegaEmbedLoaded: {
      type: Boolean,
      default: false
    },
    // make sure to not to try to render images until matlab job is completed
    isMatlabJobFinished: {
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
      generatedImageNames: [
        "Plots-3.x.png",
				"Plots-PlotID-3.2.png",
				"Plots-PlotID-3.4.png",
				"Plots-PlotID-3.5.png",
				"Plots-PlotID-3.6.png",
				"Plots-PlotID-3.7.png",
				"Plots-PlotID-3.8.png",
				"Plots-PlotID-3.9.png",
				"Plots-PlotID-4.2.png",
				"Plots-PlotID-4.3.png",
				"Plots-PlotID-4.5.png",
				"Plots-PlotID-4.6.png",
				"Plots-PlotID-4.7.png",
				"Plots-PlotID-4.8.png",
				"Plots-PlotID-4.9.png",
				"Plots-PlotID-5.2.png",
				"Plots-PlotID-5.3.png",
				"Plots-PlotID-5.6.png",
				"Plots-PlotID-5.7.png",
				"Plots-PlotID-5.8.png",
				"Plots-PlotID-5.9.png",
      ],
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
    pythonOsparcJobId () {
      const base = this.$store.state.datasetComparison.osparcResults
      return base && base.job_id
    }
  },

  methods: {
    apiImageUrlBase (image_name) { 
      // if using example images, just pull images from the example job id
      // if we start using real job ids, need to pass that down, maybe using the store

      const jobId = this.pythonOsparcJobId
      if (!jobId) {
        return false
      }

      return `${process.env.flask_api_host}/api/results-images/${jobId}/${image_name}`
    },
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
.chart-images {
  // TODO make mobile friendly
  max-width: 100%;
  .chart-images-wrapper {
    .chart-image {
      margin: 1rem;

      img {
        max-width: 100%;
      }
    }
  }
}
</style>
