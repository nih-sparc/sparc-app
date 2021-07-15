<template>
  <div >
    <div >
    (NOTE: Filler Graph)
    </div>
    <div id="discovery-graph-vis">loading...</div>
  </div>
</template>

<script>

export default {
  name: 'DiscoveryGraphVega',

  mounted: function() {
    this.refreshVis()
  },
  watch: {
    graphData: {
      immediate: true,
      handler (values, oldValues) {
        this.refreshVis(values)
      }
    },
  },

  props: {
    /**
    * info about each dataset we're comparing
    *
    */
    graphData: {
      type: Object,
      default: () => {{}},
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
    refreshVis () {
      console.log("refreshing vega chart")
      const spec = "https://vega.github.io/vega/examples/bar-chart.vg.json";

      // vegaEmbed should be global, pulled from cdn
      // NOTE another way to get around this is to call window from the mounted or beforeMount hooks only. But then we might have trouble when trying to refresh the graph...
      if (vegaEmbed) {
        vegaEmbed("#discovery-graph-vis", spec)
          // result.view provides access to the Vega View API
          .then(result => {
            this.isReady = true
            console.log(result)
          })
          .catch(console.warn);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
</script>

