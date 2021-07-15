<template>
  <div v-loading="isLoading" class="">
    <discovery-graph-vega 
      v-if="isVegaLoaded && isVegaEmbedLoaded"
    />
    {{ enrichedData }}
  </div>
</template>

<script>
import DiscoveryGraphVega from '@/components/DatasetDiscoveryVisualization/DiscoveryGraphVega.vue'

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
  name: 'DiscoveryGraph',
  components: {
    DiscoveryGraphVega,
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

      return data
    },

    // takes what we get from our frontend server and cleans it up so we can use it
    async cleanResponse (apiResponse, originalDatasetsInfo) {
      console.log("response from our frontend server:", apiResponse)
      const cleaned = apiResponse.enrichedData.map((datum, index) => {
        if (datum == "not-found-in-scicrunch-es-api") {
          // just send original info we got from pennsieve
          const unenrichedData = clone(originalDatasetsInfo[index])
          unenrichedData.enriched = false

          return unenrichedData

        } else {
          datum._source.enriched = true
          return datum._source
        }
      })


      return cleaned
    },

    async refreshVisualization (datasetsInfo) {
      this.$emit('loading')

      try {
        const enrichedData = await this.retrieveFromApi(datasetsInfo)
        // for records not found, use what we had from pennsieve originally
        const cleanedData = await this.cleanResponse(enrichedData, datasetsInfo)

        this.updateVis(cleanedData)

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
