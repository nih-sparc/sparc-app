<template>
  <div class="subpage">
    <div class="page-heading">
      <h2>{{ fileName }}</h2>
    </div>
    <div class="file-detail">
      <strong class="file-detail__column_1">Type</strong>
      <div class="file-detail__column_2">
        {{ fileType }}
      </div>
    </div>
    <div class="file-detail">
      <strong class="file-detail__column_1">Dataset</strong>
      <div class="file-detail__column_2">
        <nuxt-link
          :to="{
            name: 'datasets-datasetId',
            params: {
              datasetId
            }
          }"
        >
          {{ datasetTitle  }}
        </nuxt-link>
      </div>
    </div>
    <div class="file-detail">
      <strong class="file-detail__column_1">File location</strong>
      <div class="file-detail__column_2">
        <nuxt-link
          :to="{
            name: `datasets-datasetId`,
            params: {
              datasetId: datasetId
            },
            query: {
              datasetDetailsTab: 'files',
              path: fileFolderLocation
            }
          }"
        >
          {{ filePath }}
        </nuxt-link>
      </div>
    </div>
    <div class="pt-16">
      <bf-button @click="requestDownloadFile(file)">
        Download file
      </bf-button>
    </div>
  </div>
</template>

<script>
import RequestDownloadFile from '@/mixins/request-download-file'
import FileDetails from '@/mixins/file-details'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import { propOr } from 'ramda'

export default {
  name: "VideoViewerMetadata",
  components: {
    BfButton
  },
  props: {
    file: {
      type: Object,
      default: () => {}
    },
    datasetInfo: {
      type: Object,
      default: () => {}
    },
  },
  mixins: [FileDetails, RequestDownloadFile],

  computed: {
    datasetTitle: function() {
      return propOr("", 'name', this.datasetInfo)
    },
    datasetId() {
      return propOr(undefined, "id", this.datasetInfo)
    },
    fileType: function() {
      return this.file.fileType
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/_viewer.scss';
</style>
