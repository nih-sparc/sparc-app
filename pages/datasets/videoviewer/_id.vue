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
              <source :src="video_src" :type="mimetype" size="1080" />
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
          <h1>{{ fileName }}</h1>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File location</strong>
          <div class="file-detail__column">
            <nuxt-link 
              :to="{
                name: `datasets-datasetId`,
                params: {
                  datasetId: datasetId, 
                },
                query: {
                  datasetDetailsTab: 'files',
                  path: fileFolderLocation
                }
              }">
              {{ filePath }}
            </nuxt-link>   
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            {{fileType}}
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
            {{fileQueryParam}}
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
import RequestDownloadFile from '@/mixins/request-download-file'

export default {
  name: 'VideoViewerPage',

  components: {
    DetailTabs,
    BfButton
  },

  mixins: [RequestDownloadFile],

  async asyncData({ route, $axios }) {
    let signedUrl = await $axios
      .$get(
        `${process.env.portal_api}/download?key=${route.query.file_path}&contentType=${route.query.mimetype}`
      )
      .then(response => {
        return response
      })
    let filePath = route.query.file_path
    filePath = filePath.substring(filePath.indexOf("files"))
    const fileUrl = `${process.env.discover_api_host}/datasets/${route.query.dataset_id}/versions/${route.query.dataset_version}/files?path=${filePath}`
    const file = await $axios.$get(fileUrl)
    return {
      video_src: signedUrl,
      mimetype: route.query.mimetype,
      file,
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
     * Get the file name from the file prop.
     * @returns String
     */
    fileName: function() {
      return this.file.name
    },

    /**
     * Get the file name from the file prop.
     * @returns String
     */
    filePath: function() {
      return this.file.path
    },

    fileFolderLocation: function() {
      return this.filePath.substring(0, this.filePath.lastIndexOf(this.fileName))
    },

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
  mounted() {
    this.player = new Plyr(this.$refs.vid)
  }
}
</script>

<style scoped lang="scss">
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
<style lang="scss">
.video-container {
  padding-top: 8px;
}
.video {
  width: 100%;
}
</style>
