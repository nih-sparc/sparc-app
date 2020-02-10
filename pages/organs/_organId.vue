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
      <organ-dataset-info v-show="activeTab === 'datasets'" />
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
import OrganDatasetInfo from '@/components/OrganDetails/OrganDatasetInfo.vue'
import ProjectSearchResults from '@/components/SearchResults/ProjectSearchResults.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'OrganDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    OrganModelInfo,
    OrganDatasetInfo,
    ProjectSearchResults
  },

  asyncData(ctx) {
    return Promise.all([
      // Get page content
      client.getEntry(ctx.route.params.organId),

      // Get related projects
      client.getEntries({
        content_type: process.env.ctf_project_id,
        links_to_entry: ctx.route.params.organId
      })
    ])
      .then(([page, projects]) => {
        return {
          pageData: page,
          projects: projects.items
        }
      })
      .catch(console.error)
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
