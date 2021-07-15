<template>
  <div v-loading="isLoading" class="">
    {{ enrichedData }}
  </div>
</template>

<script>
export default {
  name: 'DiscoveryGraph',

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
      enrichedData: {},
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
  },

  methods: {
    /**
    * takes the updated data and updates the visualization
    */
    updateVis (enrichedData) {
      // TODO eventually this will do more than set this var, will actually create the chart
      console.log("updateing vis")
      this.enrichedData = enrichedData
    },

    /**
    * takes the dataset info and queries our express server, returning the enriched data we'll need to create the visualization
    */
    async retrieveFromApi (datasetsInfo) {
      const { data } = await this.$axios.get("/sparc-app/dataset-discovery-api/enrich-data-for-datasets", {
        params: {
          // send just the DOI id we retrieved from pennsieve api
          datasetDOIIds: datasetsInfo.map(d => d.doi)
        }
      })

      console.log("response from our frontend server:", data)
      return data
    },

    async refreshVisualization (datasetsInfo) {
      this.$emit('loading')

      try {
        const enrichedData = await this.retrieveFromApi(datasetsInfo)
        this.updateVis(enrichedData)

        return enrichedData

      } catch (err) {
        console.error(err)
        
      } finally {
        this.$emit('notLoading')
      }

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
