<template>
  <div class="pb-32">
    <div class="page-wrap container">
      <form ref="zipForm" method="POST" :action="zipitUrl">
        <input v-model="zipData" type="hidden" name="data" />
      </form>
      <client-only>
        <content-tab-card
          v-if="hasViewer"
          :tabs="tabs"
          :active-tab-id="activeTabId"
        >
          <biolucida-viewer
            v-if="hasBiolucidaViewer"
            v-show="activeTabId === 'imageViewer'"
            :data="biolucidaData"
            :datasetInfo="datasetInfo"
            :file="file"
          />
          <segmentation-viewer
            v-if="hasSegmentationViewer"
            v-show="activeTabId === 'segmentationViewer'"
            :data="segmentationData"
            :datasetInfo="datasetInfo"
            :file="file"
          />
          <plot-viewer
            v-if="hasPlotViewer"
            v-show="activeTabId === 'plotViewer'"
            :plotData="plotData"
            :datasetInfo="datasetInfo"
            :file="file"
          />
          <video-viewer
            v-if="hasVideoViewer"
            v-show="activeTabId === 'videoViewer'"
            :videoData="videoData"
            :videoSource="signedUrl"
            :datasetInfo="datasetInfo"
            :file="file"
          />
        </content-tab-card>
      </client-only>
      <file-viewer-metadata
        v-if="!hasViewer"
        :datasetInfo="datasetInfo"
        :file="file"
        @download-file="executeDownload"
      />
    </div>
  </div>
</template>

<script>
import scicrunch from '@/services/scicrunch'
import BiolucidaViewer from '@/components/BiolucidaViewer/BiolucidaViewer'
import PlotViewer from '@/components/PlotViewer/PlotViewer'
import VideoViewer from '@/components/VideoViewer/VideoViewer'
import SegmentationViewer from '@/components/SegmentationViewer/SegmentationViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import FileViewerMetadata from '@/components/ViewersMetadata/FileViewerMetadata.vue'

import DatasetInfo from '@/mixins/dataset-info'
import FormatDate from '@/mixins/format-date'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import FileDetails from '@/mixins/file-details'

import { extractS3BucketName } from '@/utils/common'

import { isEmpty, pathOr, propOr } from 'ramda'

