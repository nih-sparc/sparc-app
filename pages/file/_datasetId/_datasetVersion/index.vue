<template>
  <div class="pb-32">
    <div class="page-wrap container">
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ file.name }}</h1>
          <div class="page-heading__button">
            <bf-button @click="requestDownloadFile(file)">
              Download
            </bf-button>
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            {{ file.fileType }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Size</strong>
          <div class="file-detail__column">
            {{ file.size ? formatMetric(file.size) : 'undefined' }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Date Created</strong>
          <div class="file-detail__column">
            {{ file.createdAt ? formatDate(file.createdAt) : 'undefined' }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Location</strong>
          <div class="file-detail__column">
            {{ location }}
          </div>
        </div>
      </div>
      <content-tab-card
        v-if="hasViewer"
        class="tabs p-32"
        :tabs="tabs"
        :active-tab-id="activeTabId"
      >
        <biolucida-viewer
          v-show="activeTabId === 'imageViewer'"
          :data="biolucidaData"
        />
      </content-tab-card>
    </div>
  </div>
</template>

<script>
import BiolucidaViewer from '@/components/BiolucidaViewer/BiolucidaViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import BfStorageMetrics from '@/mixins/bf-storage-metrics'
import FormatDate from '@/mixins/format-date'
import RequestDownloadFile from '@/mixins/request-download-file'

export default {
  name: 'FileDetailPage',

  components: {
    BiolucidaViewer,
    DetailTabs,
    BfButton
  },

  mixins: [BfStorageMetrics, FormatDate, RequestDownloadFile],

  async asyncData({ route, $axios }) {
    const fileLocationEndIndex = route.query.path.lastIndexOf('/')
    const filesLocation = route.query.path.substring(0, fileLocationEndIndex)
    const filesUrl = `${process.env.discover_api_host}/datasets/${route.params.datasetId}/versions/${route.params.datasetVersion}/files/browse?path=${filesLocation}`
    const response = await $axios.$get(filesUrl)
    const files = response.files
    // workaround to using pennsieve endpoint https://docs.pennsieve.io/reference/getfile-1 to get the file
    // we can replace this once the discrepencies between the getFile and browseFiles pennsieve endpoint responses are figured out
    // for files containing multiple extensions. i.e. the file pCm165_AAV_05Z_20x_20200212_S2.lsm.jpx found in dataset 221
    const file = files.find(element => element.path === route.query.path || element.uri.includes(route.query.path))

    const sourcePackageId = file.sourcePackageId
    const biolucidaData = await $axios.$get(
      `${process.env.BL_SERVER_URL}imagemap/sharelink/${sourcePackageId}/${route.params.datasetId}`
    )

    const hasViewer = biolucidaData.status !== 'error'

    return {
      biolucidaData,
      file,
      hasViewer
    }
  },

  data: () => {
    return {
      biolucidaData: {
        biolucida_image_id: '',
        share_link: '',
        status: ''
      },
      tabs: [
        {
          label: 'Image Viewer',
          id: 'imageViewer'
        }
      ],
      activeTabId: 'imageViewer',
      file: {}
    }
  },

  computed: {
    /**
     * Compute location of the file
     * @returns {String}
     */
    location: function() {
      return this.file.path.replace(`/${this.file.name}`, '')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
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
  border-bottom: 1px solid $lineColor2;
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

.tabs {
  border: 1px solid $lineColor2;
}
</style>
