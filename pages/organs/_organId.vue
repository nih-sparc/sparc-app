<template>
  <div class="organ-details">
    <details-header :data="test" :breadcrumb="breadcrumb">
      <img slot="banner image" :src="test.file.url" />
    </details-header>
    <detail-tabs
      :tabs="tabs"
      :active-tab="activeTab"
      class="container"
      @set-active-tab="setActiveTab"
    >
      <organ-model-info v-show="activeTab === '3DScaffold'" />
      <organ-dataset-info v-show="activeTab === 'datasets'" />
      <organ-project-info v-show="activeTab === 'projects'" />
    </detail-tabs>
  </div>
</template>

<script>
import DetailsHeader from '@/components/DetailsHeader/DetailsHeader.vue'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

import OrganModelInfo from '@/components/OrganDetails/OrganModelInfo.vue'
import OrganDatasetInfo from '@/components/OrganDetails/OrganDatasetInfo.vue'
import OrganProjectInfo from '@/components/OrganDetails/OrganProjectInfo.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'OrganDetails',

  components: {
    DetailsHeader,
    DetailTabs,
    OrganModelInfo,
    OrganDatasetInfo,
    OrganProjectInfo
  },

  asyncData(ctx) {
    return Promise.all([
      // Get page content
      client.getEntry(ctx.route.params.organId)
    ])
      .then(([page]) => {
        return {
          test: page.fields.bannerImage.fields
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

<style lang="scss" scoped></style>
