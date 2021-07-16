<template>
  <div v-loading="isLoading" class="">
    <discovery-graph-vega 
      v-if="isVegaLoaded && isVegaEmbedLoaded"
      :graphEntities="graphEntities"
    />
    {{ graphEntities }}
    {{ datasetsInfo }}
  </div>
</template>

<script>
import DiscoveryGraphVega from '@/components/DatasetDiscoveryVisualization/DiscoveryGraphVega.vue'
import { 
  elasticsearchRecordToGraphEntities,
  pennsieveRecordToGraphEntities,
}  from './graphUtils.js'

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

// labels to display in graph
const prettyLabels = {
	"hasAffiliation": "has affiliation",
	"affiliation": "Affiliation",
	"person": "Person",
	"organization": "Organization",
	contributedTo: "contributed to",
	isOwnedBy: "is owned by",
	organization: "Organization",
	hasOrganization: "has organization",
	dataset: "Dataset",
	receivedAward: "received award",
	award: "Award",
}


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
      graphEntities: {},
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
    updateVis (graphEntities) {
      console.log("updateing vis")
      // updates this, which sends it down to props, triggering a chart refresh
      this.graphEntities = graphEntities
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
      let nodes = []
      let edges = []

      apiResponse.enrichedData.forEach((datum, index) => {
        let graphEntities
        
        if (datum == "not-found-in-scicrunch-es-api") {
          // just send original info we got from pennsieve
          const unenrichedData = clone(originalDatasetsInfo[index])
          unenrichedData.enriched = false
          graphEntities = pennsieveRecordToGraphEntities(unenrichedData)


        } else {
          datum._source.enriched = true
          graphEntities = elasticsearchRecordToGraphEntities(datum._source)
        }

        // merge into the main arrays
        nodes.push(...graphEntities.nodes)
        edges.push(...graphEntities.edges)
      })

      // removeDuplicates
      nodes = uniqBy(prop('id'), nodes)
      edges = uniqBy(prop('id'), edges)


      // add "index" for all nodes (maybe it's needed after all, having trouble getting it working without this)
      // looks like it might need 
      nodes = nodes.map((n, index) => {
        n.index = index
        n.prettyLabel = prettyLabels[n.label]

        return n
      })
      console.log("edges before mapping to nodes", edges)

      // add some info we'll need for the graph
      edges = edges.map((edge, index) => {
        // reference the index of the source and target nodes. 
        // Have to use the specific keys "source" and "target"
        // - https://vega.github.io/vega/docs/transforms/force/#link
        // - NOTE make sure to do this after we merge edges from all the different datasets, 
        edge.source = nodes.find(n => {
          return n.id == edge.sourceId
        }).index

        edge.target = nodes.find(n => n.id == edge.targetId).index
        
        // for debugging only
        edge.targetIndex = edge.target
        edge.sourceIndex = edge.source
		    edge.prettyLabel = prettyLabels[edge.label]


        return edge
      })

      return {
        nodes, 
        edges, 
      } 
    },

    async refreshVisualization (datasetsInfo) {
      this.$emit('loading')

      try {
        this.enrichedData = await this.retrieveFromApi(datasetsInfo)
        // for records not found, use what we had from pennsieve originally
        const graphEntities = await this.cleanResponse(this.enrichedData, datasetsInfo)
        console.log("now sending graph entities to vega component")

        this.updateVis(graphEntities)

        this.$emit('notLoading')
        return graphEntities

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
