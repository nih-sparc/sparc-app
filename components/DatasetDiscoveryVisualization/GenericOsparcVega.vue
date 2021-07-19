<template>
  <div class="osparc-chart-wrapper">
    <div v-if="exampleImgURL" class="mock-data-image-wrapper">
      <img class="mock-data-image" :src="exampleImgURL" />
    </div>

    <div v-if="!exampleImgURL" :id="elementId"></div>
  </div>
</template>

<script>

// This is the chart to use for all the osparc related charts


// following this: https://vega.github.io/vega/examples/force-directed-layout/
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

export default {
  name: 'GenericOsparcScatterplot',

  mounted: function() {
    this.refreshVis()
  },
  watch: {
    osparcData: {
      immediate: true,
      handler (values, oldValues) {
        this.refreshVis(values)
      }
    },
  },

  props: {
    /**
    * info about each dataset we're comparing
    * - has two keys, nodes nad edges
    * - keep it one prop, since they should always be sent together, and so triggers / watchers know which one prop to watch
    *
    */
    osparcData: {
      type: Object,
      default: () => [],
    },
    elementId: {
      type: String,
    },
    exampleImgURL: {
      type: String,
    },
    // expected to return obj with two keys: data and options, for first and second args to plotly respectively
    generateScatterplotSpec: {
      type: Function,
    },
  },

  data() {
    return {
      isReady: false,
    }
  },

  computed: {
  },

  methods: {
    // reloads the current data into the chart, refreshing the chart
    async refreshVis () {
      // NOTE !!! The key is that edges will be changed dynamically by the path transform. Need to clone this or something to make sure that links don't get stuck with their original values
      if (this.exampleImgURL) {
        console.log("sending mock image instead for ", this.elementId)
        return
      }

      const plotlySpec =  this.generateScatterplotSpec(this.osparcData)

      console.log("refreshing Plotly chart")
      console.log("plotly spec", plotlySpec)
      this.isReady = false

      try {
        // render vega to teh target element
        const element = document.getElementById(this.elementId)
        const result = Plotly.newPlot(element, plotlySpec.data, plotlySpec.options)

        // result.view provides access to the Scatterplot View API
        this.isReady = true

      } catch (err) {
        console.error(err)
      }


      // if using vega view without vega embed
      // console.log(vegaSpec)
      // let view = new vega.View(vega.parse(vegaSpec), options)
      // view.runAsync();
    }
  }
}
</script>

<style lang="scss" scoped>
.osparc-chart-wrapper {
  min-height: 300px;

}
</style>
</script>

