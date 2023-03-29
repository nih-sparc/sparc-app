<template>
  <div class="mt-16 similar-datasets-container">
    <div class="header">
      <div v-if="datasetTypeName === 'dataset'" class="p-8 mb-0">Search related datasets</div>
      <div v-else class="p-8 mb-0">Search related models/simulations</div>
      <hr />
    </div>
    <div v-loading="isLoadingFacets" class="px-8">
      <div v-if="associatedProjects">
        <div class="capitalize">project(s):</div>
        <div class="mt-8" v-for="(project, index) in associatedProjects" :key="index">
          <nuxt-link :to="getProjectLink(project)">
            <u>{{ getProjectTitle(project) }}</u>
          </nuxt-link>
        </div>
        <hr class="mt-16"/>
      </div>
      <div class="my-8" v-for="facet in datasetFacetsData" :key="facet.label">
        <div v-if="facet.children && showFacet(facet)">
          <div class="capitalize mb-8">{{facet.label}}:</div>
          <div class="facet-button-container" v-for="child in facet.children" :key="child.id">
            <sparc-tooltip placement="left-center" :content="capitalize(child.label)" is-repeating-item-content>
              <div class="tooltip-item facet-button my-2 px-12 label2" slot="item">
                <nuxt-link
                  :to="getSelectedFacetLink(getFacetId(child))"
                >
                  <div class="facet-label capitalize">
                    {{child.label}}
                  </div>
                </nuxt-link>
              </div>
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
          <ul class="contributor-list">
            <li>
              <sparc-tooltip placement="left-center" :content="getContributorFullName(contributor)" is-repeating-item-content>
                <div slot="item" class="tooltip-item">
                  <nuxt-link
                    slot="item"
                    :to="getSelectedContributorLink(contributor)"
                  >
                    <u>{{getContributorFullName(contributor)}}</u>
                  </nuxt-link>
                </div>
              </sparc-tooltip>
            </li>
          </ul>
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
import FormatString from '@/mixins/format-string'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)
const EXPERIMENTAL_APPROACH_LABEL = facetPropPathMapping['item.modalities.keyword']

const getPageTypeName = typeFacet => {
  let typeName = 'dataset'
  if (typeFacet === 'scaffold') {
    typeName = 'model'
  } else if (typeFacet === 'computational model') {
    typeName = 'simulation'
  }
  return typeName
}

export default {
  name: 'SimilarDatasetsInfoBox',

  mixins: [ FormatString ],

  data() {
    return {
      allFacetsData: [],
      isLoadingFacets: true,
    }
  },

  props: {
    associatedProjects: {
      type: Array,
      default: () => []
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
    getProjectLink: function(associatedProject) {
      const sys = propOr(null, 'sys', associatedProject)
      const entryId = propOr(null, 'id', sys)
      return entryId != null ? `/projects/${entryId}` : ''
    },
    getProjectTitle: function(associatedProject) {
      const fields = propOr(null, 'fields', associatedProject)
      const title = propOr(null, 'title', fields)
      return title ?? ''
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
      const pageName = getPageTypeName(this.datasetTypeName)
      return `/data?type=${pageName}&selectedFacetIds=${facetId}`
    },
    getSelectedContributorLink(contributor) {
      const name = this.getContributorFullName(contributor)
      const pageName = getPageTypeName(this.datasetTypeName)
      return `/data?type=${pageName}&search=${name}`
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
  color: $purple;
  border: 1px solid $purple;
  cursor: pointer;
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
  padding-left: 18px;
  margin: 0;
}

.facet-label {
  display: contents;
}

.tooltip-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
