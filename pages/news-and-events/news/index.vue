<template>
  <div class="data-page">
    <breadcrumb :breadcrumb="breadcrumb" title="News" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Browse categories
        </h3>
        <ul class="search-tabs">
          <li v-for="type in searchTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.path === 'news' }"
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
          path="/news-and-events/news"
          showSearchText
        />
      </div>
    </div>
    <div class="mb-48 container">
      <el-row :gutter="32" type="flex">
        <el-col :span="24">
          <el-row :gutter="32">
            <client-only>
              <el-col
                class="facet-menu"
                :sm="24"
                :md="6"
                :lg="6"
              >
                <news-facet-menu
                  ref="newsFacetMenu"
                  class="news-facet-menu"
                  @news-selections-changed="onPaginationPageChange(1)"
                />
              </el-col>
              <el-col
                :sm='24'
                :md='18'
                :lg='18'
              >
                <div class="search-heading mt-32 mb-16">
                  <div class="label1" v-show="news.items.length">
                    {{ news.total }} Results | Showing
                    <pagination-menu
                      :page-size="news.limit"
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
                <div ref="newsWrap" class="subpage">
                  <news-list-item
                    v-for="item in news.items"
                    :key="item.sys.id"
                    :item="item"
                  />
                </div>
                <div class="search-heading">
                  <div class="label1" v-if="news.items.length">
                    {{ news.total }} Results | Showing
                    <pagination-menu
                      :page-size="news.limit"
                      @update-page-size="onPaginationLimitChange"
                    />
                  </div>
                  <pagination
                    v-if="news.limit < news.total"
                    :selected="curSearchPage"
                    :page-size="news.limit"
                    :total-count="news.total"
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

<script lang="ts">
import Vue from 'vue'
import { propOr } from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import NewsFacetMenu from '@/components/FacetMenu/NewsFacetMenu.vue'
import NewsListItem from '@/components/NewsListItem/NewsListItem.vue'
import SearchControlsContentful from '@/components/SearchControlsContentful/SearchControlsContentful.vue';
import SortMenu from '@/components/SortMenu/SortMenu.vue'

import createClient from '@/plugins/contentful.js'

import { fetchNews, NewsData, NewsComputed, NewsMethods } from '../model'

const client = createClient()

const searchTypes = [
  {
    label: 'News',
    path: 'news'
  },
  {
    label: 'Events',
    path: 'events'
  },
  {
    label: 'Community Spotlight',
    path: 'community-spotlight'
  }
]

const sortOptions = [
  {
    label: 'Latest',
    id: 'latest',
    sortOrder: '-fields.publishedDate'
  },
  {
    label: 'A-Z',
    id: 'alphabatical',
    sortOrder: 'fields.title'
  },
]

export default Vue.extend<NewsData, NewsMethods, NewsComputed, never>({
  name: 'NewsPage',

  components: {
    Breadcrumb,
    NewsFacetMenu,
    NewsListItem,
    SearchControlsContentful,
    SortMenu
  },

  async asyncData({ route }) {
    const news = await fetchNews(client, route.query.search, undefined, undefined, undefined, 10, 0)

    return {
      news
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
          label: 'News & Events',
          to: {
            name: 'news-and-events'
          }
        }
      ]
    }
  },

  watch: {
    '$route.query': {
      handler: function() {
        // we use next tick to wait for the facet menu to be mounted
        this.$nextTick(async () => {
          this.news = await fetchNews(client, this.$route.query.search, this.publishedLessThanDate, this.publishedGreaterThanOrEqualToDate, this.sortOrder, 10, 0)
        })
      },
      immediate: true
    },
  },

  computed: {
    /**
     * Compute the current page based off the limit and the offset
     * @returns {Number}
     */
    curSearchPage: function() {
      return this.news.skip / this.news.limit + 1
    },
    publishedLessThanDate: function() {
      return this.$refs.newsFacetMenu?.getPublishedLessThanDate()
    },
    publishedGreaterThanOrEqualToDate: function() {
      return this.$refs.newsFacetMenu?.getPublishedGreaterThanOrEqualToDate()
    },
    sortOrder: function() {
      return propOr('-fields.publishedDate', 'sortOrder', this.selectedSortOption)
    }
  },

  methods: {
    /**
     * Get more news for the new page
     * @param {Number} page
     */
    async onPaginationPageChange(page) {
      const { limit } = this.news
      const offset = (page - 1) * limit
      const response = await fetchNews(client, this.$route.query.search, this.publishedLessThanDate, this.publishedGreaterThanOrEqualToDate, this.sortOrder, limit, offset)
      this.news = response
    },
    /**
     * Update limit based on pagination menu selection and get more news
     * @param {Number} limit
     */
    async onPaginationLimitChange(limit) {
      const newLimit = limit === 'View All' ? this.news.total : limit
      const response = await fetchNews(client, this.$route.query.search, this.publishedLessThanDate, this.publishedGreaterThanOrEqualToDate, this.sortOrder, newLimit, 0)
      this.news = response
    },
    async onSortOptionChange(option) {
      this.selectedSortOption = option
      const response = await fetchNews(client, this.$route.query.search, this.publishedLessThanDate, this.publishedGreaterThanOrEqualToDate, this.sortOrder, this.news.limit, 0)
      this.news = response
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.news-list-item {
  border-top: 1px solid #d8d8d8;
  padding: 1.5em 0;
  &:first-child {
    border: none;
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
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
  .search-bar {
    ::v-deep .input-wrap {
      width: 100% !important;
    }
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
.news-facet-menu {
  margin-top: 2rem;
}
</style>
