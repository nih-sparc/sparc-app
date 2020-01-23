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
          <div class="table-wrap">
            <component :is="searchResultsComponent" :table-data="tableData" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { compose, defaultTo, head, mergeLeft, propOr, pluck } from 'ramda'
import PageHero from '@/components/PageHero/PageHero.vue'
import SearchFilters from '@/components/SearchFilters/SearchFilters.vue'

const ProjectSearchResults = () =>
  import('@/components/Searchresults/ProjectSearchResults.vue')
const HelpSearchResults = () =>
  import('@/components/Searchresults/HelpSearchResults.vue')

const searchResultsComponents = {
  sparcAward: ProjectSearchResults,
  helpDocument: HelpSearchResults
}

const searchTypes = [
  {
    label: 'Help',
    type: 'helpDocument'
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
    type: 'sparcAward'
  },
  {
    label: 'Simulations',
    type: 'simulation'
  }
]

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'DataPage',

  components: {
    PageHero,
    SearchFilters
  },

  mixins: [],

  watchQuery: ['type', 'q'],

  asyncData(ctx) {
    if (!ctx.route.query.type) {
      return { searchData: [] }
    }

    return Promise.all([
      // Get page content
      client.getEntries({
        content_type: ctx.route.query.type,
        query: ctx.route.query.q
      })
    ])
      .then(([searchData]) => {
        return { searchData }
      })
      .catch(console.error)
  },

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
      searchTypes
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
      return compose(pluck('fields'), propOr('', 'items'))(this.searchData)
    },

    /**
     * Compute which search results component to display based on the type of search
     * @returns {Function}
     */
    searchResultsComponent: function() {
      return searchResultsComponents[this.$route.query.type]
    }
  },

  /**
   * Check the searchType param in the route and set it if it doesn't exist
   */
  beforeCreate: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(searchTypes)

      this.$router.replace({ query: { type: firstTabType } })
    }
  },

  methods: {
    /**
     * Submit search
     */
    submitSearch: function() {
      const query = mergeLeft({ q: this.searchQuery }, this.$route.query)
      this.$router.push({ query })
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

.page-hero  {
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
</style>
