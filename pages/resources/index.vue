<template>
  <div class="resources">
    <breadcrumb :breadcrumb="breadcrumb" :title="title" />
    <page-hero>
      <h4>Resources</h4>
      <p>
        Ut ultrices fermentum null alacinia rhoncus. Donec dictum nisl turpis,
        non laoreet neque aliquet quis. Vivamus varius, urna a cursus tincidunt,
        erat lectus tincidunt dui, eu interdum arcu sapien.
      </p>
      <ul class="resources__tabs">
        <li v-for="type in tabTypes" :key="type.label">
          <nuxt-link
            class="resources__tabs--button"
            :class="{ active: type.type === 'resources' }"
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
      <div v-loading="isLoadingResources" class="table-wrap">
        <component :is="resourcesResultsComponent" :table-data="tableData" />
        <!-- <el-pagination
          :page-size="resourceData.limit"
          :pager-count="5"
          :current-page="curSearchPage"
          layout="prev, pager, next"
          :total="resourceData.total"
          @current-change="onPaginationPageChange"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { pathOr, propOr, clone, defaultTo } from 'ramda'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import PageHero from '@/components/PageHero/PageHero.vue'
import createClient from '@/plugins/contentful.js'

const client = createClient()

const ResourcesSearchResults = () =>
  import('@/components/Resources/ResourcesSearchResults.vue')
const PlatformSearchResults = () =>
  import('@/components/Resources/PlatformSearchResults.vue')
const ToolSearchResults = () =>
  import('@/components/Resources/ToolSearchResults.vue')

const resourcesResultsComponents = {
  resources: ResourcesSearchResults,
  platforms: PlatformSearchResults,
  tools: ToolSearchResults
}

export default {
  name: 'Resources',

  components: {
    Breadcrumb,
    PageHero
  },

  asyncData() {
    return Promise.all([
      client.getEntries({
        content_type: process.env.ctf_resource_id
      })
    ])
      .then(([resources]) => {
        console.log('these are my resources ', resources)
        return {
          resources: resources
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
      // resourceData: clone(this.resources),
      tabTypes: [
        {
          label: 'Resources',
          type: 'resources',
          filterId: process.env.ctf_filters_dataset_id,
          dataSource: 'blackfynn'
        },
        {
          label: 'Platforms',
          type: 'platforms',
          filterId: process.env.ctf_filters_image_id,
          dataSource: 'blackfynn'
        },
        {
          label: 'Tools',
          type: 'tools',
          filterId: '',
          dataSource: 'blackfynn'
        }
      ],
      isLoadingResources: false
    }
  },

  computed: {
    tableData: function() {
      return propOr([], 'items', this.resources)
    },

    /**
     * Compute which search results component to display based on the type of search
     * @returns {Function}
     */
    resourcesResultsComponent: function() {
      return defaultTo('', resourcesResultsComponents[this.$route.query.type])
    }
  },

  methods: {
    resourceLogoUrl: function(resource) {
      return pathOr('', ['fields', 'logo', 'fields', 'file', 'url'], resource)
    },

    resourceLogoAlt: function(resource) {
      return pathOr('', ['fields', 'logo', 'fields', 'title'], resource)
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
      margin-left: -8%;
    }
  }

  .table-wrap {
    background: #fff;
    border: 1px solid rgb(228, 231, 237);
    padding: 16px;
  }

  &__tabs {
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
  }
}
</style>