export default {
  name: 'FileDetailPage',

  components: {
    BiolucidaViewer,
    PlotViewer,
    VideoViewer,
    SegmentationViewer,
    FileViewerMetadata,
    DetailTabs,
  },

  mixins: [
    DatasetInfo,
    FormatDate,
    FetchPennsieveFile,
    FileDetails
  ],

  async asyncData({ app, redirect, route, error, $axios }) {
    const datasetInfo = await DatasetInfo.methods.getDatasetInfo(
      $axios,
      route.params.datasetId,
      route.params.datasetVersion,
      app.$cookies.get('user-token')
    )
    const s3Bucket = datasetInfo ? extractS3BucketName(datasetInfo.uri) : undefined
    const filePath = route.query.path   
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      route.params.datasetId,
      route.params.datasetVersion,
      error
    )

    const sourcePackageId = file.sourcePackageId
    let biolucidaData = {}
    try {
      biolucidaData = await $axios.$get(`${process.env.BL_API_URL}imagemap/sharelink/${sourcePackageId}/${route.params.datasetId}`)
    } catch(e) {
      console.log(`Error retrieving biolucida data (possibly because there is none for this file): ${e}`)
      console.log(e)
    }
    const hasBiolucidaViewer = biolucidaData != {} && biolucidaData.status !== 'error'
    // We must remove the N: in order for scicrunch to realize the package
    const expectedScicrunchIdentifier = sourcePackageId.replace("N:", "")
    let scicrunchData = {}
    try {
      const scicrunchResponse = await scicrunch.getDatasetInfoFromObjectIdentifier(
        expectedScicrunchIdentifier
      )
      console.log("SCI CRUNch = ", scicrunchResponse.data.result[0])
      const result = pathOr([], ['data', 'result'], scicrunchResponse)
      scicrunchData = result?.length > 0 ? result[0] : []
    } catch(e) {
      console.log(`Error retrieving sci crunch data (possibly because there is none for this file): ${e}`)
    }

    let segmentationData = {}
    const matchedSegmentationData = scicrunchData['mbf-segmentation']?.filter(function(el) {
      return el.identifier == expectedScicrunchIdentifier
    })
    segmentationData = matchedSegmentationData?.length > 0 ? matchedSegmentationData[0] : {}
    const hasSegmentationViewer = !isEmpty(segmentationData)
    
    let plotData = {}
    const matchedPlotData = scicrunchData['abi-plot']?.filter(function(el) {
      return el.identifier == expectedScicrunchIdentifier
    })
    plotData = matchedPlotData?.length > 0 ? matchedPlotData[0] : {}
    const hasPlotViewer = !isEmpty(plotData)

    let videoData = {}
    const matchedVideoData = scicrunchData['video']?.filter(function(el) {
      return el.identifier == expectedScicrunchIdentifier
    })
    videoData = matchedVideoData?.length > 0 ? matchedVideoData[0] : {}
    const hasVideoViewer = !isEmpty(videoData)
    let signedUrl = ""
    if (hasVideoViewer) {
      const config = {
        params: {
          key: `${route.params.datasetId}/${route.params.datasetVersion}/${filePath}`,
          contentType: videoData.mimetype.name,
          s3BucketName: s3Bucket
        }
      }
      signedUrl = await $axios.$get(
          `${process.env.portal_api}/download`,
          config
        )
        .then(response => {
          return response
        })
    }

    let packageType = "None"
    if (sourcePackageId !== 'details') {
      packageType = file.packageType
    }
    const hasTimeseriesViewer = packageType === 'TimeSeries'
    if (hasTimeseriesViewer && process.env.SHOW_TIMESERIES_VIEWER) {
      redirect(`/datasets/timeseriesviewer?dataset_id=${route.params.datasetId}&dataset_version=${route.params.datasetVersion}&file_path=${filePath}`)
    }

    let activeTabId = hasBiolucidaViewer ? 'imageViewer' :
      hasTimeseriesViewer ? 'timeseriesViewer' :
      hasSegmentationViewer ? 'segmentationViewer' : 
      hasPlotViewer ? 'plotViewer' :
      hasVideoViewer ? 'videoViewer' : ''

    return {
      biolucidaData,
      videoData,
      plotData,
      segmentationData: {
        share_link: `${process.env.NL_LINK_PREFIX}/dataviewer?datasetId=${route.params.datasetId}&version=${route.params.datasetVersion}&path=${filePath}`,
        status: ''
      },
      file,
      hasBiolucidaViewer,
      hasPlotViewer,
      hasVideoViewer,
      hasSegmentationViewer,
      sourcePackageId,
      signedUrl,
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
    hasViewer: function() {
      return this.hasBiolucidaViewer || this.hasSegmentationViewer || this.hasPlotViewer || this.hasVideoViewer
    },
    datasetId: function() {
      return this.$route.params.datasetId
    },
    readme: function() {
      return propOr('', 'readme', this.datasetInfo)
    },
  },

  watch: {
    hasBiolucidaViewer: {
      handler: function(hasViewer) {
        if (hasViewer) {
          this.tabs.push({
            label: 'Biolucida Viewer',
            id: 'imageViewer'
          })
        } else {
          this.tabs = this.tabs.filter(tab => tab.id !== 'imageViewer')
        }
      },
      immediate: true
    },
    hasPlotViewer: {
      handler: function(hasViewer) {
        if (hasViewer) {
          this.tabs.push({
            label: 'Plot Viewer',
            id: 'plotViewer'
          })
        } else {
          this.tabs = this.tabs.filter(tab => tab.id !== 'plotViewer')
        }
      },
      immediate: true
    },
    hasVideoViewer: {
      handler: function(hasViewer) {
        if (hasViewer) {
          this.tabs.push({
            label: 'Video Viewer',
            id: 'videoViewer'
          })
        } else {
          this.tabs = this.tabs.filter(tab => tab.id !== 'videoViewer')
        }
      },
      immediate: true
    },
    hasSegmentationViewer: {
      handler: function(hasViewer) {
        if (hasViewer) {
          this.tabs.push({
            label: 'Segmentation Viewer',
            id: 'segmentationViewer'
          })
        } else {
          this.tabs = this.tabs.filter(tab => tab.id !== 'segmentationViewer')
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
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.tabs {
  border: 1px solid $lineColor2;
}
</style>
