<template>
  <div class="pb-32">
    <div class="page-wrap container">
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ file.name }}</h1>
          <div class="page-heading__button">
            <bf-button @click="executeDownload(file)">
              Download
            </bf-button>
            <form ref="zipForm" method="POST" :action="zipitUrl">
              <input v-model="zipData" type="hidden" name="data" />
            </form>
          </div>
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
          <strong class="file-detail__column">Dataset</strong>
          <div class="file-detail__column">
            <nuxt-link
              :to="{
                name: 'datasets-datasetId',
                params: {
                  datasetId
                }
              }"
            >
              {{ datasetTitle }}
            </nuxt-link>
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File location</strong>
          <div class="file-detail__column">
            <nuxt-link
              :to="{
                name: `datasets-datasetId`,
                params: {
                  datasetId
                },
                query: {
                  datasetDetailsTab: 'files',
                  path: location
                }
              }"
            >
              {{ location }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <client-only>
        <content-tab-card
          v-if="hasViewer"
          class="tabs p-32"
          :tabs="tabs"
          :active-tab-id="activeTabId"
        >
          <biolucida-viewer
            v-if="hasBiolucidaViewer"
            v-show="activeTabId === 'imageViewer'"
            :data="biolucidaData"
          />
        </content-tab-card>
      </client-only>
    </div>
  </div>
</template>

<script>
import BiolucidaViewer from '@/components/BiolucidaViewer/BiolucidaViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import BfStorageMetrics from '@/mixins/bf-storage-metrics'
import DatasetInfo from '@/mixins/dataset-info'
import FormatDate from '@/mixins/format-date'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import FileDetails from '@/mixins/file-details'

import {
  compose,
  split,
  last,
  defaultTo,
  propOr
} from 'ramda'

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
  name: 'FileDetailPage',

  components: {
    BiolucidaViewer,
    DetailTabs,
    BfButton
  },

  mixins: [
    BfStorageMetrics,
    DatasetInfo,
    FormatDate,
    FetchPennsieveFile,
    FileDetails
  ],

  async asyncData({ redirect, route, error, $axios, app }) {
    const filePath = route.query.path
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      route.params.datasetId,
      route.params.datasetVersion,
      error
    )

    const sourcePackageId = file.sourcePackageId
    const biolucidaData = await $axios.$get(
      `${process.env.BL_API_URL}imagemap/sharelink/${sourcePackageId}/${route.params.datasetId}`
    )

    const hasBiolucidaViewer = biolucidaData.status !== 'error'

    let packageType = "None"
    if (sourcePackageId !== 'details') {
      packageType = file.packageType
    }
    const hasTimeseriesViewer = packageType === 'TimeSeries'
    if (hasTimeseriesViewer && process.env.SHOW_TIMESERIES_VIEWER) {
      redirect(`/datasets/timeseriesviewer?dataset_id=${route.params.datasetId}&dataset_version=${route.params.datasetVersion}&file_path=${filePath}`)
    }

    let activeTabId = hasBiolucidaViewer ? 'imageViewer' :
      hasTimeseriesViewer ? 'timeseriesViewer' : ''

    const datasetInfo = await DatasetInfo.methods.getDatasetInfo(
      $axios,
      route.params.datasetId,
      route.query.datasetVersion,
      app.$cookies.get('user-token')
    )

    return {
      biolucidaData,
      file,
      hasBiolucidaViewer,
      sourcePackageId,
      packageType,
      activeTabId,
      datasetInfo
    }
  },

  data: () => {
    return {
      biolucidaData: {
        biolucida_image_id: '',
        share_link: '',
        status: ''
      },
      tabs: [],
      file: {},
      zipData: '',
      zipitUrl: process.env.zipit_api_host
    }
  },

  computed: {
    /**
     * Compute location of the file
     * @returns {String}
     */
    location: function() {
      return this.file.path.replace(`/${this.file.name}`, '')
    },
    hasViewer: function() {
      return this.hasBiolucidaViewer
    },
    datasetId: function() {
      return this.$route.params.datasetId
    },
    /**
     * Return the dataset's name.
     * @returns String
     */
    datasetTitle: function() {
      return this.datasetInfo ? this.datasetInfo.name : 'Go to dataset'
    }
  },

  watch: {
    hasBiolucidaViewer: {
      handler: function(hasViewer) {
        if (hasViewer) {
          this.tabs.push({
            label: 'Image Viewer',
            id: 'imageViewer'
          })
        } else {
          this.tabs = this.tabs.filter(tab => tab.id !== 'imageViewer')
        }
      },
      immediate: true
    }
  },

  methods: {
    executeDownload(file) {
      const datasetVersionRegexp = /(?<datasetId>\d*)\/(?<version>\d*)\/(?<filePath>.*)/
      let params = file.uri.replace("s3://", "")
      let firstIndex = params.indexOf("/") + 1
      params = params.substr(firstIndex)
      const matches = params.match(datasetVersionRegexp)

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
     * Check if the file is openable
     * MS Office files and native browser files
     * - Documents (pdf, text)
     * - Images (jpg, png)
     * - Video (MP4)
     * - Vector Drawings (svg)
     */
    isFileOpenable(file) {
      if (!file.fileType) {
        return false
      }
      const allowableExtensions = Object.keys(contentTypes).map(key => key)
      const fileType = file.fileType.toLowerCase()
      return (
        this.isMicrosoftFileType(file) || allowableExtensions.includes(fileType)
      )
    },
    /**
     * Checks if file is MS Word, MS Excel, or MS Powerpoint
     * @param {Object} file
     */
    isMicrosoftFileType: function(file) {
      return (
        file.fileType === 'MSWord' ||
        file.fileType === 'MSExcel' ||
        file.fileType === 'PowerPoint'
      )
    },
    /**
     * Opens a file in a new tab
     * This is currently for MS Word, MS Excel, and Powerpoint files only
     * @param {Object} file
     */
    openFile: function(file) {
      this.getViewFileUrl(file).then(response => {
        window.open(response, '_blank')
      })
    },
    getViewFileUrl(file) {
      let uri = `${propOr('', 'uri', file).replace("s3://", "")}`
      let s3BucketName = uri.substring(0, uri.indexOf("/"))

      const filePath = compose(
        last,
        defaultTo([]),
        split(`s3://${s3BucketName}/`),
        propOr('', 'uri')
      )(file)

      const fileType = file.fileType.toLowerCase()
      const contentType = contentTypes[fileType]

      const requestUrl = `${process.env.portal_api}/download?s3BucketName=${s3BucketName}&key=${filePath}&contentType=${contentType}`

      return this.$axios.$get(requestUrl).then(response => {
        const url = response
        const encodedUrl = encodeURIComponent(url)
        return this.isMicrosoftFileType(file)
          ? `https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`
          : url
      })
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
  align-items: center;
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
.link-to-dataset {
  margin-right: 10px;
}
</style>
