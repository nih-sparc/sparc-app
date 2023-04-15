<template>
  <div class="version-history-container">
    <large-modal
      :visible="dialogVisible"
      @close-download-dialog="dialogVisible = false"
    >
      <div slot="optionalContent" class="content">
        <h1>Download</h1>
        <p>Download changelog file for Version {{changeLogFileInfo.version}} </p>
        <p>Published on: {{logPublishedAt}}</p>
        <el-button
          class="download-button"
          @click="downloadChangeLogFile(changeLogFileInfo.version)"
        >
          Download
        </el-button>
      </div>
      <div slot="mainContent" class="content">
        <h1>Changelog for Version {{changeLogFileInfo.version}}</h1>
        <div v-html="parseMarkdown(markdown)" />
        <el-button class="secondary" @click="dialogVisible = false">
          Close
        </el-button>
      </div>
    </large-modal>
    <div class="heading2 mb-8">
      Versions for this Dataset
    </div>
    <div class="mb-8">
      <span class="label4">Current version: </span
      >{{ latestVersionRevisionText }}
    </div>
    <div class="mb-8">
      <span class="label4">Original version: </span
      >{{ originalVersionRevisionText }}
    </div>
    <div class="mb-16">
      A dataset version refers to a DOI-specific, version-controlled iteration
      of a dataset. A new version of a dataset must be released when there are
      any changes to the files or scientific metadata made within a dataset. A
      dataset revision refers to an update made to dataset metadata (i.e. title,
      subtitle, description, etc.) that does not require an updated DOI.
    </div>
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
        <el-col :span="4">
          Changelog
        </el-col>
        <el-col :span="4" :push="1">
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
        <el-col v-if="isChangelogAvailable(version.version)" :span="4">
          <div class="circle" @click="viewChangeLogFile(version)">
            <sparc-tooltip placement="bottom-center" content="View changelog">
              <svg-icon
                slot="item"
                name="icon-view"
                height="1.5rem"
                width="1.5rem"
              />
            </sparc-tooltip>
          </div>
          <div class="circle" @click="downloadChangeLogFile(version.version)">
            <sparc-tooltip
              placement="bottom-center"
              content="Download changelog file"
            >
              <svg-icon
                slot="item"
                name="icon-download"
                height="1.5rem"
                width="1.5rem"
              />
            </sparc-tooltip>
          </div>
        </el-col>
        <el-col v-else :span="4">
          Not available
        </el-col>
        <el-col :span="4" :push="1">
          <a :href="getDoiLink(version.doi)">
            <u>{{ version.doi }}</u>
          </a>
        </el-col>
      </el-row>
    </div>
    <div v-if="embargoed" class="label2">
      <em
        >NOTE: If dataset is currently embargoed, you may view the metadata
        pertaining to the dataset and request that access be permitted.</em
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { propOr } from 'ramda'

import RequestDownloadFile from '@/mixins/request-download-file'
import FormatDate from '@/mixins/format-date'
import marked from '@/mixins/marked/index'

export default {
  name: 'VersionHistory',

  mixins: [FormatDate, RequestDownloadFile, marked],

  props: {
    versions: {
      type: Array,
      default: () => []
    },
  },
  data: function() {
    return {
      markdown: '',
      dialogVisible: false,
      changeLogFileInfo: {},
      changelogFiles: []
    }
  },
  async fetch() {
    const changelogFileRequests = []
    this.versions.forEach(({ version }) => {
      var changelogEndpoint = `${process.env.discover_api_host}/datasets/${this.datasetId}/versions/${version}/files?path=changelog.md`
      if (this.userToken) { changelogEndpoint += `&api_key=${this.userToken}` }
      changelogFileRequests.push(
        this.$axios.$get(changelogEndpoint).then(response => {
          return {
            ...response,
            version: version
          }
        }).catch(() => {
          return {}
        })
      )
    })

    this.changelogFiles = await Promise.all(changelogFileRequests)
  },
  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
    ...mapGetters('user', ['cognitoUserToken']),
    userToken() {
      return this.cognitoUserToken || this.$cookies.get('user-token')
    },
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
      let latestDate =
        this.versions[0].revisedAt || this.versions[0].firstPublishedAt
      let date = this.formatDate(latestDate)
      return `Version ${version}, Revision ${revision}; ${date}`
    },
    originalVersionRevisionText: function() {
      const originalVersionPosition = this.versions.length - 1
      let version = this.versions[originalVersionPosition].version
      let revision = this.versions[originalVersionPosition].revision || '0'
      let date = this.formatDate(
        this.versions[originalVersionPosition].firstPublishedAt
      )
      return `Version ${version}, Revision ${revision}; ${date}`
    },
    embargoed: function() {
      return propOr(false, 'embargo', this.datasetInfo)
    },
    logPublishedAt: function(){
      if (this.changeLogFileInfo.versionPublishedAt) {
        return this.formatDate(this.changeLogFileInfo.versionPublishedAt)
      }
      return ''
    },
  },
  methods: {
    getDoiLink(doi) {
      return doi ? `https://doi.org/${doi}` : ''
    },
    getVersionRevisionDate: function(version) {
      return version.revisedAt || version.versionPublishedAt
    },
    isChangelogAvailable: function(version) {
      return this.changelogFiles.some(file => file.version === version)
    },
    getChangelogFile(version) {
      return this.changelogFiles.find(file => file.version === version) || {}
    },
    viewChangeLogFile(versionInfo) {
      // Note that requestFileContent is a mixin
      this.requestFileContent(this.getChangelogFile(versionInfo.version)).then(content => {
        this.markdown = content
        this.dialogVisible = true
        this.changeLogFileInfo = versionInfo // Set the version metadata for the currently stored markdown
      })
    },
    downloadChangeLogFile(version) {
      this.requestDownloadFile(this.getChangelogFile(version))
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
  .changelog-file {
    cursor: pointer;
  }
  .circle {
    font-size: 1rem;
    display: inline-block;
    height: 1.5em;
    width: 1.5em;
    line-height: 1.5em;
    margin-right: 4px;
    -moz-border-radius: 0.75em; /* or 50% */
    border-radius: 0.75em; /* or 50% */
    background-color: $purple;
    color: #fff;
    cursor: pointer;
    writing-mode: vertical-rl;
    -webkit-writing-mode: vertical-rl;
    vertical-align: top;
  }
}
</style>
