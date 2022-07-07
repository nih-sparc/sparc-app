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
            <form
              ref="zipForm"
              method="POST"
              :action="zipitUrl"
            >
              <input v-model="zipData" type="hidden" name="data" />
            </form>
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
        <ts-viewer
          v-if="hasTimeseriesViewer && userToken"
          v-show="activeTabId === 'timeseriesViewer'"
          :user-token="userToken"
          :package-id="sourcePackageId"
          :package-type="packageType"
        />
        <div v-else-if="hasTimeseriesViewer && !userToken">
          Sign in to view timeseries data
        </div>
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
import FormatDate from '@/mixins/format-date'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'

export default {
  name: 'FileDetailPage',

  components: {
    BiolucidaViewer,
    DetailTabs,
    BfButton
  },

  mixins: [
    BfStorageMetrics,
    FormatDate,
    FetchPennsieveFile
  ],

  async asyncData({ route, $axios }) {
    const filePath = route.query.path
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      route.params.datasetId,
      route.params.datasetVersion
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

    let activeTabId = hasBiolucidaViewer ? 'imageViewer' :
      hasTimeseriesViewer ? 'timeseriesViewer' : ''

    return {
      biolucidaData,
      file,
      hasBiolucidaViewer,
      hasTimeseriesViewer,
      sourcePackageId,
      packageType,
      activeTabId
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
    },
    hasTimeseriesViewer: {
      handler: function(hasViewer) {
        if (hasViewer) {
          this.tabs.push({
            label: 'Timeseries Viewer',
            id: 'timeseriesViewer'
          })
        } else {
          this.tabs = this.tabs.filter(tab => tab.id !== 'timeseriesViewer')
        }
      },
      immediate: true
    }
  },

  methods: {
    executeDownload(file) {
      const datasetVersionRegexp = /s3:\/\/pennsieve-prod-discover-publish-use1\/(?<datasetId>\d*)\/(?<version>\d*)\/(?<filePath>.*)/
      const matches = file.uri.match(datasetVersionRegexp)

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
  },

  computed: {
    /**
     * Compute location of the file
     * @returns {String}
     */
    location: function() {
      return this.file.path.replace(`/${this.file.name}`, '')
    },
    userToken: function() {
      return this.$store.getters['user/cognitoUserToken']
    },
    showTimeseriesViewer: function() {
      return this.userToken && this.sourcePackageId && this.packageType
    },
    hasViewer: function() {
      return this.hasTimeseriesViewer || this.hasBiolucidaViewer
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
