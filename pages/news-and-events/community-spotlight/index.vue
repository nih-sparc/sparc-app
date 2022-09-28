<template>
  <div class="page-data">
    <breadcrumb :breadcrumb="breadcrumb" title="Community Spotlight" />
    <div class="container">
      <div class="search-tabs__container">
        <h3>
          Browse categories
        </h3>
        <ul class="search-tabs">
          <li v-for="type in searchTypes" :key="type.label">
            <nuxt-link
              class="search-tabs__button"
              :class="{ active: type.path === 'community-spotlight' }"
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
          path="/news-and-events/community-spotlight"
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
                class="facet-menu"
                :sm="24"
                :md="6"
                :lg="6"
              >
                <community-spotlight-facet-menu
                  ref="communitySpotlightFacetMenu"
                  class="community-spotlight-facet-menu"
                  @community-spotlight-selections-changed="onPaginationPageChange(1)"
                />
              </el-col>
              <el-col
                :sm='24'
                :md='18'
                :lg='18'
              >
                <div class="search-heading mt-32 mb-16">
                  <div class="label1" v-show="communitySpotlightItems.items.length">
                    {{ communitySpotlightItems.total }} Results | Showing
                    <pagination-menu
                      :page-size="communitySpotlightItems.limit"
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
                  <template v-if="communitySpotlightItems.items.length > 0">
                    <community-spotlight-item
                      v-for="(item, index) in communitySpotlightItems.items"
                      :key="index"
                      :story="getLinkedItem(item)"
                    />
                  </template>
                  <template v-else>
                    <div class="no-results-container">
                      No Results
                      <hr />
                    </div>
                  </template>
                </div>
                <div class="search-heading">
                  <div class="label1" v-if="communitySpotlightItems.items.length">
                    {{ communitySpotlightItems.total }} Results | Showing
                    <pagination-menu
                      :page-size="communitySpotlightItems.limit"
                      @update-page-size="onPaginationLimitChange"
                    />
                  </div>
                  <pagination
                    v-if="communitySpotlightItems.limit < communitySpotlightItems.total"
                    :selected="curSearchPage"
                    :page-size="communitySpotlightItems.limit"
                    :total-count="communitySpotlightItems.total"
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
// @ts-nocheck
import Vue from 'vue'
import { pathOr, propOr } from 'ramda'
import createClient from '@/plugins/contentful.js'
import CommunitySpotlightItem from '@/components/CommunitySpotlight/CommunitySpotlightItem.vue'
import CommunitySpotlightFacetMenu from '@/components/FacetMenu/CommunitySpotlightFacetMenu.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import SearchControlsContentful from '@/components/SearchControlsContentful/SearchControlsContentful.vue'
import SortMenu from '@/components/SortMenu/SortMenu.vue'

import { fetchCommunitySpotlightItems, CommunitySpotlightData, CommunitySpotlightComputed, CommunitySpotlightMethods } from '../model'

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
  {
    label: 'Z-A',
    id: 'reverseAlphabatical',
    sortOrder: '-fields.title'
  },
]

const SPOTLIGHT_TYPE_MAPPING = [
  {
    label: 'Fireside Chat',
    id: 'firesideChat',
  },
  {
    label: 'Success Story',
    id: 'successStory',
  }
]

export default Vue.extend<CommunitySpotlightData, CommunitySpotlightMethods, CommunitySpotlightComputed, never>({
  name: 'CommunitySpotlightPage',

  components: {
    Breadcrumb,
    CommunitySpotlightItem,
    CommunitySpotlightFacetMenu,
    SearchControlsContentful,
    SortMenu
  },

  // In order to allow for sorting or fireside chats and success stories we needed
  // to restructure the content types in contentful to share a common model since you cannot query on 
  // multiple content types while applying a field filter or order in contentful api as outlined here:
  // https://www.contentfulcommunity.com/t/how-to-query-on-multiple-content-types/473
  async asyncData({ route }) {
    const communitySpotlightItems = await fetchCommunitySpotlightItems(client, route.query.search, undefined, undefined, undefined, 10, 0)

    return {
      communitySpotlightItems
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
      handler: async function() {
        // we use next tick to wait for the facet menu to be mounted
        this.$nextTick(async () => {
          this.communitySpotlightItems = await fetchCommunitySpotlightItems(client, this.$route.query.search, this.spotlightTypes, this.anatomicalStructures, this.sortOrder, 10, 0)
        })
      },
      immediate: true
    },
  },
  computed: {
    spotlightTypes: function() {
      return this.$route.query.selectedSpotlightTypes || undefined
    },
    anatomicalStructures: function() {
      return this.$route.query.selectedAnatomicalStructures || undefined
    },
    sortOrder: function() {
      return propOr('-fields.startDate', 'sortOrder', this.selectedSortOption)
    },
  },
  methods: {
    /**
     * Get more events for the new page
     * @param {Number} page
     */
    async onPaginationPageChange(page) {
      const { limit } = this.communitySpotlightItems
      const offset = (page - 1) * limit
      const response = await fetchCommunitySpotlightItems(client, this.$route.query.search, this.spotlightTypes, this.anatomicalStructures, this.sortOrder, limit, offset)
      this.communitySpotlightItems = response
    },
    /**
     * Update limit based on pagination menu selection and get more events
     * @param {Number} limit
     */
    async onPaginationLimitChange(limit) {
      const newLimit = limit === 'View All' ? this.communitySpotlightItems.total : limit
      const response = await fetchCommunitySpotlightItems(client, this.$route.query.search, this.spotlightTypes, this.anatomicalStructures, this.sortOrder, newLimit, 0)
      this.communitySpotlightItems = response
    },
    async onSortOptionChange(option) {
      this.selectedSortOption = option
      const response = await fetchCommunitySpotlightItems(client, this.$route.query.search, this.spotlightTypes, this.anatomicalStructures, this.sortOrder, this.communitySpotlightItems.limit, 0)
      this.communitySpotlightItems = response
    },
    // The community spotlight item component needs to use the properties off the actual success stories/fireside chats
    getLinkedItem(communitySpotlightItem) {
      const linkedItem = pathOr('', ['fields','linkedItem'], communitySpotlightItem)
      const anatomicalStructure = pathOr('', ['fields','anatomicalStructure'], communitySpotlightItem)
      const spotlightTypeId = pathOr('', ['fields','itemType'], communitySpotlightItem)
      const spotlightType = SPOTLIGHT_TYPE_MAPPING.find(item => {
        return item.id == spotlightTypeId
      })?.label
      return {
        ...linkedItem,
        spotlightType,
        anatomicalStructure
      }
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.page-data {
  background-color: $background;
}
.story-result {
  border-top: 1px solid $lineColor2;
  padding-top: 1.5em;
  padding-bottom: 0;
  &:first-child {
    border: none;
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
}
.subpage {
  margin-bottom: 1rem;
  margin-top: .5rem;
  padding-bottom: 1rem;
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
  &:focus,
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
.community-spotlight-facet-menu {
  margin-top: 2rem;
}
.no-results-container {
  text-align: center;
  color: $lightGrey;
  hr {
    border-top: none;
    margin-top: 1rem;
  }
}
</style>
