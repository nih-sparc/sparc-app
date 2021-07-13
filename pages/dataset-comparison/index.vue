<template>
  <div class="dataset-comparison-page">
    <breadcrumb :breadcrumb="breadcrumb" title="Find Data" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Compare Datasets
        </h3>
        <ul class="search-tabs">
          <li v-for="type in searchTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.type === $route.query.type }"
              :to="{
                name: 'dataset-comparison',
                query: {
                  type: type.type,
                  q: $route.query.q
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
          Search for datasets to compare
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
          <div class="search-heading">
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
          <el-row :gutter="32">
            <el-col
              v-if="searchType.type === 'image'"
              :sm="24"
              :md="6"
              :lg="4"
            >
              <div class="dataset-filters table-wrap">
                <h2>Refine datasets by:</h2>
                <h3>Status</h3>
                <div class="dataset-filters__filter-group">
                  <el-checkbox-group
                    v-model="datasetFilters"
                    @change="setDatasetFilter"
                  >
                    <el-checkbox label="Public" />
                    <el-checkbox label="Embargoed" />
                  </el-checkbox-group>
                </div>
              </div>
            </el-col>
            <el-col
              :sm="searchColSpan('sm')"
              :md="searchColSpan('md')"
              :lg="searchColSpan('lg')"
            >
              <div v-loading="isLoadingSearch" class="table-wrap">
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="search-heading">
      </div>
    </div>
    <search-filters
      v-model="filters"
      :visible.sync="isFiltersVisible"
      :is-loading="isLoadingFilters"
      :dialog-title="activeFiltersLabel"
      @input="setTagsQuery"
    />
		<div>
			<ul>
			  Datasets to Compare:
				<li v-for="dataset in datasetsToCompare" :key="dataset.text">
					<input :checked="dataset.done" @change="toggle(dataset)" type="checkbox">
					<span :class="{ done: dataset.done }">{{ dataset.name }} (id: {{ dataset.id }})  </span>
          <img
            class="dataset-preview-img"
            v-bind:src="dataset.imageUrl"
          />
				</li>
				<li><input @keyup.enter="addDataset" placeholder="Dataset ID? (e.g., 156)"></li>
			</ul>
		</div>
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
  mergeLeft,
  pathOr,
  propEq,
  propOr,
  pluck
} from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import SearchFilters from '@/components/SearchFilters/SearchFilters.vue'
import SearchForm from '@/components/SearchForm/SearchForm.vue'


const searchTypes = [
  {
    label: 'Image',
    disabled: false,
  },
  {
    label: 'Metadata',
    disabled: true,
  },
  {
    label: 'Text',
    disabled: true,
  }
]

const searchData = {
  limit: 10,
  skip: 0,
  items: [],
  order: undefined,
  ascending: false
}

const datasetFilters = ['Public']

import createClient from '@/plugins/contentful.js'
import { handleSortChange, transformFilters } from './utils'

const client = createClient()

export default {
  name: 'DataPage',

  components: {
    Breadcrumb,
    PageHero,
    SearchFilters,
    SearchForm,
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
      isFiltersVisible: false,
      isSearchMapVisible: false,
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      titleColumnWidth: 300,
      windowWidth: '',
      datasetFilters: [...datasetFilters]
    }
  },

  computed: {
    datasetsToCompare: function() {
      const toCompare = this.$store.state.datasetComparison.toCompare

      const modified = toCompare.map(function (dataset) {
        // TODO consider getting dynamically, perhaps using e.g., https://api.pennsieve.io/discover/datasets?limit=10&offset=0&ids=156&orderBy=relevance&orderDirection=desc
        const fieldsToAdd = {imageUrl: "https://assets.discover.pennsieve.io/dataset-assets/" + dataset.id + "/1/banner.jpg"}
        
        return Object.assign(dataset, fieldsToAdd)
      })

      return modified
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

    /**
     * list of datasets we are comparing
     * @returns {Array}
     */
    tableData: function() {
      //return propOr([], 'items', this.searchData)
      return propOr([], this.$store.state.datasetComparison.toCompare)
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

      if (this.$route.query.datasetFilters) {
        this.datasetFilters = Array.isArray(this.$route.query.datasetFilters)
          ? this.$route.query.datasetFilters
          : [this.$route.query.datasetFilters]
      }

      this.fetchResults()
    }
    if (window.innerWidth <= 768) this.titleColumnWidth = 150
    window.onresize = () => this.onResize(window.innerWidth)
  },

  methods: {
    // add a dataset from the form to the compare list
    async addDataset (e) {
      const datasetId = e.target.value
      const details = await this.getDatasetDetails(datasetId)
      console.log("ds details: ", details)

      this.$store.commit('datasetComparison/add', details)
      e.target.value = ''
    },


    // get data for a dataset by its id
    // shamelessly copied without trying to DRY it up from datasets/_datasetId.vue ... TODO DRY it up

    async getDatasetDetails (datasetId, version, datasetType)  {
      const url = `${process.env.discover_api_host}/datasets/${datasetId}`
      const datasetUrl = version ? `${url}/versions/${version}` : url

      const simulationUrl = `${process.env.portal_api}/sim/dataset/${datasetId}`

      try {
        const datasetDetails =
          datasetType === 'simulation'
            ? await this.$axios.$get(simulationUrl)
            : await this.$axios.$get(datasetUrl)

        const datasetOwnerId = datasetDetails.ownerId || ''
        const datasetOwnerEmail = await this.$axios
          .$get(`${process.env.portal_api}/get_owner_email/${datasetOwnerId}`)
          .then(resp => {
            return resp.email
          })
          .catch(() => {
            return ''
          })
        datasetDetails.ownerEmail = datasetOwnerEmail

        return datasetDetails
      } catch (error) {
        console.error(error)
        return {}
      }
    },

    /**
     * Set active filters based on the query params
     * @params {Array} filters
     * @returns {Array}
     */
    setActiveFilters: function(filters) {
      const tags = (this.$route.query.tags || '').toLowerCase().split(',')

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

      const query = { ...this.$route.query, ...tags }
      this.$router.replace({ query }).then(() => {
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
      const isDataset = this.searchType.type === 'dataset'
      const viewports = {
        sm: isDataset ? 24 : 24,
        md: isDataset ? 18 : 24,
        lg: isDataset ? 20 : 24
      }

      return viewports[viewport] || 24
    },

    /**
     * Set datset filters
     */
    setDatasetFilter() {
      this.$router.replace({
        query: {
          type: 'dataset',
          q: this.$route.query.q,
          datasetFilters: this.datasetFilters,
          skip: 0,
          limit: 10
        }
      })

      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      this.searchData = clone(searchData)
      this.fetchResults()
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
  border-right: 0.1rem solid $median;
  line-height: 3.5rem;
  @media (min-width: 48em) {
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
::v-deep {
  .el-table td {
    vertical-align: top;
  }
  .el-table .cell {
    word-break: normal;
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
.filter__wrap {
  padding-right: 1em;
}
.dataset-preview-img {
  max-height: 100px;
  max-width: 100px;
}

.dataset-filters {
  padding: 0.5rem 1rem 1rem;
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
