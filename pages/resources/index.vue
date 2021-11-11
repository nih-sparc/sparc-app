<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h1>Tools &amp; Resources</h1>
      <!-- eslint-disable vue/no-v-html -->
      <!-- marked will sanitize the HTML injected -->
      <div v-html="parseMarkdown(fields.heroCopy)" />
    </page-hero>
    <div class="container">
      <div class="page-description">
        <p v-html="fields.heroCopyLong" />
        <div class="page-description__button-container">
          <el-button>Browse Tools &amp; Resources</el-button>
        </div>
      </div>
      <div>
        <h2>Featured Tools &amp; Resources</h2>
        <div class="featured-resource-list">
          <featured-resource />
          <featured-resource />
        </div>
      </div>
      <div>
        <h2>Contribute</h2>
        <div class="paper">
          <p class="paper-title">Want your tool or resource listen on the SPARC Portal?</p>
          <p class="paper-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <div class="paper-actions">
            <el-button class="pink-button">Submit a recommendation</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
}
.container {
  & > div {
    margin: 3em 0;
  }
}
.page-description {
  color: rgb(36, 36, 91);
  & > p {
    font-size: 1.25em;
    line-height: 1.5rem;
    @media (min-width: 48em) {
      font-size: 1.25em;
      line-height: 2rem;
    }
  }
  &__button-container {
    text-align: center;
    & > button {
      background-color: $median;
      width: auto;
      height: 40px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
      text-transform: uppercase;
      a {
        color: #fff;
      }
    }
  }
}
.featured-resource-list {
  & > div + div {
    margin-top: 2.5em;
  }
}
.paper {
  border: 2px solid rgb(151, 151, 151);
  border-radius: 1px;
  padding: 1.5em;
  color: rgb(36, 36, 91);
  background-color: white;
  &-title {
    font-size: 1.5rem;
    text-align: center;
  }
  &-actions {
    text-align: right;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'
import { Computed, Data, Methods, Resource } from '~/pages/resources/model'
import marked from '@/mixins/marked/index'
import FeaturedResource from '@/components/Resources/FeaturedResource.vue'

const client = createClient()

const resourceData: Data['resourceData'] = {
  limit: 10,
  skip: 0,
  items: [],
  total: 0,
  stringifySafe: () => '',
  toPlainObject: () => ({}),
}

const tabTypes = [
  {
    label: 'All Resources',
    type: 'sparcPartners' as const,
  },
  {
    label: 'Devices',
    type: 'Devices' as const,
  },
  {
    label: 'Data and Models',
    type: 'Databases' as const,
  },
  {
    label: 'Information Services',
    type: 'Information Services' as const,
  },
  {
    label: 'Software',
    type: 'Software' as const,
  },
  {
    label: 'Biologicals',
    type: 'Biologicals' as const,
  },
]

export default Vue.extend<Data, Methods, Computed, never>({
  name: 'Resources',

  mixins: [marked],

  components: {
    Breadcrumb,
    PageHero,
    FeaturedResource,
  },

  asyncData() {
    // Get page content
    return client
      .getEntry(process.env.ctf_resource_hero_id as string)
      .then(({ fields }) => {
        return {
          fields,
        }
      })
      .catch(console.error)
  },

  data() {
    return {
      title: 'Tools & Resources',
      breadcrumb: [
        {
          to: {
            name: 'index',
          },
          label: 'Home',
        },
      ],
      activeTab: 'sparcPartners',
      resourceData,
      tabTypes,
      isLoadingSearch: false,
    }
  },

  computed: {
    /**
     * Returns the current displayed number of resources
     * @returns {Number}
     */
    currentResourceCount: function () {
      return this.resourceData.total
    },

    /**
     * Returns data that is displayed in table
     * @returns {Array}
     */
    tableData: function () {
      return this.resourceData.items
    },

    /**
     * Compute the current search page based off the limit and the offset
     */
    curSearchPage: function () {
      return this.resourceData.skip / this.resourceData.limit + 1
    },

    /**
     * Compute singular or plural resource heading based on count
     */
    resourceHeading: function () {
      return this.currentResourceCount > 1 ? 'resources' : 'resource'
    },
  },

  watch: {
    '$route.query': function () {
      this.fetchResults()
    },
  },

  /**
   * Check the searchType param in the route and set it if it doesn't exist
   */
  mounted: function () {
    if (!this.$route.query.type) {
      const firstTabType = tabTypes[0].type

      this.$router.replace({ query: { type: firstTabType } })
    } else {
      this.fetchResults()
    }
  },

  methods: {
    /**
     * Update search limit based on pagination number selection
     * @param {Number} limit
     */
    updateDataSearchLimit: function (limit) {
      this.resourceData.skip = 0
      if (typeof limit === 'string') {
        this.resourceData.limit = this.resourceData.total
      } else {
        this.resourceData.limit = limit
      }
      this.fetchResults()
    },
    /**
     * Fetches resource results
     */
    fetchResults: function () {
      this.isLoadingSearch = true

      const entries = {
        content_type: 'sparcPartners',
        limit: this.resourceData.limit,
        skip: this.resourceData.skip,
        order: 'fields.name',
        include: 2,
        query: this.$route.query.search,
        'fields.resourceType':
          this.$route.query.type === 'sparcPartners'
            ? undefined
            : this.$route.query.type,
      }

      client
        .getEntries<Resource>(entries)
        .then((response) => {
          this.resourceData = response
        })
        .catch(console.error)
        .finally(() => {
          this.isLoadingSearch = false
        })
    },

    /**
     * Update offset
     */
    onPaginationPageChange: function (page) {
      const offset = (page - 1) * this.resourceData.limit
      this.resourceData.skip = offset

      this.fetchResults()
    },

    /**
     * Set active tab
     */
    setActiveTab: function (tab) {
      this.activeTab = tab
      this.resourceData.skip = 0
      this.$router.push({
        name: 'resources',
        query: {
          ...this.$route.query,
          type: tab,
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.resources {
  .table-wrap {
    background: #fff;
    border: 1px solid rgb(228, 231, 237);
    padding: 16px;
  }

  .resources-heading {
    margin-top: 1rem;
  }

  ::v-deep .el-pagination {
    margin-top: -2.5em;
    text-align: right;
    background-color: transparent;
    button {
      background-color: transparent;
    }
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
