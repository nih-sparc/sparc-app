<template>
  <div class="page-data">
    <breadcrumb :breadcrumb="breadcrumb" title="Policies" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Browse categories
        </h3>
        <ul class="search-tabs">
          <li v-for="type in searchTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.path === 'policies-and-standards' }"
              :to="{
                path: type.path,
                query: {
                  ...$route.query,
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
          path="/about/about-sparc"
          showSearchText
        />
      </div>
    </div>
    <div class="pb-16 container">
      <el-row :gutter="32" type="flex">
        <el-col :span="24">
          <el-row :gutter="32">
            <client-only>
              <el-col
                :sm='24'
                :md='24'
                :lg='24'
              >
                <div class="search-heading mt-32 mb-16">
                  <div class="label1" v-show="tableData.length">
                    {{ searchData.total }} Results | Showing
                    <pagination-menu
                      :page-size="searchData.limit"
                      @update-page-size="onPaginationLimitChange"
                    />
                  </div>
                  <span class="label1">
                    Sort
                    <sort-menu
                      :options="sortOptions"
                      :selected-option="selectedSortOption"
                      @update-selected-option="onSortOptionChange"
                    />
                  </span>
                </div>
                <div class="subpage">
                  <about-details-search-results :table-data="tableData" />
                </div>
                <div class="search-heading">
                  <div class="label1" v-if="tableData.length">
                    {{ searchData.total }} Results | Showing
                    <pagination-menu
                      :page-size="searchData.limit"
                      @update-page-size="onPaginationLimitChange"
                    />
                  </div>
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
import { propOr } from 'ramda'
import AboutDetailsSearchResults from '@/components/SearchResults/AboutDetailsSearchResults.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import SearchControlsContentful from '@/components/SearchControlsContentful/SearchControlsContentful.vue';
import SortMenu from '@/components/SortMenu/SortMenu.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

const searchTypes = [
  {
    label: 'About SPARC',
    path: 'about-sparc'
  },
  {
    label: 'Policies',
    path: 'policies-and-standards'
  }
]

const sortOptions = [
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

const fetchSearchData = async function(query, limit, skip, sortOrder, contentType) {
  return client
      .getEntries({
        content_type: contentType,
        query: query,
        limit: limit,
        skip: skip,
        order: sortOrder
      })
      .then(async response => {
        return response
      })
}

export default {
  name: 'PoliciesPage',

  components: {
    AboutDetailsSearchResults,
    Breadcrumb,
    SearchControlsContentful,
    SortMenu
  },

  async asyncData({ route, env }) {
    let searchData = await fetchSearchData(route.query.search, 10, 0, 'fields.title', env.ctf_sparc_policies_id)
    return {
      searchData
    }
  },

  data() {
    return {
      searchTypes,
      selectedSortOption: sortOptions[0],
      sortOptions,
      breadcrumb: [
        {
          label: 'Home',
          to: {
            name: 'index'
          }
        },
        {
          label: 'About SPARC',
          to: {
            name: 'about'
          }
        }
      ]
    }
  },

  head() {
    return {
      title: this.searchTypes[1].label
    }
  },

  watch: {
    '$route.query': {
      handler: async function() {
        this.searchData = await fetchSearchData(this.$route.query.search, 10, 0, this.sortOrder, process.env.ctf_sparc_policies_id)
      },
      immediate: true
    },
  },

  computed: {
    curSearchPage: function() {
      return this.tableData.skip / this.tableData.limit + 1
    },
    sortOrder: function() {
      return propOr('fields.title', 'sortOrder', this.selectedSortOption)
    },
    tableData: function() {
      return propOr([], 'items', this.searchData)
    },
  },

  methods: {
    async onPaginationPageChange(page) {
      const { limit } = this.searchData
      const offset = (page - 1) * limit
      this.searchData = await fetchSearchData(this.$route.query.search, limit, offset, this.sortOrder, process.env.ctf_sparc_policies_id)
    },
    async onPaginationLimitChange(limit) {
      const newLimit = limit === 'View All' ? this.this.searchData.total : limit
      this.searchData = await fetchSearchData(this.$route.query.search, newLimit, 0, this.sortOrder, process.env.ctf_sparc_policies_id)
    },
    async onSortOptionChange(option) {
      this.selectedSortOption = option
      this.searchData = await fetchSearchData(this.$route.query.search, this.searchData.limit, 0, this.sortOrder, process.env.ctf_sparc_policies_id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page-data {
  background-color: $background;
}
.subpage {
  margin-bottom: .5rem;
  margin-top: .5rem;
}
.page-wrap {
  margin-bottom: 2.5rem;
}
.search-tabs__container {
  margin-top: 2rem;
  padding-top: 0.5rem;
  background-color: white;
  border: 0.1rem solid $lineColor2;
  h3 {
    padding-left: 0.75rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
}
.search-bar__container {
  margin-top: 1em;
  padding: 0.75rem;
  border: 0.1rem solid $lineColor2;
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
  outline: 0.1rem solid $purple;
  @media (max-width: 40rem) {
    display: block;
  }
  li {
    width: 100%;
    text-align: center;
    color: $purple;
  }
  li:last-child > a {
    border-right: none;
  }
}
.search-tabs__button {
  background: #f9f2fc;
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
    border-right: 0.1rem solid $purple;
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
    background-color: $purple;
    font-weight: 500;
  }
}
.search-heading {
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 28em) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 0;
  }
}
</style>
