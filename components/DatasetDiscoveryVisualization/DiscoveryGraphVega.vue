<template>
  <div >
    <div >
    (NOTE: Filler Graph)
    </div>
    <div id="discovery-graph-vis">loading...</div>
  </div>
</template>

<script>

// import generateVegaSpec from './graph-spec.testing.js'
import generateVegaSpec from './graph-spec.js'
//import generateVegaSpec from './graph-spec.simple.js'
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
  name: 'DiscoveryGraphVega',

  mounted: function() {
    this.refreshVis()
  },
  watch: {
    graphEntities: {
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
    graphEntities: {
      type: Object,
      default: () => [],
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
      const vegaSpec = clone(generateVegaSpec(this.graphEntities))

      console.log("refreshing vega chart")
      console.log("vega spec", vegaSpec)
      this.isReady = false

      const options = {
        renderer:  'svg',  // renderer (canvas or svg)
        container: '#discovery-graph-vis',   // parent DOM container
        // only for vega embed I believe, not regular vega
        actions: {
          export: true, 
          source: true
        },
        // hover:     true,       // enable hover processing
      }

      // vegaEmbed should be global, pulled from cdn
      // NOTE another way to get around this is to call window from the mounted or beforeMount hooks only. But then we might have trouble when trying to refresh the graph...
      if (vegaEmbed) {
        try {
          const result = await vegaEmbed('#discovery-graph-vis', vegaSpec, options)
          // result.view provides access to the Vega View API
          this.isReady = true
          console.log(result)

        } catch (err) {
          console.error(err)
        }
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
</style>
</script>

