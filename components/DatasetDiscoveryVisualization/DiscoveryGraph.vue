atemplate>
  <div v-loading="isLoading" class="">
    <discovery-graph-vega 
      v-if="isVegaLoaded && isVegaEmbedLoaded"
      :graphEntities="graphEntities"
    />
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
      const url = process.env.portal_api + "/sparc-app/dataset-discovery-api/enrich-data-for-datasets"
      console.log("url", url)
      console.log("process.env.portal_api", process.env.portal_api)
      const { data } = await this.$axios.get(url, {
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
        
        if (datum.foundStatus == "not-found-in-scicrunch-es-api") {
          // just send original info we got from pennsieve
          console.log("no es for this one", datum.doiID)
          const correspondingRecord = originalDatasetsInfo.find(info => info.doi == datum.doiID)
          const unenrichedData = clone(correspondingRecord)

          unenrichedData.enriched = false
          graphEntities = pennsieveRecordToGraphEntities(unenrichedData)


        } else {
          datum._source.enriched = true
          graphEntities = elasticsearchRecordToGraphEntities(datum._source)
        }

        // add unique ids for all edges, to identify the edges
        // need to do this whether or not data was enriched
        graphEntities.edges = graphEntities.edges.map(e => {
          e.id = `${e.sourceId}->${e.targetId}`
          return e
        })

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
        n.prettyTitle = `${n.prettyLabel}: ${n.name}`
        // truncate
        if (n.prettyTitle.length > 25) {
          n.prettyTitle = `${n.prettyTitle.substring(0, 25)}...`
        }

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
        edge.prettyTitle = `${edge.prettyLabel}: ${edge.name}`


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
