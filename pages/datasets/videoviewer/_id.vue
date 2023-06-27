<template>
  <div class="video-viewer-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <client-only placeholder="Loading video ...">
          <div class="video-container">
            <video ref="vid" class="video" controls crossorigin playsinline>
              <source :src="video_src" :type="mimetype" size="1080" @error="failedVideoHandler"/>
              <p>
                Your browser doesn't support HTML5 video. Here is a a
                <a :href="video_src">link to the video</a> instead.
              </p>
            </video>
          </div>
        </client-only>
      </detail-tabs>
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
              Go to dataset
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
    </div>
  </div>
</template>

<script>
import Plyr from 'plyr'

import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import DatasetInfo from '@/mixins/dataset-info'
import RequestDownloadFile from '@/mixins/request-download-file'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import FileDetails from '@/mixins/file-details'

import { failMessage } from '@/utils/notification-messages'

import { extractS3BucketName } from '@/utils/common'

export default {
  name: 'VideoViewerPage',

  components: {
    DetailTabs,
    BfButton
  },

  mixins: [DatasetInfo, FileDetails, RequestDownloadFile, FetchPennsieveFile],

  async asyncData({ app, route, error, $axios }) {

    const datasetInfo = await DatasetInfo.methods.getDatasetInfo(
      $axios,
      route.query.dataset_id,
      route.query.dataset_version,
      app.$cookies.get('user-token')
    )

    const s3Bucket = datasetInfo ? extractS3BucketName(datasetInfo.uri) : undefined

    const config = {
      params: {
        key: route.query.file_path,
        contentType: route.query.mimetype,
      }
    }

    if (s3Bucket) {
      config.params.s3BucketName = s3Bucket
    }

    let signedUrl = await $axios
      .$get(
        `${process.env.portal_api}/download`,
        config
      )
      .then(response => {
        return response
      })
    let filePath = route.query.file_path
    filePath = filePath.substring(filePath.indexOf('files'))
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      route.query.dataset_id,
      route.query.dataset_version,
      error
    )
    return {
      video_src: signedUrl,
      mimetype: route.query.mimetype,
      file
    }
  },

  data: () => {
    return {
      tabs: [
        {
          label: 'Video Viewer',
          type: 'video'
        }
      ],
      activeTab: 'video',
      file: {},
      traditional: true,
      backgroundToggle: true
    }
  },
  computed: {
    /**
     * Get the file type from the file prop.
     * @returns String
     */
    fileType: function() {
      return this.file.fileType
    },

    /**
     * Get the dataset id from the query parameter.
     * @returns Number
     */
    datasetId: function() {
      return this.$route.query.dataset_id
    },

    /**
     * Get the version number from the query parameter.
     * @returns Number
     */
    versionNumber: function() {
      return this.$route.query.dataset_version
    }
  },
  methods: {
    failedVideoHandler: function() {
      this.$message(
        failMessage('There was a problem while opening the video. Please try with another browser or use the Download button below.')
      )
    }
  },
  mounted() {
    this.player = new Plyr(this.$refs.vid)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';
</style>
<style lang="scss">
.video-container {
  padding-top: 0.5rem;
}
.video {
  width: 100%;
}
.page-heading {
  margin-bottom: 1.375rem;
}
</style>
