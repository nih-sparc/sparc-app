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
      <organ-model-info v-show="activeTab === '3DScaffold'" />
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

import OrganModelInfo from '@/components/OrganDetails/OrganModelInfo.vue'
import ProjectSearchResults from '@/components/SearchResults/ProjectSearchResults.vue'
import DatasetSearchResults from '@/components/SearchResults/DatasetSearchResults.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'OrganDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    OrganModelInfo,
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
          label: '3-D Scaffold',
          type: '3DScaffold'
        },
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
      breadcrumb: {
        name: 'data',
        type: 'organ',
        parent: 'Teams and Projects'
      }
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
    },

    /**
     * Get related datsets
     * @param {String} organ
     */
    getRelatedDatasets: function(organ) {
      const organType = organ.toLowerCase()
      return this.$axios.$get(
        `${process.env.discover_api_host}/search/datasets?tags=${organType}`
      )
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
