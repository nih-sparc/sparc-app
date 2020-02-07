<template>
  <div class="organ-details">
    <details-header
      :subtitle="fields.subtitle"
      :title="fields.title"
      :description="fields.description"
      :breadcrumb="breadcrumb"
    >
      <img slot="banner image" src="http://placehold.jp/368x368.png" />
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
      },
      fields: {
        // TODO remove later
        subtitle: 'Cardio-Respitory System',
        title: 'Human Heart',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing…'
      }
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
