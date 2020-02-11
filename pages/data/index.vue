<template>
  <div class="data-page">
    <page-hero>
      <search-form v-model="searchQuery" @search="submitSearch" />

      <ul class="search-tabs">
        <li v-for="type in searchTypes" :key="type.label">
          <nuxt-link
            class="search-tabs__button"
            :class="{ active: type.type === $route.query.type }"
            :to="{
              name: 'data',
              query: {
                type: type.type
              }
            }"
          >
            {{ type.label }}
          </nuxt-link>
        </li>
      </ul>
    </page-hero>
    <div class="page-wrap container">
      <el-row :gutter="32" type="flex">
        <el-col :span="24">
          <div class="search-heading">
            <p v-if="!isLoadingSearch && searchData.items.length">
              {{ searchHeading }}
            </p>
            <div class="filter__wrap">
              <button
                class="btn__filters"
                :disabled="filters.length === 0"
                @click="isFiltersVisible = true"
              >
                <svg-icon name="icon-preset" height="20" width="20" />
                {{ activeFiltersLabel }}
              </button>
            </div>
          </div>
          <div class="mb-16">
            <div class="active__filter__wrap">
              <div
                v-for="(filter, filterIdx) in filters"
                :key="filter.category"
                class="active__filter__wrap-category"
              >
                <template v-for="(item, itemIdx) in filter.filters">
                  <el-tag
                    v-if="item.value"
                    :key="`${item.key}`"
                    closable
                    @close="clearFilter(filterIdx, itemIdx)"
                  >
                    {{ item.label }}
                  </el-tag>
                </template>
              </div>
            </div>
          </div>
          <div v-loading="isLoadingSearch" class="table-wrap">
            <component :is="searchResultsComponent" :table-data="tableData" />
            <el-pagination
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
    </div>
    <search-filters
      v-model="filters"
      :visible.sync="isFiltersVisible"
      :is-loading="isLoadingFilters"
      :dialog-title="activeFiltersLabel"
      @input="setTagsQuery"
    />
  </div>
</template>

<script>
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
  map,
  mergeLeft,
  pathOr,
  propEq,
  propOr,
  pluck,
  split,
  toLower
} from 'ramda'
import PageHero from '@/components/PageHero/PageHero.vue'
import SearchFilters from '@/components/SearchFilters/SearchFilters.vue'
import SearchForm from '@/components/SearchForm/SearchForm.vue'

const ProjectSearchResults = () =>
  import('@/components/SearchResults/ProjectSearchResults.vue')
const EventSearchResults = () =>
  import('@/components/SearchResults/EventSearchResults.vue')
const DatasetSearchResults = () =>
  import('@/components/SearchResults/DatasetSearchResults.vue')
const FileSearchResults = () =>
  import('@/components/SearchResults/FileSearchResults.vue')
const OrganSearchResults = () =>
  import('@/components/SearchResults/OrganSearchResults.vue')

const searchResultsComponents = {
  dataset: DatasetSearchResults,
  sparcAward: ProjectSearchResults,
  event: EventSearchResults,
  file: FileSearchResults,
  organ: OrganSearchResults,
  simulation: DatasetSearchResults
}

const searchTypes = [
  {
    label: 'Datasets',
    type: 'dataset',
    filterId: process.env.ctf_filters_dataset_id,
    dataSource: 'blackfynn'
  },
  {
    label: 'Images',
    type: 'file',
    filterId: process.env.ctf_filters_file_id,
    dataSource: 'blackfynn'
  },
  {
    label: 'Organs',
    type: process.env.ctf_organ_id,
    filterId: process.env.ctf_filters_organ_id,
    dataSource: 'contentful'
  },
  {
    label: 'Projects',
    type: process.env.ctf_project_id,
    filterId: process.env.ctf_filters_project_id,
    dataSource: 'contentful'
  },
  {
    label: 'Simulations',
    type: 'simulation',
    filterId: process.env.ctf_filters_simulation_id,
    dataSource: 'blackfynn'
  }
]

const searchData = {
  limit: 12,
  skip: 0,
  items: []
}

import createClient from '@/plugins/contentful.js'

const client = createClient()

/**
 * Transform indidivual filter
 * @param {Object} filter
 */
const transformIndividualFilter = filter => {
  const category = propOr('', 'category', filter)
  const filters = propOr([], 'tags', filter)

  const transformedFilters = filters.map(filter => {
    return {
      label: filter.fields.name,
      category: category,
      key: filter.fields.slug,
      value: false
    }
  })

  return mergeLeft({ filters: transformedFilters }, filter)
}

/**
 * Transform filter response
 * @param {Object} filters
 */
