<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <img
          v-show="activeTab === 'viewer'"
          ref="img"
          :src="imageSrc"
          class="image-viewer"
          @load="imageLoaded"
        />
      </detail-tabs>
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ fileName }}</h1>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
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
        <div class="file-detail">
          <strong class="file-detail__column_1">Type</strong>
          <div class="file-detail__column_2">
            {{ imageType }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Size</strong>
          <div class="file-detail__column_2">
            {{ imageSize }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Dataset id</strong>
          <div class="file-detail__column_2">
            {{ datasetId }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Version</strong>
          <div class="file-detail__column_2">
            {{ versionNumber }}
          </div>
        </div>
        <div class="pt-16">
          <bf-button @click="requestDownloadFile(file)">
            Download file
          </bf-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import discover from '@/services/discover'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import RequestDownloadFile from '@/mixins/request-download-file'
import FileDetails from '@/mixins/file-details'

import { baseName } from '@/utils/common'

export default {
  name: 'ImageViewerPage',

  components: {
    DetailTabs,
    BfButton
  },

  mixins: [FileDetails, RequestDownloadFile, FetchPennsieveFile],

  async asyncData({ route, $axios }) {
    const response = await discover.fetch(
      route.query.dataset_id,
      route.query.dataset_version,
      route.query.file_path,
      true
    )

    const imageInfo = {
      description: 'image description',
      name: baseName(route.query.file_path),
      src: `data:${route.query.mimetype};base64,${response.data}`,
      size: 'XxY',
      location: `files/${route.query.file_path}`
    }

    const filePath = imageInfo.location
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      route.query.dataset_id,
      route.query.dataset_version
    )

    return {
      imageInfo,
      file
    }
  },

  data: () => {
    return {
      tabs: [
        {
          label: 'Image Viewer',
          type: 'viewer'
        }
      ],
      activeTab: 'viewer'
    }
  },

  computed: {
    /**
     * Return the dataset id from the route query.
     * @returns String
     */
    datasetId: function() {
      return this.$route.query.dataset_id
    },

    /**
     * Return the version number from the route query.
     * @returns String
     */
    versionNumber: function() {
      return this.$route.query.dataset_version
    },

    /**
     * Return the type of an image.
     * @returns String
     */
    imageType: function() {
      return this.file.fileType
    },

    /**
     * Return a string that descripes the size of the image.
     * @returns String
     */
    imageSize: function() {
      return this.imageInfo.size
    },

    /**
     * Return the image src as a base64 description.
     * @returns String
     */
    imageSrc: function() {
      return this.imageInfo.src
    }
  },
  methods: {
    imageLoaded() {
      this.imageInfo.size = `${this.$refs.img.naturalWidth}x${this.$refs.img.naturalHeight}`
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';

.image-viewer {
  max-height: 100%;
  max-width: 100%;
}
</style>
