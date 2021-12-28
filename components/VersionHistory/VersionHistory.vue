<template>
  <div class="version-history-container">
    <div class="heading2 mb-8">Versions for this Dataset</div>
    <div class="mb-8"><strong>Current version: </strong>{{latestVersionRevisionText}}</div>
    <div class="mb-8"><strong>Original version: </strong>{{originalVersionRevisionText}}</div>
    <p>
      A dataset version refers to a DOI-specific, version-controlled iteration of a dataset. A new version of a dataset must be released when there are any changes to the files or scientific metadata made within a dataset. A dataset revision refers to an update made to dataset metadata (i.e. title, subtitle, description, etc.) that does not require an updated DOI.
    </p>
    <div class="version-table">
      <el-row class="table-header py-12" type="flex" justify="center">
        <el-col :span="4" :pull="1">
          Version
        </el-col>
        <el-col :span="4">
          Revisions
        </el-col>
        <el-col :span="4">
          Date 
        </el-col>
        <el-col :span="8" :push="2">
          DOI
        </el-col>
      </el-row>
      <el-row
        v-for="version in versions"
        :key="version.doi"
        class="table-rows py-12"
        type="flex"
        justify="center"
      >
        <el-col :span="4" :pull="1">
          <router-link
            :to="{
              name: 'version',
              params: {
                version: version.version,
                datasetId
              },
              query: {
                type: 'dataset'
              }
            }"
          >
            Version {{ version.version }}
          </router-link>
        </el-col>
        <el-col :span="4">
          Revision {{ version.revision ? version.revision : '0' }}
        </el-col>
        <el-col :span="4">
          {{ formatDate(getVersionRevisionDate(version)) }}
        </el-col>
        <el-col :span="8" :push="2">
          <a
            :href="getDoiLink(version.doi)"
          >
            <u>{{version.doi}}</u>
          </a>
        </el-col>
      </el-row>
    </div>
    <div class="label2"><em>NOTE: If dataset is currently embargoed, you may view the metadata pertaining to the dataset and rquest that access be permitted.</em></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { propOr } from 'ramda'

import FormatDate from '@/mixins/format-date'

export default {
  name: 'VersionHistory',

  mixins: [FormatDate],

  props: {
    versions: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
    /**
     * Gets dataset id
     * @returns {Number}
     */
    datasetId: function() {
      return propOr(0, 'id', this.datasetInfo)
    },
    latestVersionRevisionText: function() {
      let version = this.versions[0].version
      let revision = this.versions[0].revision || '0'
      let latestDate = this.versions[0].revisedAt || this.versions[0].firstPublishedAt
      let date = this.formatDate(latestDate)
      return `Version ${version}, Revision ${revision}; ${date}`
    },
    originalVersionRevisionText: function() {
      const originalVersionPosition = this.versions.length-1;
      let version = this.versions[originalVersionPosition].version
      let revision = this.versions[originalVersionPosition].revision || '0'
      let date = this.formatDate(this.versions[originalVersionPosition].firstPublishedAt)
      return `Version ${version}, Revision ${revision}; ${date}`
    },
  },
  methods: {
    getDoiLink(doi) {
      return doi ? `https://doi.org/${doi}` : ''
    },
    getVersionRevisionDate: function(version) {
      return version.revisedAt || version.versionPublishedAt
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.version-history-container {
  min-width: 30rem;
  width: 100%;
  .version-table {
    font-size: 0.875rem;
    line-height: 1rem;
    
  }
  .table-header {
    background-color: $background;
    font-weight: 600;
  }

  .table-rows {
    color: #000000;
    a {
      text-decoration: underline;
    }
  }
}
</style>
