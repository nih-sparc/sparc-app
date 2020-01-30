<template>
  <div class="data-page">
    <page-hero class="subpage">
      <h2>A growing collection of SPARC data</h2>
      <p>
        The SPARC portal provides access to high-value datasets, maps, and
        predictive simulations ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Lorem ipsum dolor sit amet.
      </p>
      <input v-model="searchQuery" />
      <button @click="submitSearch">
        Search
      </button>
    </page-hero>
    <div class="page-wrap container">
      <el-row type="flex">
        <el-col :span="24">
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
        </el-col>
      </el-row>

      <el-row :gutter="32" type="flex">
        <el-col :span="6">
          <search-filters v-model="filters" />
        </el-col>
        <el-col :span="18">
          <div class="search-heading">
            <p v-if="!isLoadingSearch && searchData.items.length">
              {{ searchHeading }}
            </p>
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
import PageHero from '@/components/PageHero/PageHero.vue'
import SearchFilters from '@/components/SearchFilters/SearchFilters.vue'

const ProjectSearchResults = () =>
  import('@/components/SearchResults/ProjectSearchResults.vue')
const EventsearchResults = () =>
  import('@/components/SearchResults/EventsearchResults.vue')

const searchResultsComponents = {
  sparcAward: ProjectSearchResults,
  event: EventsearchResults
}

const searchTypes = [
  {
    label: 'Events',
    type: process.env.ctf_event_id
  },
  {
    label: 'Datasets',
    type: 'dataset'
  },
  {
    label: 'Files',
    type: 'file'
  },
  {
    label: 'Organs',
    type: 'organ'
  },
  {
    label: 'Projects',
    type: process.env.ctf_project_id
  },
  {
    label: 'Simulations',
    type: 'simulation'
  }
]

const searchData = {
  limit: 5,
  skip: 0,
  items: []
}

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'DataPage',

  components: {
    PageHero,
    SearchFilters
  },

  mixins: [],

  data: () => {
    return {
      searchQuery: '',
      filters: [
        {
          category: 'category',
          items: [
            {
              label:
                'filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 ',
              key: 'filter_1',
              value: false
            }
          ]
        },
        {
          category: 'category 2',
          items: [
            {
              label: 'filter 1',
              key: 'filter_2',
              value: false
            }
          ]
        }
      ],
      searchTypes,
      searchData: clone(searchData),
      isLoadingSearch: false
    }
  },

  computed: {
    /**
     * Compute search type
     * @returns {String}
     */
    searchType: function() {
      const firstTabType = compose(propOr('', 'type'), head)(this.searchTypes)
      return defaultTo(this.$route.query.type, firstTabType)
    },

    tableData: function() {
      return propOr([], 'items', this.searchData)
    },

    /**
     * Compute which search results component to display based on the type of search
     * @returns {Function}
     */
    searchResultsComponent: function() {
      return searchResultsComponents[this.$route.query.type]
    },

    /**
     * Compute the current search page based off the limit and the offset
     */
    curSearchPage: function() {
      return this.searchData.skip / this.searchData.limit + 1
    },

    /**
     * Compute the search heading
     * @TODO Optimize - this is getting a lot of data from various sources
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
    }
  },

  watch: {
    '$route.query.type': function() {
      this.searchData.skip = 0
      this.fetchFromContentful()
    }
  },

  /**
   * Check the searchType param in the route and set it if it doesn't exist
   */
  mounted: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(searchTypes)

      this.$router.replace({ query: { type: firstTabType } }).then(() => {
        this.fetchFromContentful()
      })
    } else {
      this.fetchFromContentful()
    }
  },

  methods: {
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
     * Update offset
     */
    onPaginationPageChange: function(page) {
      const offset = (page - 1) * this.searchData.limit
      this.searchData.skip = offset

      this.fetchFromContentful()
    },

    /**
     * Submit search
     */
    submitSearch: function() {
      this.searchData.skip = 0

      const query = mergeLeft({ q: this.searchQuery }, this.$route.query)
      this.$router.replace({ query }).then(() => {
        this.fetchFromContentful()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.search-tabs {
  border-bottom: 2px solid #dbdfe6;
  display: flex;
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  li {
    margin: 0 2em;
    transform: translateY(2px);
    &:first-child {
      margin-left: 0;
    }
  }
}
.search-tabs__button {
  background: none;
  border: none;
  color: #909399;
  cursor: pointer;
  display: block;
  font-size: 1.25em;
  font-weight: 500;
  outline: none;
  padding: 0.5rem;
  text-decoration: none;
  &:hover,
  &:focus,
  &.active {
    color: $navy;
    border-bottom: 2px solid $median;
  }
}

.page-hero {
  h2 {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1rem;
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
  margin-bottom: 1em;
  p {
    font-size: 0.875em;
    margin: 0;
  }
}
</style>
