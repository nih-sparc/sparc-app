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
        :table-data="projects"
      />
    </detail-tabs>
  </div>
</template>

<script>
import { pathOr } from 'ramda'

import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

import ProjectSearchResults from '@/components/SearchResults/ProjectSearchResults.vue'
import DatasetSearchResults from '@/components/SearchResults/DatasetSearchResults.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

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
    const pageData = await client.getEntry(route.params.organId)

    // Get related projects
    const projects = await client.getEntries({
      content_type: process.env.ctf_project_id,
      links_to_entry: route.params.organId
    })

    // Get related datasets
    const organType = pathOr('', ['fields', 'name'], pageData)
    const datasets = await $axios.$get(
      `${
        process.env.discover_api_host
      }/search/datasets?tags=${organType.toLowerCase()}&limit=100`
    )

    return {
      pageData,
      projects: projects.items,
      datasets: datasets.datasets
    }
  },

  data() {
    return {
      tabs: [
        {
          label: 'Datasets',
          type: 'datasets'
        },
        {
          label: 'Projects',
          type: 'projects'
        }
      ],
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
