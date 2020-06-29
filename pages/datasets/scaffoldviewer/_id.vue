<template>
  <div class="scaffold-viewer-page">
    <div class="page-wrap container">
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ fileName }}</h1>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            3D Scaffold
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Dataset id</strong>
          <div class="file-detail__column">
            {{ datasetId }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Version</strong>
          <div class="file-detail__column">
            {{ versionNumber }}
          </div>
        </div>
      </div>
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <client-only placeholder="Loading scaffold ...">
          <div class="scaffoldvuer-container">
            <ScaffoldVuer :url="scaffoldUrl" :traditional="true" />
          </div>
        </client-only>
      </detail-tabs>
    </div>
  </div>
</template>

<script>
// :scaffold-selected="scaffoldSelected"
import '@abi-software/scaffoldvuer'
import '@abi-software/scaffoldvuer/dist/scaffoldvuer.css'

import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

export default {
  name: 'ScaffoldViewerPage',

  components: {
    DetailTabs,
  },

  data: () => {
    return {
      tabs: [
        {
          label: 'Scaffold Viewer',
          type: 'scaffold',
        },
      ],
      activeTab: 'scaffold',
      file: {},
    }
  },

  computed: {
    /**
     * Get the file name from the scaffold query parameter.
     * @returns String
     */
    fileName: function() {
      const scaffold = this.$route.query.scaffold
      let name =
        scaffold.substring(scaffold.lastIndexOf('/') + 1, scaffold.length) ||
        scaffold
      let nameWE = name.substring(0, name.lastIndexOf('.')) || name
      return nameWE
    },

    /**
     * Get the dataset id from the scaffold query parameter.
     * @returns Number
     */
    datasetId: function() {
      const scaffold = this.$route.query.scaffold
      const id = scaffold.substring(0, scaffold.indexOf('/')) || ''
      return id
    },

    /**
     * Get the version number from the scaffold query parameter.
     * @returns Number
     */
    versionNumber: function() {
      const scaffold = this.$route.query.scaffold
      const postId =
        scaffold.substring(scaffold.indexOf('/') + 1, scaffold.length) || ''
      const version = postId.substring(0, postId.indexOf('/')) || ''
      return version
    },

    /**
     * Return the url for the scaffold metadata file.
     * @returns String
     */
    scaffoldUrl: function() {
      return `${process.env.sparc_api_host}/s3-resource/${this.$route.query.scaffold}`
    },
  },
}
</script>

<style scoped lang="scss">
.scaffoldvuer-container {
  margin-top: 1.5rem;
  height: 90vh;
  max-width: calc(100% - 48px);
  padding-left: 24px;
}

.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}

.about {
  text-align: center;
  min-height: 50vh;
  margin-top: 9rem;
}

h1 {
  flex: 1;
  font-size: 1.5em;
  line-height: 2rem;
}
.page-heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.375rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.page-heading__button {
  flex-shrink: 0;
}

.file-detail {
  border-bottom: 1px solid #dbdfe6;
  flex-direction: column;
  font-size: 0.875em;
  display: flex;
  padding: 1rem 0.625rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.file-detail__column {
  flex: 1;
}
</style>
