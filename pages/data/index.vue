<template>
  <div class="data-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Find Data" />
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
        <search-form
          v-model="searchQuery"
          :q="q"
          @search="submitSearch"
          @clear="clearSearch"
        />
      </div>
    </div>
    <div class="page-wrap container">
      <el-row :gutter="32" type="flex">
        <el-col :span="24">
          <el-row :gutter="32">
            <el-col
              v-if="searchType.type === 'dataset' || searchType.type === 'simulation'"
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
              v-if="searchType.type === 'newsAndEvents'"
              class="facet-menu"
              :sm="24"
              :md="8"
              :lg="6"
            >
              <news-and-events-facet-menu
                @news-and-events-selections-changed="onPaginationPageChange(1)"
                @hook:mounted="facetMenuMounted"
                ref="newsAndEventsFacetMenu"
              />
            </el-col>
            <el-col
              v-if="searchType.type === 'sparcPartners'"
              class="facet-menu"
              :sm="24"
              :md="8"
              :lg="6"
            >
              <tools-and-resources-facet-menu
                @tool-and-resources-selections-changed="onPaginationPageChange(1)"
                @hook:mounted="facetMenuMounted"
              />
            </el-col>
            <el-col
              v-if="searchType.type === 'sparcInfo'"
              class="facet-menu"
              :sm="24"
              :md="8"
              :lg="6"
            >
              <sparc-info-facet-menu
                @sparc-info-selections-changed="onPaginationPageChange(1)"
                @hook:mounted="facetMenuMounted"
                ref="sparcInfoFacetMenu"
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
                <el-pagination
                  v-if="searchData.limit < searchData.total"
                  :small="isMobile"
                  :page-size="searchData.limit"
                  :pager-count="5"
                  :current-page="curSearchPage"
                  layout="prev, pager, next"
                  :total="searchData.total"
                  @current-change="onPaginationPageChange"
                />
              </div>
              <div v-loading="isLoadingSearch" class="table-wrap">
                <component
                  :is="searchResultsComponent"
                  :table-data="tableData"
                  :title-column-width="titleColumnWidth"
                />
              </div>
              <div class="search-heading">
                <p v-if="!isLoadingSearch && searchData.items.length">
                  {{ searchHeading }} | Showing
                  <pagination-menu
                    :page-size="searchData.limit"
                    @update-page-size="updateDataSearchLimit"
                  />
                </p>
                <el-pagination
                  v-if="searchData.limit < searchData.total"
                  :small="isMobile"
                  :page-size="searchData.limit"
                  :pager-count="5"
                  :current-page="curSearchPage"
                  layout="prev, pager, next"
                  :total="searchData.total"
                  @current-change="onPaginationPageChange"
                />
              </div>
            </el-col>
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
import PaginationMenu from '@/components/Pagination/PaginationMenu.vue'
import SearchForm from '@/components/SearchForm/SearchForm.vue'

const SparcInfoSearchResults = () =>
  import('@/components/SearchResults/SparcInfoSearchResults.vue')
const DatasetSearchResults = () =>
  import('@/components/SearchResults/DatasetSearchResults.vue')
const NewsAndEventsSearchResults = () =>
  import('@/components/SearchResults/NewsAndEventsSearchResults.vue')
const ResourcesSearchResults = () =>
  import('@/components/Resources/ResourcesSearchResults.vue')

const searchResultsComponents = {
  dataset: DatasetSearchResults,
  sparcInfo: SparcInfoSearchResults,
  sparcPartners: ResourcesSearchResults,
  simulation: DatasetSearchResults,
  newsAndEvents: NewsAndEventsSearchResults,
}

const searchTypes = [
  {
    label: 'Data',
    type: 'dataset',
    filterId: process.env.ctf_filters_dataset_id,
    dataSource: 'algolia'
  },
  {
    label: 'Models & Simulations',
    type: 'simulation',
    filterId: process.env.ctf_filters_simulation_id,
    dataSource: 'algolia'
  },
  {
    label: 'Tools & Resources',
    type: process.env.ctf_resource_id,
    dataSource: 'contentful'
  },
  {
    label: 'News & Events',
    type: process.env.ctf_news_and_events_id,
    dataSource: 'contentful'
  },
  {
    label: 'SPARC Information',
    type: 'sparcInfo',
    filterId: process.env.ctf_filters_project_id,
    dataSource: 'contentful'
  }
]

const searchData = {
  limit: 10,
  skip: 0,
  items: [],
}

import createClient from '@/plugins/contentful.js'
import createAlgoliaClient from '@/plugins/algolia.js'
import { facetPropPathMapping, getAlgoliaFacets } from './utils'
import DatasetFacetMenu from '~/components/FacetMenu/DatasetFacetMenu.vue'
import NewsAndEventsFacetMenu from '~/components/FacetMenu/NewsAndEventsFacetMenu.vue'
import ToolsAndResourcesFacetMenu from '~/components/FacetMenu/ToolsAndResourcesFacetMenu.vue'
import SparcInfoFacetMenu from '~/components/FacetMenu/SparcInfoFacetMenu.vue'

