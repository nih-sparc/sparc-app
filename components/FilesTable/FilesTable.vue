<template>
  <div class="files-table">
    <div class="breadcrumb-list">
      <div v-for="(item, idx) in breadcrumbs" :key="idx" class="breadcrumb">
        <a
          class="breadcrumb-link"
          href="#"
          @click.prevent="breadcrumbNavigation(idx)"
        >
          {{ item }}
        </a>

        <span
          v-if="breadcrumbs.length > 1 && idx !== breadcrumbs.length-1"
          class="breadcrumb-separator"
        >
          /
        </span>
      </div>
    </div>

    <div class="files-table-table">
      <div v-if="hasError" class="error-wrap">
        <p>Sorry, an error has occurred</p>
        <el-button type="primary" @click="getFiles">
          Try again
        </el-button>
      </div>
      <el-table v-else v-loading="isLoading" :data="data">
        <el-table-column fixed prop="name" label="Name" width="340" sortable>
          <template slot-scope="scope">
            <div class="file-name-wrap">
              <template v-if="scope.row.type === 'Directory'">
                <i class="file-icon el-icon-folder" />
                <a
                  class="file-name"
                  href="#"
                  @click.prevent="path = scope.row.path"
                >
                  {{ scope.row.name }}
                </a>
              </template>

              <template v-else>
                <i
                  v-if="isImage(scope.row.fileType)"
                  class="file-icon el-icon-picture-outline"
                />
                <i v-else class="file-icon el-icon-document" />
                <div v-if="isMicrosoftFileType(scope)">
                  <a href="#" @click.prevent="openFile(scope)">
                    {{ scope.row.name }}
                  </a>
                </div>
                <div v-else>
                  {{ scope.row.name }}
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="File type" width="360">
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
          width="360"
          :formatter="formatStorage"
        />
        <el-table-column label="Operation" width="200">
          <template v-if="scope.row.type === 'File'" slot-scope="scope">
            <el-dropdown trigger="click" @command="onCommandClick">
              <el-button
                icon="el-icon-more"
                size="small"
                class="operation-button"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    type: 'requestDownloadFile',
                    scope
                  }"
                >
                  Download
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="isMicrosoftFileType(scope)"
                  :command="{
                    type: 'openFile',
                    scope
                  }"
                >
                  Open
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import FormatStorage from '@/mixins/bf-storage-metrics/index'

export default {
  name: 'FilesTable',

  mixins: [FormatStorage],

  props: {
    datasetDetails: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  data: function() {
    return {
      path: '',
      data: [],
      isLoading: false,
      hasError: false,
      limit: 500
    }
  },

  computed: {
    breadcrumbs: function() {
      return compose(reject(isEmpty), split('/'))(this.path)
    },

    /**
     * Compute endpoint URL to get dataset's files
     * @returns {String}
     */
    getFilesurl: function() {
      const id = pathOr('', ['params', 'datasetId'], this.$route)
      const version = propOr(1, 'version', this.datasetDetails)
      const url = `https://api.blackfynn.io/discover/datasets/${id}/versions/${version}/files/browse`

      return this.path
        ? `${url}?path=${this.path}&limit=${this.limit}`
        : `${url}?limit=${this.limit}`
    },

    /**
     * Url to retrieve the dataset to get the version number
     * @returns {String}
     */
    getFilesIdUrl: function() {
      const id = pathOr('', ['params', 'datasetId'], this.$route)
      const version = propOr(1, 'version', this.datasetDetails)
      return `https://api.blackfynn.io/discover/datasets/${id}/versions/${version}`
    }
  },

  watch: {
    getFilesIdUrl: {
      handler: function() {
        this.getDatasetVersionNumber()
      },
      immediate: true
    },

    path: {
      handler: function(val) {
        if (val !== '') {
          this.getFiles()
        }
      },
      immediate: true
    }
  },

  mounted: function() {},

  methods: {
    /**
     * Converts a semver version string to an integer
     * @param {String} semverVersion
     */
    convertSchemaVersionToInteger: function(semverVersion) {
      // split version number into three parts
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
            response.blackfynnSchemaVersion
          )
          if (schemaVersion < 4.0) {
            this.path = 'packages'
          } else {
            this.path = 'files'
          }
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
     * Get contents of directory
     */
    getFiles: function() {
      this.hasError = false
      this.isLoading = true

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
     * Navigate to another directory via breadcrumb
     * @param {Integer} idx
     */
    breadcrumbNavigation: function(idx) {
      const itemIdx = idx + 1

      this.path = compose(join('/'), slice(0, itemIdx))(this.breadcrumbs)
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
     * On command click callback for dropdown
     * @param {Object} evt
     */
    onCommandClick: function(evt) {
      const scope = propOr({}, 'scope', evt)
      const type = propOr({}, 'type', evt)
      const handler = this[type]

      if (typeof handler === 'function') {
        handler(scope)
      }
    },

    /**
     * Download file
     * @param {Object} scope
     */
    requestDownloadFile: function(scope) {
      const filePath = compose(
        last,
        defaultTo([]),
        split('s3://blackfynn-discover-use1/'),
        pathOr('', ['row', 'uri'])
      )(scope)

      const fileName = pathOr('', ['row', 'name'], scope)

      const requestUrl = `${process.env.portal_api}/download?key=${filePath}`
      this.$axios.$get(requestUrl).then(response => {
        this.downloadFile(fileName, response)
      })
    },

    /**
     * Opens a file in a new tab
     * This is currently for MS Word, MS Excel, and Powerpoint files only
     * @param {Object} scope
     */
    openFile: function(scope) {
      const filePath = compose(
        last,
        defaultTo([]),
        split('s3://blackfynn-discover-use1/'),
        pathOr('', ['row', 'uri'])
      )(scope)

      const requestUrl = `${process.env.portal_api}/download?key=${filePath}`

      this.$axios.$get(requestUrl).then(response => {
        const url = response
        const encodedUrl = encodeURIComponent(url)
        const finalURL = `https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`
        window.open(finalURL, '_blank')
      })
    },

    /**
     * Create an `a` tag to trigger downloading file
     * @param {String} filename
     * @param {String} url
     */
    downloadFile: function(filename, url) {
      const el = document.createElement('a')
      el.setAttribute('href', url)
      el.setAttribute('download', filename)

      el.style.display = 'none'
      document.body.appendChild(el)

      el.click()

      document.body.removeChild(el)
    },

    /**
     * Compute if the file is an image
     * @returns {Boolean}
     */
    isImage: function(fileType) {
      const images = ['JPG', 'PNG', 'JPEG', 'TIFF', 'GIF']
      return images.indexOf(fileType) >= 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.breadcrumb {
  display: flex;
  margin-bottom: 8px;
  background: none;
}
.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.breadcrumb-link {
  word-break: break-word;
  text-decoration: underline;
  color: $median;
}
.breadcrumb-separator {
  margin: 0 4px;
}
.files-table-table {
  background: #fff;
  padding: 16px;
}
.error-wrap {
  text-align: center;
}
.file-name-wrap {
  display: flex;
}

.file-name {
  color: $median;
}

.file-icon {
  color: #000;
  font-size: 16px;
  flex-shrink: 0;
  margin: 3px 8px 0 0;
}

::v-deep .el-table {
  th {
    .cell {
      color: black;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
    }
  }
}
</style>
