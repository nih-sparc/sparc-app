<template>
  <div class="page-data">
    <breadcrumb :breadcrumb="breadcrumb" :title="searchType.label" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Browse categories
        </h3>
        <ul class="search-tabs">
          <li v-for="type in searchTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.type === $route.query.type }"
              :to="{
                name: 'data',
                query: {
                  ...$route.query,
                  type: type.type,
                }
              }"
            >
              {{ type.label }}
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div class="search-bar__container">
        <h5>
          Search within category
        </h5>
        <search-controls-contentful
          class="search-bar"
          placeholder="Enter search criteria"
          :path="$route.path"
          showSearchText
        />
      </div>
    </div>
    <div class="container">
      <el-row :gutter="32" type="flex">
        <el-col :span="24">
          <el-row :gutter="32">
            <client-only>
              <el-col
                v-if="searchType.type === 'dataset' || searchType.type === 'model' || searchType.type === 'simulation'"
                class="facet-menu"
                :sm="24"
                :md="8"
                :lg="6"
              >
                <dataset-facet-menu
                  :facets="facets"
                  :visible-facets="visibleFacets"
                  @selected-facets-changed="onPaginationPageChange(1)"
                  @hook:mounted="facetMenuMounted"
                  ref="datasetFacetMenu"
                />
              </el-col>
              <el-col
                v-if="searchType.type === 'projects'"
                class="facet-menu"
                :sm="24"
                :md="8"
                :lg="6"
              >
                <projects-facet-menu
                  :anatomicalFocusFacets="projectsAnatomicalFocusFacets"
                  :fundingFacets="projectsFundingFacets"
                  @projects-selections-changed="onPaginationPageChange(1)"
                  @hook:mounted="facetMenuMounted"
                  ref="projectsFacetMenu"
                />
              </el-col>
              <el-col
                :sm="searchColSpan('sm')"
                :md="searchColSpan('md')"
                :lg="searchColSpan('lg')"
              >
                <div class="search-heading">
                  <p v-show="!isLoadingSearch && searchData.items.length">
                    {{ searchData.total }} Results | Showing
                    <pagination-menu
                      :page-size="searchData.limit"
                      @update-page-size="updateDataSearchLimit"
                    />
                  </p>
                  <span v-if="searchType.type !== 'projects' && searchData.items.length" class="label1">
                    Sort
                    <sort-menu
                      :options="algoliaSortOptions"
                      :selected-option="selectedAlgoliaSortOption"
                      @update-selected-option="onAlgoliaSortOptionChange"
                    />
                  </span>
                  <span v-else-if="searchType.type == 'projects'" class="label1">
                    Sort
                    <sort-menu
                      :options="projectsSortOptions"
                      :selected-option="selectedProjectsSortOption"
                      @update-selected-option="onProjectsSortOptionChange"
                    />
                  </span>
                </div>
                <div v-loading="isLoadingSearch" class="table-wrap">
                  <p v-if="searchFailed" class="search-error">
                    Sorry, the search engine has encountered an unexpected
                    error, please try again later.
                  </p>
                  <component
                    v-else
                    :is="searchResultsComponent"
                    :table-data="tableData"
                    :title-column-width="titleColumnWidth"
                  />

                  <!-- Alternative search suggestions -->
                  <div v-if="searchHasAltResults" class="mt-24">
                    <template v-if="searchData.total === 0">
                      No results were found for <strong>{{ searchType.label }}</strong>.
                    </template>
                    The following results were discovered for the other categories:
                    <br />
                    <br />
                    <template v-for="dataType in dataTypes">
                      <dd v-if="resultCounts[dataType] > 0 && dataType !== 'projects'" :key="dataType">
                        <nuxt-link
                          :to="{
                            name: 'data',
                            query: {
                              ...$route.query,
                              type: dataType
                            }
                          }"
                        >
                          {{ resultCounts[dataType] }} result{{
                            resultCounts[dataType] > 1 ? 's' : ''
                          }}
                        </nuxt-link>
                        - {{ humanReadableDataTypesLookup[dataType] }}
                      </dd>
                    </template>
                  </div>
                </div>
                <div class="search-heading">
                  <p v-if="!isLoadingSearch && searchData.items.length">
                    {{ searchHeading }} | Showing
                    <pagination-menu
                      :page-size="searchData.limit"
                      @update-page-size="updateDataSearchLimit"
                    />
                  </p>
                  <pagination
                    v-if="searchData.limit < searchData.total"
                    :selected="curSearchPage"
                    :page-size="searchData.limit"
                    :total-count="searchData.total"
                    @select-page="onPaginationPageChange"
                  />
                </div>
              </el-col>
            </client-only>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  clone,
  compose,
  defaultTo,
  find,
  head,
  mergeLeft,
  pathOr,
  propEq,
  propOr
} from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import SortMenu from '@/components/SortMenu/SortMenu.vue'
import SearchControlsContentful from '@/components/SearchControlsContentful/SearchControlsContentful.vue'
import DatasetFacetMenu from '~/components/FacetMenu/DatasetFacetMenu.vue'
import ProjectsFacetMenu from '~/components/FacetMenu/ProjectsFacetMenu.vue'
import { facetPropPathMapping, getAlgoliaFacets, HIGHLIGHT_HTML_TAG } from './utils'
import createClient from '@/plugins/contentful.js'
import createAlgoliaClient from '@/plugins/algolia.js'
const client = createClient()
const algoliaClient = createAlgoliaClient()