const transformFilters = compose(
  flatten,
  map(transformIndividualFilter),
  pluck('fields'),
  propOr([], 'filters')
)

export default {
  name: 'DataPage',

  components: {
    PageHero,
    SearchFilters,
    SearchForm
  },

  mixins: [],

  data: () => {
    return {
      searchQuery: '',
      filters: [],
      searchTypes,
      searchData: clone(searchData),
      isLoadingSearch: false,
      isLoadingFilters: false,
      isFiltersVisible: false
    }
  },

  computed: {
    /**
     * Compute the URL for using a Blackfynn API
     * @returns {String}
     */
    blackfynnApiUrl: function() {
      const searchType = pathOr('', ['query', 'type'], this.$route)
      let url = `${process.env.discover_api_host}/search/${
        searchType === 'simulation' ? 'dataset' : searchType
      }s?offset=${this.searchData.skip}&limit=${this.searchData.limit}&${
        searchType === 'simulation'
          ? 'tags=simcore'
          : 'organization=SPARC%20Consortium'
      }`

      if (searchType === 'file') {
        url += '&fileType=tiff'
      }

      const query = pathOr('', ['query', 'q'], this.$route)
      if (query) {
        url += `&query=${query}`
      }

      const tags = pathOr('', ['query', 'tags'], this.$route)
      if (tags) {
        url += `&tags=${tags}`
      }

      return url
    },

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
      const start = this.searchData.skip + 1
      const pageRange = this.searchData.limit * this.curSearchPage
      const end =
        pageRange < this.searchData.total ? pageRange : this.searchData.total
      const query = pathOr('', ['query', 'q'], this.$route)

      const searchTypeLabel = compose(
        propOr('', 'label'),
        find(propEq('type', this.$route.query.type))
      )(this.searchTypes)

      let searchHeading = `Showing ${start}-${end} of ${this.searchData.total} ${searchTypeLabel}`

      return query === '' ? searchHeading : `${searchHeading} for “${query}”`
    },

    /**
     * Compute selected filters
     * @returns {Array}
     */
    selectedFilters: function() {
      return compose(
        filter(propEq('value', true)),
        flatten,
        pluck('items')
      )(this.filters)
    },

    /**
     * Compute active filters
     * @returns {Array}
     */
    activeFilters: function() {
      return compose(
        filter(propEq('value', true)),
        flatten,
        pluck('filters')
      )(this.filters)
    },

    /**
     * Compute dialog header based on how many active filters
     * @returns {String}
     */
    activeFiltersLabel: function() {
      const activeFilterLength = this.activeFilters.length
      return activeFilterLength ? `Filters (${activeFilterLength})` : `Filters`
    }
  },

  watch: {
    '$route.query.type': function() {
      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      this.searchData = clone(searchData)
      this.fetchResults()
    },

    'searchType.filterId': {
      handler: function(val) {
        if (val) {
          this.fetchFilters()
        }
      },
      immediate: true
    }
  },
  /**
   * Check the searchType param in the route and set it if it doesn't exist
   */
  mounted: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(searchTypes)

      this.$router.replace({ query: { type: firstTabType } })
    } else {
      this.fetchResults()
      // this.fetchFilters()
    }
  },

  methods: {
    /**
     * Set active filters based on the query params
     * @params {Array} filters
     * @returns {Array}
     */
    setActiveFilters: function(filters) {
      const tags = compose(
        split(','),
        toLower,
        pathOr('', ['query', 'tags'])
      )(this.$route)

      return filters.map(category => {
        category.filters.map(filter => {
          const hasTag = tags.indexOf(filter.key.toLowerCase())
          filter.value = hasTag >= 0
          return filter
        })

        return category
      })
    },

    /**
     * Figure out which source to fetch results from based on the
     * type of search
     */
    fetchResults: function() {
      const source = propOr('contentful', 'dataSource', this.searchType)

      const searchSources = {
        contentful: this.fetchFromContentful,
        blackfynn: this.fetchFromBlackfynn
      }

      if (typeof searchSources[source] === 'function') {
        searchSources[source]()
      }
    },

    /**
     * Get Search results
     * This is using fetch from the Blackfynn API
     */
    fetchFromBlackfynn: function() {
      this.isLoadingSearch = true

      this.$axios
        .$get(this.blackfynnApiUrl)
        .then(response => {
          const searchType = pathOr('', ['query', 'type'], this.$route)
          const searchData = {
            skip: response.offset,
            items:
              response[
                `${searchType === 'simulation' ? 'dataset' : searchType}s`
              ],
            total: response.totalCount
          }
          this.searchData = mergeLeft(searchData, this.searchData)
        })
        .finally(() => {
          this.isLoadingSearch = false
        })
    },

    /**
     * Get search results
     * This is using the contentful.js client
     */
    fetchFromContentful: function() {
      this.isLoadingSearch = true

      client
        .getEntries({
          content_type: this.$route.query.type,
          query: this.$route.query.q,
          limit: this.searchData.limit,
          skip: this.searchData.skip
        })
        .then(response => {
          this.searchData = response
        })
        .catch(() => {
          this.searchData = clone(searchData)
        })
        .finally(() => {
          this.isLoadingSearch = false
        })
    },

    /**
     * Get filters based on the search type
     */
    fetchFilters: function() {
      this.filters = []
      this.isLoadingFilters = true

      client
        .getEntry(this.searchType.filterId, { include: 2 })
        .then(response => {
          const filters = transformFilters(response.fields)
          this.filters = this.setActiveFilters(filters)
        })
        .catch(() => {
          this.filters = []
        })
        .finally(() => {
          this.isLoadingFilters = false
        })
    },

    /**
     * Update offset
     */
    onPaginationPageChange: function(page) {
      const offset = (page - 1) * this.searchData.limit
      this.searchData.skip = offset

      this.fetchResults()
    },

    /**
     * Submit search
     */
    submitSearch: function() {
      this.searchData.skip = 0

      const query = mergeLeft({ q: this.searchQuery }, this.$route.query)
      this.$router.replace({ query }).then(() => {
        this.fetchResults()
      })
    },

    /**
     * Clear filter's value
     * @param {Number} filterIdx
     * @param {Number} itemIdx
     */
    clearFilter: function(filterIdx, itemIdx) {
      const filters = assocPath(
        [filterIdx, 'filters', itemIdx, 'value'],
        false,
        this.filters
      )
      this.filters = filters
      this.setTagsQuery()
    },

    /**
     * Set the tags query parameter in the router
     */
    setTagsQuery: function() {
      const filterVals = this.activeFilters.map(filter => {
        return filter.key
      })

      const queryParamTags = pathOr('', ['query', 'tags'], this.$route)
      if (equals(filterVals, queryParamTags.split(','))) {
        return
      }

      const tags = { tags: filterVals.join(',') }

      const query = mergeLeft(tags, this.$route.query)
      this.$router.replace({ query }).then(() => {
        this.fetchResults()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.search-tabs {
  display: flex;
  list-style: none;
  overflow: auto;
  margin: 0 -2rem 0 0;
  padding: 0 1rem;
  @media (min-width: 48em) {
    margin: 0;
    padding: 0;
  }
  li {
    margin: 0 0.625em;
    @media (min-width: 48em) {
      margin: 0 2.25em;
    }
    &:first-child {
      margin-left: 0;
    }
  }
}
.search-tabs__button {
  background: none;
  border-bottom: 2px solid transparent;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 0.75em;
  font-weight: 500;
  outline: none;
  padding: 0;
  text-decoration: none;
  text-transform: uppercase;
  @media (min-width: 48em) {
    font-size: 1em;
    font-weight: 400;
    text-transform: none;
  }
  &:hover,
  &:focus,
  &.active {
    border-bottom-color: #fff;
    font-weight: 500;
  }
}

.page-hero {
  background: linear-gradient(90deg, rgb(12, 0, 191) 0%, rgb(188, 0, 252) 100%);
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  ::v-deep .el-row--flex.is-justify-center {
    justify-content: flex-start;
  }
}
.page-wrap {
  padding-bottom: 1em;
  padding-top: 1em;
  @media (min-width: 48em) {
    padding-bottom: 3em;
    padding-top: 3em;
  }
}
.table-wrap {
  background: #fff;
  border: 1px solid rgb(228, 231, 237);
  padding: 16px;
}
.el-pagination {
  margin-top: 1.5em;
  text-align: center;
}
.search-heading {
  align-items: center;
  display: flex;
  margin-bottom: 1em;
  p {
    font-size: 0.875em;
    flex-shrink: 0;
    margin: 0 1em 0 0;
  }
}
::v-deep {
  .el-table td {
    vertical-align: top;
  }
}
.btn__filters {
  align-items: center;
  background: none;
  border: none;
  color: $median;
  display: flex;
  font-size: 0.875em;
  outline: none;
  padding: 0;
  &[disabled] {
    opacity: 0.7;
  }
  &:not([disabled]) {
    &:hover,
    &:focus {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .svg-icon {
    margin-right: 0.3125rem;
  }
}
.active__filter__wrap,
.active__filter__wrap-category {
  display: inline;
}
.active__filter__wrap .el-tag {
  margin: 0.5em 1em 0.5em 0;
}
</style>
