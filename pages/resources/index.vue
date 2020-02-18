<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h4>Resources</h4>
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
    <div class="page-wrap">
      <div class="page-wrap__results">
        <p>
          Showing {{ currentResourceCount }} of
          <strong>{{ totalResourceCount }}</strong>
        </p>
      </div>
      <div v-loading="isLoadingResources" class="table-wrap">
        <component :is="resourcesResultsComponent" :table-data="tableData" />
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
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

const ResourcesSearchResults = () =>
  import('@/components/Resources/ResourcesSearchResults.vue')

const resourcesResultsComponents = {
  sparcPartners: ResourcesSearchResults,
  platforms: ResourcesSearchResults,
  tools: ResourcesSearchResults
}

const resourceData = {
  limit: 12,
  skip: 0,
  items: [],
  total: 0
}

const tabTypes = [
  {
    label: 'All Resources',
    type: 'sparcPartners'
  },
  {
    label: 'Platforms',
    type: 'platforms'
  },
  {
    label: 'Tools',
    type: 'tools'
  }
]

export default {
  name: 'Resources',

  components: {
    Breadcrumb,
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
      breadcrumb: {
        name: 'index',
        parent: 'Home'
      },
      resourceData: clone(resourceData),
      tabTypes: tabTypes,
      platformItems: [],
      toolItems: [],
      isLoadingResources: false
    }
  },

  computed: {
    currentResourceCount: function() {
      return this.resourceData.limit > this.resourceData.total
        ? this.resourceData.total
        : this.resourceData.skip !== 0
        ? this.resourceData.total - this.resourceData.limit
        : this.resourceData.limit
    },

    totalResourceCount: function() {
      return this.resourceData.total > 1
        ? `${this.resourceData.total} resources`
        : `${this.resourceData.total} resource`
    },

    tableData: function() {
      return propOr([], 'items', this.resourceData)
    },

    /**
     * Compute the current search page based off the limit and the offset
     */
    curSearchPage: function() {
      return this.resourceData.skip / this.resourceData.limit + 1
    },

    /**
     * Compute which search results component to display based on the type of search
     * @returns {Function}
     */
    resourcesResultsComponent: function() {
      return defaultTo('', resourcesResultsComponents[this.$route.query.type])
    }
  },

  watch: {
    '$route.query.type': function(val) {
      /**
       * Clear table data so the new table that is rendered can
       * properly render data and account for any missing data
       */
      this.resourceData = clone(resourceData)
      if (val === 'platforms') {
        this.resourceData.items = this.platformItems
        this.resourceData.total = this.platformItems.length
      } else if (val === 'tools') {
        this.resourceData.items = this.toolItems
        this.resourceData.total = this.toolItems.length
      } else {
        this.fetchResults()
      }
    }
  },

  /**
   * Check the searchType param in the route and set it if it doesn't exist
   */
  mounted: function() {
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(tabTypes)

      this.$router.replace({ query: { type: firstTabType } })
    }
  },

  methods: {
    fetchResults: function() {
      this.isLoadingResources = true

      client
        .getEntries({
          content_type: this.$route.query.type,
          limit: this.resourceData.limit,
          skip: this.resourceData.skip,
          include: 2
        })
        .then(response => {
          this.resourceData = response
          this.platformItems = []
          this.toolItems = []
          this.resourceData.items.forEach(item => {
            if (item.fields.resourceType === 'Platform') {
              this.platformItems.push(item)
            }
            if (item.fields.resourceType === 'Tool') {
              this.toolItems.push(item)
            }
          })
        })
        .catch(() => {
          this.resourceData = clone(resourceData)
        })
        .finally(() => {
          this.isLoadingResources = false
        })
    },

    resourceLogoUrl: function(resource) {
      return pathOr('', ['fields', 'logo', 'fields', 'file', 'url'], resource)
    },

    resourceLogoAlt: function(resource) {
      return pathOr('', ['fields', 'logo', 'fields', 'title'], resource)
    },

    /**
     * Update offset
     */
    onPaginationPageChange: function(page) {
      const offset = (page - 1) * this.resourceData.limit
      this.resourceData.skip = offset

      if (
        this.$route.query.type !== 'platforms' ||
        this.$route.query.type !== 'tools'
      ) {
        this.fetchResults()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.resources {
  .page-hero {
    background-image: none;
    background: $midnight;
    height: 211px;
    padding-bottom: 0;
    p {
      font-size: 20px;
      font-weight: normal;
      line-height: 38px;
    }

    h4 {
      font-weight: 500;
    }

    ::v-deep .container {
      // removing default margin from container to be consistent
      // with left alignment in design and didn't want to create different component
      margin: 0;
      margin-left: -5%;
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

  .page-wrap {
    margin: 0 2.625rem 0 2.625rem;
    @media screen and (max-width: 768px) {
      margin: 0;
    }
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
    padding: 0;
    margin-top: 3.625rem;
    @media (max-width: 48em) {
      padding: 0;
      margin-top: 3rem;
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
        margin-top: 1rem;
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