const ProjectSearchResults = () =>
  import('@/components/SearchResults/ProjectSearchResults.vue')
const DatasetSearchResults = () =>
  import('@/components/SearchResults/DatasetSearchResults.vue')

const searchResultsComponents = {
  dataset: DatasetSearchResults,
  projects: ProjectSearchResults,
  simulation: DatasetSearchResults,
  model: DatasetSearchResults
}

const searchTypes = [
  {
    label: 'Datasets',
    type: 'dataset',
    dataSource: 'algolia'
  },
  {
    label: 'Anatomical Models',
    type: 'model',
    dataSource: 'algolia'
  },
  {
    label: 'Computational Models',
    type: 'simulation',
    dataSource: 'algolia'
  },
  {
    label: 'Projects',
    type: 'projects',
    dataSource: 'contentful'
  }
]

const algoliaSortOptions = [
  {
    label: 'Published (desc)',
    id: 'newest',
    algoliaIndexName: process.env.ALGOLIA_INDEX_PUBLISHED_TIME_DESC
  },
  {
    label: 'Published (asc)',
    id: 'oldest',
    algoliaIndexName: process.env.ALGOLIA_INDEX_PUBLISHED_TIME_ASC
  },
  {
    label: 'A-Z',
    id: 'alphabatical',
    algoliaIndexName: process.env.ALGOLIA_INDEX_ALPHABETICAL_A_Z
  },
  {
    label: 'Z-A',
    id: 'reverseAlphabatical',
    algoliaIndexName: process.env.ALGOLIA_INDEX_ALPHABETICAL_Z_A
  },
]

const projectsSortOptions = [
  {
    label: 'A-Z',
    id: 'alphabatical',
    sortOrder: 'fields.title'
  },
  {
    label: 'Z-A',
    id: 'reverseAlphabatical',
    sortOrder: '-fields.title'
  },
]

const searchData = {
  limit: 10,
  skip: 0,
  items: [],
}

