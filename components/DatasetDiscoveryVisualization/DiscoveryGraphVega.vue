<template>
  <div>
    <div >
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
      default: () => {},
    },
  },

  data() {
    return {
      isReady: false,
    }
  },

  computed: {
    // if no data yet, getting this error: TypeError: Cannot read property 'isString' of undefined. Even if later data comes in, it just messes things up too much already
    // so don't render graph until we're totally ready
    hasData () {
      return this.graphEntities.nodes && this.graphEntities.nodes.length > 0
    }
  },

  methods: {
    // reloads the current data into the chart, refreshing the chart
    async refreshVis () {
      // NOTE !!! The key is that edges will be changed dynamically by the path transform. Need to clone this or something to make sure that links don't get stuck with their original values

      if (!this.hasData) {
        console.log("no data yet, skipping")
        // don't want any errors to throw here, or it will mess things up down the line. So if not data, just wait
        return
      }

      const vegaSpec = clone(generateVegaSpec(this.graphEntities))

      console.log("refreshing vega chart")
      console.log("vega spec", vegaSpec)
      this.isReady = false

      const options = {
        // renderer (canvas or svg) 
        renderer:  'svg',  

        // add a tooltip for allowing on hover stuff
        tooltip: {theme: 'dark'},

        // what to allow in the menu
        actions: {
          export: true, 
          // beacuse it's broken...
          // TODO fix, seems to be from the marks, since commenting those out makes it work. 
          source: false,
          // beacuse it's broken...
          editor: false,
        },
        // not working
        // enable hover processing
        // hover:     true,
      }

      // vegaEmbed should be global, pulled from cdn
      // NOTE another way to get around this is to call window from the mounted or beforeMount hooks only. But then we might have trouble when trying to refresh the graph...
      try {
        // render vega to teh target element
        console.log("trying to render graph vis...")
        const result = await vegaEmbed('#discovery-graph-vis', vegaSpec, options)
        console.log("success render graph vis!")

        // result.view provides access to the Vega View API
        this.isReady = true
        console.log("Full vega spec", result)

        // find out what data actually got into our chart
        const dataUsed = result.vgSpec.data
        console.log("data used for this rendering", {nodes: dataUsed[0].values, edges: dataUsed[1].values})

      } catch (err) {
        console.log("failed to render graph vis...")
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
</style>
</script>