const client = createClient()
const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)

export default {
  name: 'DataPage',

  components: {
    Breadcrumb,
    PageHero,
    DatasetFacetMenu,
    SearchForm,
    PaginationMenu,
    NewsAndEventsFacetMenu,
    ToolsAndResourcesFacetMenu,
    SparcInfoFacetMenu
  },

  mixins: [],

  data: () => {
    return {
      searchQuery: '',
      facets: [],
      visibleFacets: {},
      searchTypes,
      searchData: clone(searchData),
      isLoadingSearch: false,
      isSearchMapVisible: false,
      latestSearchTerm: '',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
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
      const query = pathOr('', ['query', 'q'], this.$route)

      const searchTypeLabel = compose(
        propOr('', 'label'),
        find(propEq('type', this.$route.query.type))
      )(this.searchTypes)

      let searchHeading = `${this.searchData.total} ${searchTypeLabel}`

      return query === '' ? searchHeading : `${searchHeading} for “${query}”`
    },

    q: function() {
      return this.$route.query.q || ''
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
      this.searchData = clone(searchData)
      this.fetchResults()
    },

    '$route.query.q': {
      handler: function(val) {
        this.searchQuery = this.$route.query.q
        this.fetchResults()
      },
      immediate: true
    },
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
        q: this.$route.query.q || ''
      }

      this.searchData = { ...this.searchData, ...queryParams }
      if (this.$route.query.selectedFacetIds) {
        this.defaultCheckedFacetIds = this.$route.query.selectedFacetIds.split(
          ','
        )
      }
    }
    if (window.innerWidth <= 768) this.titleColumnWidth = 150
    window.onresize = () => this.onResize(window.innerWidth)
    getAlgoliaFacets(algoliaIndex, facetPropPathMapping).then(data => this.facets = data).finally(() => {
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
        searchSources[source]()
      }
    },

    facetMenuMounted: function() {
      this.$nextTick(() => this.fetchResults())
    },

    /**
     * Get Search results
     * This is using fetch from the Algolia API
     */
    fetchFromAlgolia: function() {
      this.isLoadingSearch = true
      const query = this.$route.query.q

      const searchType = pathOr('', ['query', 'type'], this.$route)
      const datasetsFilter =
        searchType === 'dataset' ? "item.types.name:Dataset" : '(NOT item.types.name:Dataset)'

      /* First we need to find only those facets that are relevant to the search query.
       * If we attempt to do this in the same search as below than the response facets
       * will only contain those specified by the filter */
        this.latestSearchTerm = query     
        algoliaIndex
          .search(query, {
            facets: ['*'],
            filters: `${datasetsFilter}`
          })
          .then(response => {
            this.visibleFacets = response.facets
          }).finally(() => {
            var filters =  this.$refs.datasetFacetMenu?.getFilters()
            filters = filters === undefined ? 
              `${datasetsFilter}` : 
              filters + ` AND ${datasetsFilter}`

            algoliaIndex
              .search(query, {
                facets: ['*'],
                hitsPerPage: this.searchData.limit,
                page: this.curSearchPage - 1,
                filters: filters
              })
              .then(response => {
                const searchData = {
                  items: response.hits,
                  total: response.nbHits
                }
                this.searchData = mergeLeft(searchData, this.searchData)
                this.isLoadingSearch = false
                // update facet result numbers
                for (const [key, value] of Object.entries(this.visibleFacets)) {
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
                }
              })
          }) 
    },

    /**
     * Get search results
     * This is using the contentful.js client
     */
    fetchFromContentful: function() {
      this.isLoadingSearch = true

      var tags = this.$route.query.tags || undefined

      // Keep the original search data limit to get all organs before pagination
      const origSearchDataLimit = this.searchData.limit
      this.$route.query.type === 'organ' ? (this.searchData.limit = 999) : ''
      var contentType = this.$route.query.type  
      var newsPublishedLessThanDate, newsPublishedGreaterThanOrEqualToDate, eventStartLessThanDate, eventStartGreaterThanOrEqualToDate= undefined;
      var resourceTypes, developedBySparc = undefined;
      var aboutDetailsTypes = undefined;
      var sortOrder = undefined;
      if (this.$route.query.type === "sparcInfo") {
        contentType = this.$refs.sparcInfoFacetMenu?.getSelectedType();
        aboutDetailsTypes = this.$refs.sparcInfoFacetMenu?.aboutDetailsTypesToCheck
        sortOrder = 'fields.title'
        const sparcInfoTags = this.$refs.sparcInfoFacetMenu?.getTags()
        tags = tags === undefined ? sparcInfoTags : (sparcInfoTags === undefined ? tags : `${tags}, ${sparcInfoTags}`) 
      }
      if (this.$route.query.type === process.env.ctf_news_and_events_id) {
        contentType = this.$refs.newsAndEventsFacetMenu?.getSelectedType();
        newsPublishedLessThanDate = this.$refs.newsAndEventsFacetMenu?.getPublishedLessThanDate();
        newsPublishedGreaterThanOrEqualToDate = this.$refs.newsAndEventsFacetMenu?.getPublishedGreaterThanOrEqualToDate();
        eventStartLessThanDate = this.$refs.newsAndEventsFacetMenu?.getEventsLessThanDate();
        eventStartGreaterThanOrEqualToDate = this.$refs.newsAndEventsFacetMenu?.getEventsGreaterThanOrEqualToDate();
        sortOrder = this.$refs.newsAndEventsFacetMenu?.getSortOrder();
      }
      if (this.$route.query.type === process.env.ctf_resource_id) {
        resourceTypes = this.$route.query.resourceTypes;
        developedBySparc = this.$route.query.developedBySparc;
        sortOrder = 'fields.name'
      }
      if (contentType === undefined) {
        this.isLoadingSearch = false;
      }
      else {
        client
          .getEntries({
            content_type: contentType,
            query: this.$route.query.q,
            limit: this.searchData.limit,
            skip: this.searchData.skip,
            order: sortOrder,
            include: 2,
            'fields.tags[all]': tags,
            'fields.publishedDate[lt]': newsPublishedLessThanDate,
            'fields.publishedDate[gte]': newsPublishedGreaterThanOrEqualToDate,
            'fields.startDate[lt]': eventStartLessThanDate,
            'fields.startDate[gte]': eventStartGreaterThanOrEqualToDate,
            'fields.resourceType[in]': resourceTypes,
            'fields.developedBySparc' : developedBySparc,
            'fields.type[in]' : aboutDetailsTypes,
          })
          .then(async response => {
            this.searchData = { ...response }
            if (
              this.$route.query.type === 'organ' &&
              origSearchDataLimit !== 999
            ) {
              this.searchData.items = await this.removeOrganNoDatasets()
              // Reset search data values for pagination
              this.searchData.limit = origSearchDataLimit
              this.searchData.skip == 0
                ? this.searchData.items.length > this.searchData.limit
                  ? this.searchData.items.splice(this.searchData.limit)
                  : (this.searchData.total = this.searchData.items.length)
                : ''
            }
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
     * Get organ details from discover api
     * @param {Object}
     * @returns {Object}
     */
    getOrganDetails: function(organ) {
      const organName = pathOr('', ['fields', 'name'], organ)

      const projectSection = pathOr(
        organName,
        ['fields', 'projectSection', 'fields', 'title'],
        organ
      )
      return this.$axios
        .get(
          `${
            process.env.discover_api_host
          }/search/datasets?query=${projectSection.toLowerCase()}&limit=1`
        )
        .then(response => {
          return response.data
        })
    },

    /**
     * Check if an organ has datasets
     * @param {Object}
     * @return {Boolean}
     */
    hasDatasets: function(organData) {
      return organData.totalCount > 0
    },

    /**
     * Remove organs that do not have any
     * associated datasets from the search data
     * @returns {Array}
     */
    removeOrganNoDatasets: async function() {
      const results = await Promise.all(
        this.searchData.items.map(organ => this.getOrganDetails(organ))
      )
      return this.searchData.items.filter((organ, index) =>
        this.hasDatasets(results[index])
      )
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
     * Submit search
     */
    submitSearch: function() {
      this.searchData.skip = 0

      const query = mergeLeft({ q: this.searchQuery }, this.$route.query)
      this.$router.replace({ query })
    },

    /**
     * Submit search
     */
    clearSearch: function() {
      this.searchData.skip = 0

      const query = { ...this.$route.query, q: '' }
      this.$router.replace({ query })
      this.searchQuery = ''
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
        this.searchType.type === 'newsAndEvents' || 
        this.searchType.type === 'sparcPartners' ||
        this.searchType.type === 'simulation' ||
        this.searchType.type === 'sparcInfo'
      const viewports = {
        sm: hasFacetMenu ? 24 : 24,
        md: hasFacetMenu ? 16 : 24,
        lg: hasFacetMenu ? 18 : 24
      }

      return viewports[viewport] || 24
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

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
  &:focus,
  &.active {
    color: white;
    background-color: $median;
    font-weight: 500;
  }
}
.page-wrap {
  padding-bottom: 1em;
  @media (min-width: 48em) {
    padding-bottom: 3em;
  }
}
.table-wrap {
  background: #fff;
  border: 1px solid rgb(228, 231, 237);
  padding: 16px;
}
::v-deep .el-pagination {
  margin-top: 1.5em;
  text-align: right;
  background-color: transparent;
  @media screen and (max-width: 28em) {
    margin-top: 5px;
    padding-left: 0;
    .btn-prev {
      padding-left: 0;
    }
  }
  button {
    background-color: transparent;
  }
}
.search-heading {
  align-items: center;
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