export default {
  name: 'DataPage',

  components: {
    Breadcrumb,
    PageHero,
    DatasetFacetMenu,
    SearchControlsContentful,
    ProjectsFacetMenu,
    SortMenu
  },

  mixins: [],

  async asyncData() {
    let projectsAnatomicalFocusFacets = []
    let projectsFundingFacets = []
    await client.getEntries({
        content_type: 'awardSection',
      })
      .then(async response => {
        let facetData = []
        const items = propOr([], 'items', response)
        items.forEach(item => {
          const label = pathOr('', ['fields','title'], item)
          facetData.push({
            label: label,
            id: label,
          })
        })
        projectsAnatomicalFocusFacets = facetData
      })
      await client.getEntries({
        content_type: 'program',
      })
      .then(async response => {
        let facetData = []
        const items = propOr([], 'items', response)
        items.forEach(item => {
          const label = pathOr('', ['fields','name'], item)
          facetData.push({
            label: label,
            id: label,
          })
        })
        projectsFundingFacets = facetData
      })
    return {
      projectsAnatomicalFocusFacets,
      projectsFundingFacets
    }
  },

  head() {
    return {
      title: propOr("", "label", this.breadcrumb[this.breadcrumb.length - 1]),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: propOr("", "label", this.breadcrumb[this.breadcrumb.length - 1]),
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Browse datasets'
        },
      ]
    }
  },

  data: () => {
    return {
      algoliaIndex: algoliaClient.initIndex(process.env.ALGOLIA_INDEX_PUBLISHED_TIME_DESC),
      selectedAlgoliaSortOption: algoliaSortOptions[0],
      algoliaSortOptions,
      selectedProjectsSortOption: projectsSortOptions[0],
      projectsSortOptions,
      searchQuery: '',
      facets: [],
      dataTypes: ['dataset', 'simulation', 'model', 'projects'],
      humanReadableDataTypesLookup: {
        dataset: 'Datasets',
        model: 'Anatomical Models',
        simulation: 'Computational Models',
      },
      resultCounts: {
        model: 0,
        dataset: 0,
        simulation: 0,
      },
      searchHasAltResults: false,
      visibleFacets: {},
      searchTypes,
      searchData: clone(searchData),
      isLoadingSearch: false,
      searchFailed: false,
      isSearchMapVisible: false,
      latestSearchTerm: '',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          to: {
            name: 'data',
            query: {
              type: 'dataset'
            }
          },
          label: 'Data & Models'
        },
      ],
      titleColumnWidth: 300,
      windowWidth: ''
    }
  },

  computed: {
    /**
     * Compute search type
     * @returns {String}
     */
    searchType: function() {
      const searchTypeQuery = pathOr('', ['query', 'type'], this.$route)
      const searchType = find(propEq('type', searchTypeQuery), this.searchTypes)

      return defaultTo(head(this.searchTypes), searchType)
    },

    tableData: function() {
      return propOr([], 'items', this.searchData)
    },

    /**
     * Compute which search results component to display based on the type of search
     * @returns {Function}
     */
    searchResultsComponent: function() {
      return defaultTo('', searchResultsComponents[this.$route.query.type])
    },

    /**
     * Compute the current search page based off the limit and the offset
     */
    curSearchPage: function() {
      return this.searchData.skip / this.searchData.limit + 1
    },

    /**
     * Compute the search heading
     * This data could be set at a specific time, such as when the active
     * tab is set
     * @returns {String}
     */
    searchHeading: function() {
      const query = pathOr('', ['query', 'search'], this.$route)

      const searchTypeLabel = compose(
        propOr('', 'label'),
        find(propEq('type', this.$route.query.type))
      )(this.searchTypes)

      let searchHeading = `${this.searchData.total} ${searchTypeLabel}`

      return query === '' ? searchHeading : `${searchHeading} for “${query}”`
    },

    search: function() {
      return this.$route.query.search || ''
    },

    /**
     * True if user is on a small screen (mobile)
     * @returns {Boolean}
     */
    isMobile: function() {
      return this.windowWidth <= 500
    }
  },

  watch: {
    '$route.query.type': function(val) {
      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      if (!this.$route.query.type) {
        const firstTabType = compose(propOr('', 'type'), head)(searchTypes)
        this.$router.replace({ query: { type: firstTabType } })
      } else {
        this.searchData = clone(searchData)
        this.fetchResults()
      }
    },

    '$route.query.search': {
      handler: function() {
        this.searchQuery = this.$route.query.search
        this.fetchResults()
      },
      immediate: true
    },

    selectedAlgoliaSortOption: function(option) {
      this.algoliaIndex = algoliaClient.initIndex(option.algoliaIndexName)
    }
  },

  beforeMount: function() {
    this.windowWidth = window.innerWidth
  },
  /**
   * Check the searchType param in the route and set it if it doesn't exist
   * Shrink the title column width if on mobile
   */
  mounted: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(searchTypes)
      this.$router.replace({ query: { type: firstTabType } })
    } else {
      /**
       * Set the searchData from query params
       * Need to convert skip and limit from strings to numbers
       */
      const queryParams = {
        skip: Number(this.$route.query.skip || searchData.skip),
        limit: Number(this.$route.query.limit || searchData.limit),
        search: this.$route.query.search || ''
      }

      this.searchData = { ...this.searchData, ...queryParams }
    }
    if (window.innerWidth <= 768) this.titleColumnWidth = 150
    window.onresize = () => this.onResize(window.innerWidth)
    getAlgoliaFacets(this.algoliaIndex, facetPropPathMapping).then(data => this.facets = data).finally(() => {
      this.fetchResults()
    })
  },

  methods: {
    /**
     * Update search limit based on pagination number selection
     * @param {Number} limit
     */
    updateDataSearchLimit: function(limit) {
      this.searchData.skip = 0

      const newLimit = limit === 'View All' ? this.searchData.total : limit

      this.searchData.limit = newLimit
      this.$router.replace({
        query: { ...this.$route.query, limit: newLimit, skip: 0 }
      })
      this.fetchResults()
    },

    /**
     * Figure out which source to fetch results from based on the
     * type of search
     */
    fetchResults: function() {
      const source = propOr('contentful', 'dataSource', this.searchType)

      const searchSources = {
        contentful: this.fetchFromContentful,
        algolia: this.fetchFromAlgolia
      }

      if (typeof searchSources[source] === 'function') {
        this.$nextTick(() => searchSources[source]())
      }
    },

    facetMenuMounted: function() {
      this.fetchResults()
    },

    /**
     * Get Search results
     * This is using fetch from the Algolia API
     */
    fetchFromAlgolia: function() {
      this.isLoadingSearch = true
      this.searchFailed = false
      const query = this.$route.query.search

      const searchType = pathOr('dataset', ['query', 'type'], this.$route)
      const datasetsFilter =
        searchType === 'simulation' ? '(NOT item.types.name:Dataset AND NOT item.types.name:Scaffold)' 
          : searchType === 'model' ? '(NOT item.types.name:Dataset AND item.types.name:Scaffold)' 
          : "item.types.name:Dataset"

      /* First we need to find only those facets that are relevant to the search query.
       * If we attempt to do this in the same search as below than the response facets
       * will only contain those specified by the filter */
        this.latestSearchTerm = query     
        this.algoliaIndex
          .search(query, {
            facets: ['*'],
            filters: `${datasetsFilter}`
          })
          .then(response => {
            this.visibleFacets = response.facets
          })
          .catch(() => {
            this.isLoadingSearch = false
            this.searchFailed = true
          })
          .finally(() => {
            var filters =  this.$refs.datasetFacetMenu?.getFilters()
            filters = filters === undefined ? 
              `${datasetsFilter}` : 
              filters + ` AND ${datasetsFilter}`

            this.algoliaIndex
              .search(query, {
                facets: ['*'],
                hitsPerPage: this.searchData.limit,
                page: this.curSearchPage - 1,
                filters: filters,
                attributesToHighlight: [
                  'item.name',
                  'item.description',
                  'item.modalities',
                  'anatomy.organ',
                  'organisms.primary.species.name'
                ],
                highlightPreTag: `<${HIGHLIGHT_HTML_TAG}>`,
                highlightPostTag: `</${HIGHLIGHT_HTML_TAG}>`
              })
              .then(response => {
                const searchData = {
                  items: response.hits,
                  total: response.nbHits
                }
                this.searchData = mergeLeft(searchData, this.searchData)
                this.isLoadingSearch = false

                // Update alternative search results
                this.alternativeSearchUpdate()

                // update facet result numbers
                /*for (const [key, value] of Object.entries(this.visibleFacets)) {
                  if ( (this.$refs.datasetFacetMenu?.getLatestUpdateKey() === key && !this.$refs.datasetFacetMenu?.hasKeys()) || (this.$refs.datasetFacetMenu?.getLatestUpdateKey() !== key) ){
                    for (const [key2, value2] of Object.entries(value)) {
                      let maybeFacetCount = pathOr(null, [key, key2], response.facets)
                      if (maybeFacetCount) {
                        this.visibleFacets[key][key2] = response.facets[key][key2]
                      } else {
                        this.visibleFacets[key][key2] = 0
                      }
                    }
                  }
                }*/
              })
              .catch(() => {
                this.isLoadingSearch = false
                this.searchFailed = true
              })
          }) 
    },

    // alternaticeSearchUpdate: Updates this.resultCounts which is used for displaying other search options to the user
    //    when a search returns 0 results
    alternativeSearchUpdate: function() {
      const searchTypeInURL = pathOr('dataset', ['query', 'type'], this.$route) // Get current data type

      this.searchHasAltResults = false
      for (let key in this.resultCounts) { // reset reults list
        this.resultCounts[key] = 0
      }
      let altSearchTypes = this.dataTypes.filter(e => e !== searchTypeInURL) // Remove from list of data types

      altSearchTypes.forEach(type => {  // Search on each data type remaining
        this.searchContentsCheck(type)
      })
    },

    //  searchContentsCheck(searchType): Takes in a search type and returns the number of datasets found with the current filters
    searchContentsCheck: function(searchType) {
      const query = this.$route.query.search

      if (searchType !== 'projects'){

        // Alogilia searches
        const datasetsFilter =
          searchType === 'simulation' ? '(NOT item.types.name:Dataset AND NOT item.types.name:Scaffold)' 
            : searchType === 'model' ? '(NOT item.types.name:Dataset AND item.types.name:Scaffold)' 
            : "item.types.name:Dataset"

        var filters = this.$refs.datasetFacetMenu?.getFilters()
        filters = filters === undefined ? 
          `${datasetsFilter}` : 
          filters + ` AND ${datasetsFilter}`

        this.algoliaIndex
          .search(query, {
            facets: ['*'],
            filters: filters
          })
          .then(response => {
            response.nbHits > 0 ? (this.searchHasAltResults = true) : null
            this.resultCounts[searchType] = response.nbHits
          })
      }
    },

    /**
     * Get search results
     * This is using the contentful.js client
     */
    fetchFromContentful: function() {
      this.isLoadingSearch = true

      var contentType = this.$route.query.type  
      var sortOrder = undefined
      var anatomicalFocus = undefined
      var funding = undefined
      var linkedEntriesTargetType = undefined
      var linkedFundingProgramTargetType = undefined
      if (this.$route.query.type === "projects") {
        contentType = 'sparcAward',
        sortOrder = this.selectedProjectsSortOption.sortOrder,
        anatomicalFocus = this.$refs.projectsFacetMenu?.getSelectedAnatomicalFocusTypes()
        funding = this.$refs.projectsFacetMenu?.getSelectedFundingTypes()
        linkedEntriesTargetType = 'awardSection'
        linkedFundingProgramTargetType = funding ? 'program' : undefined
      }
      if (contentType === undefined) {
        this.isLoadingSearch = false
      }
      else {
        client
          .getEntries({
            content_type: contentType,
            query: this.$route.query.search,
            limit: this.searchData.limit,
            skip: this.searchData.skip,
            order: sortOrder,
            include: 2,
            'fields.projectSection.sys.contentType.sys.id': linkedEntriesTargetType,
            'fields.projectSection.fields.title[in]' : anatomicalFocus,
            'fields.fundingProgram.sys.contentType.sys.id': linkedFundingProgramTargetType,
            'fields.fundingProgram.fields.name[in]' : funding
          })
          .then(async response => {
            this.searchData = { ...response }
            // Update alternative search results
            this.alternativeSearchUpdate()
          })
          .catch(() => {
            this.searchData = clone(searchData)
          })
          .finally(() => {
            this.isLoadingSearch = false
          })
      }
    },

    /**
     * Update offset
     */
    onPaginationPageChange: function(page) {
      const offset = (page - 1) * this.searchData.limit
      this.searchData.skip = offset

      this.$router.replace({
        query: { ...this.$route.query, skip: offset }
      })

      this.fetchResults()
    },

    /**
     * responds to a click in the anatomical map popup by adding a filter
     * @param {String} label
     */
    onMapClick: function(label) {
      const { query } = this.$route
      const labelKey = label.toLowerCase()

      // short circuit if nothing has changed
      if (
        query.tags === labelKey ||
        find(t => t === labelKey, (query.tags || '').split(','))
      ) {
        return
      }

      const newTags = query.tags ? [query.tags, labelKey].join(',') : labelKey

      this.$router
        .replace({
          query: {
            ...query,
            tags: newTags
          }
        })
        .then(() => {
          this.fetchResults()
        })
    },

    /**
     * Adjust the Title column width when
     * on smaller screens or mobile
     * @param {Number} width
     */
    onResize: function(width) {
      width <= 768
        ? (this.titleColumnWidth = 150)
        : (this.titleColumnWidth = 300)
      this.windowWidth = width
    },

    /**
     * Compute search column span
     * Determined if the searchType === 'dataset'
     */
    searchColSpan(viewport) {
      const hasFacetMenu = this.searchType.type === 'dataset' ||
        this.searchType.type === 'simulation' ||
        this.searchType.type === 'model' ||
        this.searchType.type === 'projects'
      const viewports = {
        sm: hasFacetMenu ? 24 : 24,
        md: hasFacetMenu ? 16 : 24,
        lg: hasFacetMenu ? 18 : 24
      }

      return viewports[viewport] || 24
    },
    
    async onAlgoliaSortOptionChange(option) {
      this.selectedAlgoliaSortOption = option
      this.onPaginationPageChange(1)
    },
    async onProjectsSortOptionChange(option) {
      this.selectedProjectsSortOption = option
      this.onPaginationPageChange(1)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.page-data {
  background-color: #f5f7fa;
}
.page-hero {
  padding-bottom: 1.3125em;
}
.search-tabs__container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: white;
  border: 0.1rem solid $purple-gray;
  h3 {
    padding-left: 0.75rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
}
.search-bar__container {
  margin-top: 1em;
  padding: 0.75rem;
  border: 0.1rem solid $purple-gray;
  background: white;
  h5 {
    line-height: 1rem;
    font-weight: 600;
    font-size: 1rem;
  }
}
.search-tabs {
  display: flex;
  list-style: none;
  overflow: auto;
  margin: 0 0 0 0;
  padding: 0 0;
  outline: 0.1rem solid $median;
  @media (max-width: 40rem) {
    display: block;
  }
  li {
    width: 100%;
    text-align: center;
    color: $median;
  }
  li:last-child > a {
    border-right: none;
  }
}
.search-tabs__button {
  background: $light-purple;
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  outline: none;
  padding: 0;
  text-decoration: none;
  text-transform: uppercase;
  line-height: 3.5rem;
  @media (min-width: 40rem) {
    font-size: 0.65rem;
    border-right: 0.1rem solid $median;
  }
  @media (min-width: 50rem) {
    font-size: .75rem;
  }
  @media (min-width: 64rem) {
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: none;
  }
  &:hover,
  &.active {
    color: white;
    background-color: $median;
    font-weight: 500;
  }
}
.table-wrap {
  background: #fff;
  border: 1px solid rgb(228, 231, 237);
  padding: 16px;
  .search-error {
    margin: 0 0  auto;
    text-align:center;
  }
}
.search-heading {
  align-items: flex-end;
  display: flex;
  margin-bottom: 1em;
  justify-content: space-between;
  @media screen and (max-width: 28em) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0;
  }
  p {
    font-size: 0.875em;
    flex-shrink: 0;
    margin: 2em 0 0 0;
  }
}
.facet-menu {
  margin-top: 2em;
}
::v-deep {
  .el-table td {
    vertical-align: top;
  }
  .el-table .cell {
    word-break: normal;
  }
}
.dataset-filters {
  padding: 0.5rem 1rem 1rem;
  margin-bottom: 2rem;
  h2,
  h3 {
    font-size: 1.125rem;
    font-weight: normal;
    line-height: 1.2;
  }
  h2 {
    border-bottom: 1px solid #dbdfe6;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }
  h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
  }
  ::v-deep .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .el-checkbox__label {
    color: $median;
  }
}
</style>
