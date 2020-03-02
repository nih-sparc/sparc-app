<template>
  <div class="organ-details">
    <details-header
      :subtitle="pageData.fields.subtitle"
      :title="pageData.fields.name"
      :description="pageData.fields.description"
      :breadcrumb="breadcrumb"
    >
      <img slot="banner image" :src="bannerImage" :alt="bannerImageAlt" />
    </details-header>
    <detail-tabs
      :tabs="tabs"
      :active-tab="activeTab"
      class="container"
      @set-active-tab="setActiveTab"
    >
      <dataset-search-results
        v-show="activeTab === 'datasets'"
        :table-data="datasets"
      />
      <project-search-results
        v-show="activeTab === 'projects'"
        :table-data="projectTableData"
      />
    </detail-tabs>
  </div>
</template>

<script>
import { clone, pathOr } from 'ramda'

import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

import ProjectSearchResults from '@/components/SearchResults/ProjectSearchResults.vue'
import DatasetSearchResults from '@/components/SearchResults/DatasetSearchResults.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

const tabs = [
  {
    label: 'Datasets',
    type: 'datasets'
  }
]

export default {
  name: 'OrganDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    ProjectSearchResults,
    DatasetSearchResults
  },

  async asyncData({ route, $axios }) {
    // Get page content
    const pageData = await client.getEntry(route.params.organId, { include: 3 })

    const projectTableData = pathOr(
      [],
      ['fields', 'projectSection', 'fields', 'awards'],
      pageData
    )

    // Get related datasets
    const organType = pathOr('', ['fields', 'name'], pageData)
    const datasets = await $axios.$get(
      `${
        process.env.discover_api_host
      }/search/datasets?tags=${organType.toLowerCase()}&limit=100`
    )

    const tabsData = clone(tabs)

    if (projectTableData.length) {
      tabsData.push({
        label: 'Projects',
        type: 'projects'
      })
    }

    return {
      pageData,
      datasets: datasets.datasets,
      projectTableData,
      tabs: tabsData
    }
  },

  data() {
    return {
      tabs: [],
      activeTab: 'datasets',
      breadcrumb: [
        {
          to: {
            name: 'index'
          },
          label: 'Home'
        },
        {
          to: {
            name: 'data',
            query: {
              type: 'organ'
            }
          },
          label: 'Find Data'
        }
      ]
    }
  },

  computed: {
    /**
     * Compute banner image
     * @returns {String}
     */
    bannerImage: function() {
      return pathOr(
        '',
        ['fields', 'bannerImage', 'fields', 'file', 'url'],
        this.pageData
      )
    },

    /**
     * Compute banner image alt tag
     * @returns {String}
     */
    bannerImageAlt: function() {
      return pathOr(
        '',
        ['fields', 'bannerImage', 'fields', 'description'],
        this.pageData
      )
    }
  },

  methods: {
    /**
     * Sets active tab
     * @param {String} activeLabel
     */
    setActiveTab: function(activeLabel) {
      this.activeTab = activeLabel
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table td {
    vertical-align: top;
  }
}
</style>
