<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Resources</h1>
      <p>
        {{ fields.heroCopy }}
      </p>
      <ul class="resources__tabs">
        <li v-for="type in tabTypes" :key="type.label">
          <nuxt-link
            class="resources__tabs--button"
            :class="{ active: type.type === $route.query.type }"
            :to="{
              name: 'resources',
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
      <div class="page-wrap__results">
        <p>
          Showing {{ currentResourceCount }} of
          <strong>{{ totalResourceCount }}</strong>
        </p>
      </div>
      <div v-loading="isLoadingResources" class="table-wrap">
        <resources-search-results :table-data="tableData" />
        <el-pagination
          :page-size="resourceData.limit"
          :pager-count="5"
          :current-page="curSearchPage"
          layout="prev, pager, next"
          :total="resourceData.total"
          @current-change="onPaginationPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr, propOr, clone, defaultTo, compose, head } from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import ResourcesSearchResults from '@/components/Resources/ResourcesSearchResults.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

const resourceData = {
  limit: 10,
  skip: 0,
  items: []
}

const tabTypes = [
  {
    label: 'All Resources',
    type: 'sparcPartners'
  },
  {
    label: 'Platforms',
    type: 'Platform'
  },
  {
    label: 'Tools',
    type: 'Tool'
  }
]

export default {
  name: 'Resources',

  components: {
    Breadcrumb,
    ResourcesSearchResults,
    PageHero
  },

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_resource_hero_id)
    ])
      .then(([page]) => {
        return {
          fields: page.fields
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      resources: [],
      title: 'Resources',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        }
      ],
      resourceData: clone(resourceData),
      tabTypes: tabTypes,
      platformItems: [],
      toolItems: [],
      isLoadingResources: false
    }
  },

  computed: {
    /**
     * Returns the current displayed number of resources
     * @returns {Number}
     */
    currentResourceCount: function() {
      return this.resourceData.limit > this.resourceData.total
        ? this.resourceData.total
        : this.resourceData.skip !== 0
        ? this.resourceData.total - this.resourceData.limit
        : this.resourceData.limit
    },

    /**
     * Returns total number of resources
     * @returns {Number}
     */
    totalResourceCount: function() {
      return this.resourceData.total > 1
        ? `${this.resourceData.total} resources`
        : `${this.resourceData.total} resource`
    },

    /**
     * Returns data that is displayed in table
     * @returns {Array}
     */
    tableData: function() {
      return propOr([], 'items', this.resourceData)
    },

    /**
     * Compute the current search page based off the limit and the offset
     */
    curSearchPage: function() {
      return this.resourceData.skip / this.resourceData.limit + 1
    }
  },

  watch: {
    '$route.query.type': function() {
      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      this.resourceData = clone(resourceData)
      this.fetchResults()
    }
  },

  /**
   * Check the searchType param in the route and set it if it doesn't exist
   */
  mounted: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(tabTypes)

      this.$router.replace({ query: { type: firstTabType } })
    } else {
      this.fetchResults()
    }
  },

  methods: {
    /**
     * Fetches resource results
     */
    fetchResults: function() {
      this.isLoadingResources = true
      let entries = {
        content_type: this.$route.query.type,
        limit: this.resourceData.limit,
        skip: this.resourceData.skip,
        include: 2
      }

      if (
        this.$route.query.type === 'Platform' ||
        this.$route.query.type === 'Tool'
      ) {
        const obj = {
          content_type: 'sparcPartners',
          'fields.resourceType': this.$route.query.type
        }
        Object.assign(entries, obj)
      }

      client
        .getEntries(entries)
        .then(response => {
          this.resourceData = response
        })
        .catch(() => {
          this.resourceData = clone(resourceData)
        })
        .finally(() => {
          this.isLoadingResources = false
        })
    },

    /**
     * Update offset
     */
    onPaginationPageChange: function(page) {
      const offset = (page - 1) * this.resourceData.limit
      this.resourceData.skip = offset

      this.fetchResults()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.resources {
  .page-hero {
    padding-bottom: 1.3125em;
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

  .page-wrap {
    &__results {
      font-size: 0.875em;
      font-weight: normal;
      line-height: 1em;

      @media screen and (max-width: 768px) {
        margin-left: 0.9375rem;
      }

      p {
        margin-top: 1.5rem;
      }
    }
    @media (min-width: 48em) {
      padding-top: 0;
    }
  }

  &__tabs {
    display: flex;
    list-style: none;
    overflow: auto;
    margin: 0;
    padding: 0;
    @media (max-width: 48em) {
      padding: 0;
      margin: 1rem 0 0;
    }
    @media (max-width: 1024px) {
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
    &--button {
      background: none;
      border-bottom: 2px solid transparent;
      color: #fff;
      cursor: pointer;
      display: block;
      font-size: 1em;
      font-weight: 500;
      outline: none;
      padding: 0;
      text-decoration: none;
      text-transform: uppercase;
      @media (min-width: 48em) {
        font-size: 0.875em;
        font-weight: normal;
        text-transform: none;
      }
      &:hover,
      &:focus,
      &.active {
        border-bottom-color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>
