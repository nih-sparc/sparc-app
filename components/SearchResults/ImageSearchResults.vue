<template>
  <el-table :data="tableData">
    <el-table-column :fixed="true" prop="name" label="Name" width="300" />
    <el-table-column prop="fileType" label="File Type" />
    <el-table-column prop="size" label="Size">
      <template slot-scope="scope">
        {{ formatMetric(scope.row.size) }}
      </template>
    </el-table-column>
    <el-table-column
      align="right"
      fixed="right"
      label="Operation"
      min-width="100"
      width="100"
    >
      <template slot-scope="scope">
        <el-dropdown trigger="click" @command="onCommandClick">
          <el-button icon="el-icon-more" />
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
              v-if="scope.row.sourcePackageId"
              :command="{
                type: 'openFile',
                scope
              }"
            >
              Open
            </el-dropdown-item>
            <el-dropdown-item
              :command="{
                type: 'openDataset',
                scope
              }"
            >
              Open Dataset
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { compose, last, defaultTo, split, pathOr, propOr } from 'ramda'
import StorageMetrics from '@/mixins/bf-storage-metrics'

export default {
  name: 'ImageSearchResults',

  mixins: [StorageMetrics],

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    /**
     * Callback for operations menu click
     * Invoke method for the received command, if available
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
     * Open dataset that the file belongs to
     * @param {Object} scope
     */
    openDataset: function(scope) {
      const datasetId = pathOr('', ['row', 'datasetId'], scope)
      if (datasetId) {
        this.$router.push({
          name: 'datasets-datasetId',
          params: { datasetId }
        })
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

      const requestUrl = `/api/download?key=${filePath}`

      this.$axios.get(requestUrl).then(response => {
        this.downloadFile(fileName, response.data)
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
     * Open the file
     * @param {Object} scope
     */
    openFile: function(scope) {
      const sourcePackageId = pathOr('', ['row', 'sourcePackageId'], scope)
      if (sourcePackageId) {
        this.$router.push({
          name: 'file-id',
          params: {
            id: sourcePackageId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}
</style>
