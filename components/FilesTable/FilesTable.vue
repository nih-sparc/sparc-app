<template>
  <div class="files-table">
    <div class="files-table-header">
      <div class="breadcrumb-list">
        <div v-for="(item, idx) in breadcrumbs" :key="idx" class="breadcrumb">
          <nuxt-link
            class="breadcrumb-link"
            :to="{
              query: { ...$route.query, path: breadcrumbNavigation(idx) }
            }"
          >
            {{ item }}
          </nuxt-link>
          <span
            v-if="breadcrumbs.length > 1 && idx !== breadcrumbs.length - 1"
            class="breadcrumb-separator"
          >
            /
          </span>
        </div>
      </div>
    </div>

    <div class="files-table-table">
      <div v-if="hasError" class="error-wrap">
        <p>Sorry, an error has occurred</p>
        <el-button type="primary" @click="getFiles">
          Try again
        </el-button>
      </div>
      <el-table
        v-else
        ref="table"
        v-loading="isLoading"
        :data="data"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" fixed width="45" />
        <el-table-column fixed prop="name" label="Name" min-width="150" sortable :sort-method="(a, b) => sortWithCaseInsensitive(a.name, b.name)">
          <template slot-scope="scope">
            <div class="file-name-wrap">
              <template v-if="scope.row.type === 'Directory'">
                <i class="file-icon el-icon-folder" />
                <sparc-tooltip placement="left-center" :content="scope.row.name">
                  <nuxt-link
                    slot="item"
                    class="file-name truncated"
                    :to="{ query: { ...$route.query, path: scope.row.path } }"
                  >
                    {{ scope.row.name }}
                  </nuxt-link>
                </sparc-tooltip>
              </template>

              <template v-else>
                <i
                  v-if="isImage(scope.row.fileType)"
                  class="file-icon el-icon-picture-outline"
                />
                <i v-else class="file-icon el-icon-document" />
                <div v-if="isFileOpenable(scope)" class="truncated">
                    <sparc-tooltip placement="left-center" :content="scope.row.name">
                      <a class="truncated" slot="item" href="#" @click.prevent="openFile(scope)">
                        {{ scope.row.name }}
                      </a>
                    </sparc-tooltip>
                </div>
                <div v-else-if="isScaffoldMetaFile(scope)" class="truncated">
                  <sparc-tooltip placement="left-center" :content="scope.row.name">
                    <nuxt-link slot="item" class="truncated" :to="getScaffoldLink(scope)">
                      {{ scope.row.name }}
                    </nuxt-link>
                  </sparc-tooltip>
                </div>
                <div v-else class="truncated">
                  <sparc-tooltip placement="left-center" :content="scope.row.name">
                    <nuxt-link
                      slot="item"
                      class="truncated"
                      :to="{
                        name: 'file-datasetId-datasetVersion',
                        params: {
                          datasetId: datasetInfo.id,
                          datasetVersion: datasetInfo.version
                        },
                        query: {
                          path: scope.row.path
                        }
                      }"
                    >
                      {{ scope.row.name }}
                    </nuxt-link>
                  </sparc-tooltip>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="File type" width="280" sortable>
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'Directory'">
              Folder
            </template>

            <template v-else>
              {{ scope.row.fileType }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="Size"
          width="220"
          :formatter="formatStorage"
          sortable
        />
        <el-table-column label="Action" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'File'">
              <div v-if="!isFileTooLarge(scope.row)" class="circle" @click="executeDownload(scope.row)">
                <form
                  id="zipForm"
                  ref="zipForm"
                  method="POST"
                  :action="zipitUrl"
                >
                  <input v-model="zipData" type="hidden" name="data" />
                </form>
                <sparc-tooltip
                  placement="bottom-center"
                  content="Download file"
                >
                  <svg-icon slot="item" name="icon-download" height="1.5rem" width="1.5rem" />
                </sparc-tooltip>
              </div>
              <div v-else class="circle disabled">
                <sparc-tooltip
                  placement="bottom-center"
                  content="Files over 5GB in size must be downloaded via AWS"
                >
                  <svg-icon slot="item" name="icon-download" height="1.5rem" width="1.5rem" />
                </sparc-tooltip>
              </div>
              <div
                v-if="isFileOpenable(scope)"
                class="circle"
                @click="openFile(scope)"
              >
                <sparc-tooltip
                  placement="bottom-center"
                  content="View file in web viewer"
                >
                  <svg-icon slot="item" name="icon-open" height="1.5rem" width="1.5rem" />
                </sparc-tooltip>
              </div>
              <div
                v-if="isScaffoldMetaFile(scope)"
                class="circle"
                @click="openScaffold(scope)"
              >
                <sparc-tooltip
                  placement="bottom-center"
                  content="Open as 3d scaffold"
                >
                  <svg-icon slot="item" name="icon-view" height="1.5rem" width="1.5rem" />
                </sparc-tooltip>
              </div>
              <div
                v-if="hasOsparcViewer(scope)"
                class="circle"
                @click="setDialogSelectedFile(scope)"
              >
                <sparc-tooltip
                  placement="bottom-center"
                >
                  <div slot="data">
                    Open in oSPARC. More info on oSPARC can be found
                    <a href="/help/4EFMev665H4i6tQHfoq5NM" target="_blank">
                      <u>here</u>
                    </a>
                  </div>
                  <svg-icon slot="item" name="icon-view" height="1.5rem" width="1.5rem" />
                </sparc-tooltip>
              </div>
              <div
                v-if="isFileOpenable(scope)"
                class="circle"
                @click="copyS3Url(scope)"
              >
                <sparc-tooltip
                  placement="bottom-center"
                  content="Copy link"
                >
                  <svg-icon slot="item" name="icon-permalink-nobg" height="1.5rem" width="1.5rem" />
                </sparc-tooltip>
              </div>
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
      </el-table>
      <osparc-file-viewers-dialog
        :open="dialogSelectedFile !== null"
        :viewers="osparcViewers"
        :selected-file="dialogSelectedFile"
        @close="() => setDialogSelectedFile(null)"
      />
    </div>
    <sparc-tooltip
      v-if="selected.length == 0"
      class="tooltip"
      placement="bottom-center"
      content="You must select a file to download"
    >
      <bf-download-file
        slot="item"
        class="mt-16"
        disabled
        :selected="selected"
        :dataset="datasetInfo"
        :file-path="path"
        @remove-selection="removeSelection"
      />
    </sparc-tooltip>
    <sparc-tooltip
      v-else-if="selectedFilesSizeTooLarge"
      class="tooltip"
      placement="bottom-center"
      content="Selected file size(s) exceed 5GB"
    >
      <bf-download-file
        slot="item"
        class="mt-16"
        disabled
        :selected="selected"
        :dataset="datasetInfo"
        :file-path="path"
        @remove-selection="removeSelection"
      />
    </sparc-tooltip>
    <bf-download-file
      v-else
      class="mt-16"
      :selected="selected"
      :dataset="datasetInfo"
      :file-path="path"
      @remove-selection="removeSelection"
    />
  </div>
</template>

<script>
import {
  compose,
  isEmpty,
  join,
  reject,
  slice,
  split,
  propOr,
  last,
  defaultTo,
  pathOr
} from 'ramda'

import BfDownloadFile from '@/components/BfDownloadFile/BfDownloadFile'
import OsparcFileViewersDialog from '@/components/FilesTable/OsparcFileViewersDialog.vue'
import { mapState } from 'vuex'

import FormatStorage from '@/mixins/bf-storage-metrics/index'
import { successMessage, failMessage } from '@/utils/notification-messages'

import { extractExtension } from '@/pages/data/utils'

export const contentTypes = {
  pdf: 'application/pdf',
  text: 'text/plain',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'img/svg+xml',
  mp4: 'video/mp4',
  csv: 'text/csv'
}

export default {
  name: 'FilesTable',

  components: {
    BfDownloadFile,
    OsparcFileViewersDialog
  },

  mixins: [FormatStorage],

  props: {
    osparcViewers: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  data: function() {
    return {
      previousPath: '',
      schemaRootPath: 'files',
      data: [],
      isLoading: false,
      hasError: false,
      limit: 500,
      selected: [],
      dialogSelectedFile: null,
      zipData: ''
    }
  },

  computed: {
    /**
     * Get dataset info from the store
     * @returns {Object}
     */
    ...mapState('pages/datasets/datasetId', ['datasetInfo']),
    /**
     * Compute the current path for the dataset's files.
     * @returns {String}
     */
    path: function() {
      return this.$route.query.path
        ? this.$route.query.path
        : this.schemaRootPath
    },

    breadcrumbs: function() {
      return compose(reject(isEmpty), split('/'))(this.path)
    },

    /**
     * Compute endpoint URL to get dataset's files
     * @returns {String}
     */
    getFilesurl: function() {
      const id = pathOr('', ['params', 'datasetId'], this.$route)
      const version = this.datasetVersion
      const url = `${process.env.bf_api_host}/discover/datasets/${id}/versions/${version}/files/browse`

      return `${url}?path=${this.path}&limit=${this.limit}`
    },

    /**
     * Url to retrieve the dataset to get the version number
     * @returns {String}
     */
    getFilesIdUrl: function() {
      const id = pathOr('', ['params', 'datasetId'], this.$route)
      const version = this.datasetVersion
      return `${process.env.bf_api_host}/discover/datasets/${id}/versions/${version}`
    },

    /**
     * Compute the version of this dataset.
     * @returns {String}
     */
    datasetVersion: function() {
      return propOr(1, 'version', this.datasetInfo)
    },
    /**
     * Compute URL for zipit service
     * @returns {String}
     */
    zipitUrl: function() {
      return process.env.zipit_api_host
    },
    selectedFilesSizeTooLarge: function() {
      let totalSize = 0
      this.selected.forEach(file => {
        totalSize += file.size
      })
      return totalSize >= process.env.max_download_size
    }
  },

  watch: {
    '$route.query.path': 'pathQueryChanged'
  },

  created: function() {
    this.getFiles()
  },

  methods: {
    /**
     * Check if the file is openable
     * MS Office files and native browser files
     * - Documents (pdf, text)
     * - Images (jpg, png)
     * - Video (MP4)
     * - Vector Drawings (svg)
     */
    isFileOpenable(scope) {
      const allowableExtensions = Object.keys(contentTypes).map(key => key)
      const fileType = scope.row.fileType.toLowerCase()
      return (
        this.isMicrosoftFileType(scope) ||
        allowableExtensions.includes(fileType)
      )
    },

    isFileTooLarge(file) {
      const fileSize = propOr(0, 'size', file)
      return fileSize > process.env.max_download_size
    },

    handleSelectionChange(val) {
      this.selected = val
    },

    /**
     * Converts a semver version string to an integer
     * @param {String} semverVersion
     */
    convertSchemaVersionToInteger: function(semverVersion) {
      // split version number into parts
      let parts = semverVersion.split('.')
      // make sure no part is larger than 1023 or else it won't fit
      // into 32-bit integer
      parts.forEach(part => {
        if (part >= 1024) {
          throw new Error(`Version string invalid, ${part} is too large`)
        }
      })
      let numericVersion = 0
      // shift all parts either 0, 10, or 20 bits to the left
      for (let i = 0; i < 3; i++) {
        numericVersion |= parts[i] << (i * 10)
      }
      return numericVersion
    },

    /**
     * Gets the dataset version number to get the files for the dataset
     */
    getDatasetVersionNumber: function() {
      this.isLoading = true
      this.hasError = false

      this.$axios
        .$get(this.getFilesIdUrl)
        .then(response => {
          const schemaVersion = this.convertSchemaVersionToInteger(
            response.pennsieveSchemaVersion
          )
          if (schemaVersion < 4.0) {
            this.schemaRootPath = 'packages'
          }
          this.getFiles()
        })
        .catch(() => {
          this.hasError = true
        })
    },
    /**
     * Checks if file is MS Word, MS Excel, or MS Powerpoint
     * @param {Object} scope
     */
    isMicrosoftFileType: function(scope) {
      return (
        scope.row.fileType === 'MSWord' ||
        scope.row.fileType === 'MSExcel' ||
        scope.row.fileType === 'PowerPoint'
      )
    },
    /**
     * Checks if file has a viewer in oSPARC
     * @param {Object} scope
     */
    hasOsparcViewer(scope) {
      const fileType = extractExtension(scope.row.path)
      return Object.keys(this.osparcViewers).includes(fileType)
    },
    /**
     * Get contents of directory
     */
    getFiles: function() {
      this.hasError = false
      this.isLoading = true
      this.previousPath = this.path

      this.$axios
        .$get(this.getFilesurl)
        .then(response => {
          this.data = response.files
        })
        .catch(() => {
          this.hasError = true
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    /**
     * When the path query changes get files.
     */
    pathQueryChanged: function() {
      this.getFiles()
    },

    /**
     * Navigate to another directory via breadcrumb
     * @param {Integer} idx
     */
    breadcrumbNavigation: function(idx) {
      const itemIdx = idx + 1

      return compose(join('/'), slice(0, itemIdx))(this.breadcrumbs)
    },

    /**
     * Format storage column
     * @param {Object} row
     * @param {Object} column
     * @param {Number} cellValue
     * @returns {String}
     */
    formatStorage: function(row, column, cellValue) {
      return this.formatMetric(cellValue)
    },

    /**
     * Shows the oSPARC viewers selector
     */
    setDialogSelectedFile: function(scope) {
      this.dialogSelectedFile = scope ? scope.row : null
    },

    getViewFileUrl(scope) {
      const filePath = compose(
        last,
        defaultTo([]),
        split('s3://pennsieve-prod-discover-publish-use1/'),
        pathOr('', ['row', 'uri'])
      )(scope)

      const fileType = scope.row.fileType.toLowerCase()
      const contentType = contentTypes[fileType]

      const requestUrl = `${process.env.portal_api}/download?key=${filePath}&contentType=${contentType}`

      return this.$axios.$get(requestUrl).then(response => {
        const url = response
        const encodedUrl = encodeURIComponent(url)
        return this.isMicrosoftFileType(scope)
          ? `https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`
          : url
      })
    },

    /**
     * Opens a file in a new tab
     * This is currently for MS Word, MS Excel, and Powerpoint files only
     * @param {Object} scope
     */
    openFile: function(scope) {
      this.getViewFileUrl(scope).then(response => {
        window.open(response, '_blank')
      })
    },

    executeDownload(downloadInfo) {
      const datasetVersionRegexp = /s3:\/\/pennsieve-prod-discover-publish-use1\/(?<datasetId>\d*)\/(?<version>\d*)\/(?<filePath>.*)/
      const matches = downloadInfo.uri.match(datasetVersionRegexp)

      const payload = {
        paths: [matches.groups.filePath],
        datasetId: matches.groups.datasetId,
        version: matches.groups.version
      }

      this.zipData = JSON.stringify(payload, undefined)
      this.$nextTick(() => {
        this.$refs.zipForm.submit() // eslint-disable-line no-undef
      })
    },

    /**
     * Create nuxt-link object for opening a scaffold.
     * @param {Object} scope
     */
    getScaffoldLink: function(scope) {
      const id = pathOr('', ['params', 'datasetId'], this.$route)
      const version = this.datasetVersion
      let s3Path = `${id}/${version}/${scope.row.path}`
      return {
        name: 'datasets-scaffoldviewer-id',
        params: {},
        query: { scaffold: s3Path }
      }
    },

    /**
     * Open scaffold
     * @param {Object} scope
     */
    openScaffold: function(scope) {
      this.$router.push(this.getScaffoldLink(scope))
    },

    /**
     * Checks if file is openable by scaffold viewer
     * @param {Object} scope
     */
    isScaffoldMetaFile: function(scope) {
      let path = scope.row.path.toLowerCase()
      return (
        path.includes('scaffold') &&
        path.includes('meta') &&
        path.includes('json')
      )
    },

    /**
     * Compute if the file is an image
     * @returns {Boolean}
     */
    isImage: function(fileType) {
      const images = ['JPG', 'PNG', 'JPEG', 'TIFF', 'GIF']
      return images.indexOf(fileType) >= 0
    },

    /**
     * Remove selection
     * @param {Object} row
     */
    removeSelection(row) {
      this.selected = this.selected.filter(f => f.path !== row.path)

      const selectedPaths = this.selected.map(s => s.path)
      this.data.forEach(r => {
        this.$refs.table.toggleRowSelection(r, selectedPaths.includes(r.path))
      })
    },

    /**
     * Copy file URL to clipboard
     * @param {Object} scope
     */
    copyS3Url(scope) {
      this.getViewFileUrl(scope).then(response => {
        this.$copyText(response).then(
          () => {
            this.$message(successMessage(`File URL copied to clipboard.`))
          },
          () => {
            this.$message(failMessage(`Cannot copy to clipboard.`))
          }
        )
      })
    },
    sortWithCaseInsensitive(name1, name2) {
      var a = name1.toUpperCase(); 
      var b = name2.toUpperCase(); 
      if (a > b) 
         return 1 
      if (a < b) 
         return -1 
      return 0; 
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.breadcrumb {
  background: none;
  height: auto;
}
.tooltip {
  width: fit-content;
}
.files-table-header {
  align-items: center;
  display: flex;
}
.breadcrumb-list {
  align-items: center;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.breadcrumb-link {
  word-break: break-word;
  text-decoration: underline;
  color: $purple;
}
.breadcrumb-separator {
  margin: 0 4px;
}
.files-table-table {
  background: #fff;
}
.error-wrap {
  text-align: center;
}
.file-name-wrap {
  display: flex;
}
.truncated {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-name {
  color: $purple;
}
.file-icon {
  color: #000;
  font-size: 16px;
  flex-shrink: 0;
  margin: 3px 8px 0 0;
}
.circle {
  display: inline-flex;
  height: 1.5em;
  width: 1.5em;
  line-height: 1.5em;
  margin-right: 4px;
  -moz-border-radius: 0.75em; /* or 50% */
  border-radius: 0.75em; /* or 50% */
  background-color: $purple;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.disabled {
  opacity: .6;
}
::v-deep .el-table {
  th {
    .cell {
      color: black;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
    }
    &.el-table-column--selection .cell {
      padding: 0 16px;
      text-overflow: unset;
    }
  }
}
</style>
