<template>
  <div class="mt-16 similar-datasets-container">
    <div class="header">
      <div v-if="datasetTypeName === 'dataset'" class="p-8 mb-0">Search similar datasets</div>
      <div v-else class="p-8 mb-0">Search similar models/simulations</div>
      <hr />
    </div>
    <div v-loading="isLoadingFacets" class="px-8">
      <div v-if="associatedProject">
        <div class="capitalize mb-8">project:</div>
        <nuxt-link
          :to="associatedProjectLink"
        >
          <u>{{associatedProjectTitle}}</u>
        </nuxt-link>
        <hr class="mt-16"/>
      </div>
      <div class="my-8" v-for="facet in datasetFacetsData" :key="facet.label">
        <div v-if="facet.children && showFacet(facet)">
          <div class="capitalize mb-8">{{facet.label}}:</div>
          <div class="facet-button-container" v-for="child in facet.children" :key="child.id">
            <sparc-tooltip placement="bottom-right" :content="capitalize(child.label)">
              <nuxt-link
                slot="item"
                :to="getSelectedFacetLink(getFacetId(child))"
              >
                <div class="my-2 px-12 facet-button capitalize">
                  {{child.label}}
                </div>
              </nuxt-link>
            </sparc-tooltip> 
          </div>
          <hr class="my-16"/>
        </div>
      </div>
      <div class="mb-16" v-if="contributors">
        <div class="capitalize mb-8">contributors:</div>
        <div
          class="ml-8"
          v-for="contributor in contributors"
          :key="contributor.id"
        >
          <li class="contributor-list">
            <sparc-tooltip placement="bottom-right" :content="getContributorFullName(contributor)">
              <nuxt-link
                slot="item"
                :to="getSelectedContributorLink(contributor)"
              >
                <u>{{getContributorFullName(contributor)}}</u>
              </nuxt-link>
            </sparc-tooltip>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { propOr} from 'ramda'

import { getAlgoliaFacets, facetPropPathMapping } from '../../pages/data/utils'
import createAlgoliaClient from '@/plugins/algolia.js'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)
const EXPERIMENTAL_APPROACH_LABEL = facetPropPathMapping['item.modalities.keyword']

export default {
  name: 'SimilarDatasetsInfoBox',

  data() {
    return {
      allFacetsData: [],
      isLoadingFacets: true,
    }
  },

  props: {
    associatedProject: {
      type: Object,
      default: () => {}
    },
  },

  computed: {
    ...mapState('pages/datasets/datasetId', ['datasetInfo', 'datasetTypeName', 'datasetFacetsData']),
    datasetDoi: function() {
      return propOr('', 'doi', this.datasetInfo)
    },
    showExperimentalApproachFacet: function() {
      return this.datasetTypeName === 'dataset'
    },
    associatedProjectLink: function() {
      const sys = propOr(null, 'sys', this.associatedProject)
      const entryId = propOr(null, 'id', sys)
      return entryId != null ? `/projects/${entryId}` : ''
    },
    associatedProjectTitle: function() {
      const fields = propOr(null, 'fields', this.associatedProject)
      const title = propOr(null, 'title', fields)
      return title ?? ''
    },
    contributors: function() {
      return propOr([], 'contributors', this.datasetInfo)
    },
  },

  created() {
    this.isLoadingFacets = true;
    getAlgoliaFacets(algoliaIndex, facetPropPathMapping).then(data => {
        this.allFacetsData = data
      }).finally(() => {
        this.isLoadingFacets = false
      })
  },
  methods: {
    capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    getFacetId(datasetFacet) {
      const key = datasetFacet.facetPropPath;
      const label = datasetFacet.label;
      if (this.allFacetsData === []) {
        return
      }
      const category = this.allFacetsData.find(facet => facet.key === key);
      if (category === undefined) {
        return
      }
      const correspondingFacet = category.children.find(child => child.label === label)
      return correspondingFacet.id
    },
    getSelectedFacetLink(facetId) {
      return this.datasetTypeName === 'dataset' ?
        `/data?type=dataset&selectedFacetIds=${facetId}` :
        `/data?type=simulation&selectedFacetIds=${facetId}`
    },
    getSelectedContributorLink(contributor) {
      const name = this.getContributorFullName(contributor)
      return this.datasetTypeName === 'dataset' ?
        `/data?type=dataset&q=${name}` :
        `/data?type=simulation&q=${name}`
    },
    showFacet(facet) {
      if (facet.label === EXPERIMENTAL_APPROACH_LABEL && !this.showExperimentalApproachFacet) {
        return false
      }
      return true
    },
    getContributorFullName: function(contributor) {
      const firstName = propOr('', 'firstName', contributor)
      const lastName = propOr('', 'lastName', contributor)
      return `${firstName} ${lastName}`
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.similar-datasets-container {
  border: 1px solid $lineColor1;
  background: white;
}
hr {
  border-top: none;
}
.header {
  font-weight: 500;
}

.facet-button {
  border-radius: 15px;
  max-width: fit-content;
  background-color: #f9f2fc;
  border: 1px solid $purple;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.facet-button-container {
  max-width: fit-content;
  :hover {
    text-decoration: none !important;
  }
}

.capitalize {
  text-transform: uppercase;
}

.contributor-list {
  list-style-type: disc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
