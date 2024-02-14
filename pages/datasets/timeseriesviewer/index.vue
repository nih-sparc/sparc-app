<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <client-only>
        <content-tab-card
          v-if="hasTimeseriesViewer"
          class="tabs p-32 pt-48"
          :tabs="tabs"
          :active-tab-id="activeTabId"
        >
          <ts-viewer
            v-if="userToken"
            v-show="activeTabId === 'timeseriesViewer'"
            :user-token="userToken"
            :package-id="sourcePackageId"
            :package-type="packageType"
          />
          <div v-else>
            <b>Sign in</b> to the SPARC Portal to view timeseries data
          </div>
        </content-tab-card>
      </client-only>
      <div class="subpage pt-0 pb-16">
        <div class="file-detail">
          <strong class="file-detail__column_1">Dataset</strong>
          <div class="file-detail__column_2">
            <nuxt-link
              :to="{
                name: 'datasets-datasetId',
                params: {
                  datasetId,
                  datasetVersion
                }
              }"
            >
              {{ title }}
            </nuxt-link>
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Filename</strong>
          <div class="file-detail__column_2">
            {{ fileName }}
          </div>
        </div>
        <div v-if="filePath" class="file-detail">
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
        <div v-if="filePath" class="pt-16">
          <bf-button @click="requestDownloadFile(file)">
            Download file
          </bf-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'
import { propOr } from 'ramda'

import DatasetInfo from '@/mixins/dataset-info'
import RequestDownloadFile from '@/mixins/request-download-file'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import FileDetails from '@/mixins/file-details'

export default {
  name: 'TimeseriesViewerPage',

  components: {
    BfButton,
    DetailTabs
  },

  mixins: [DatasetInfo, FileDetails, RequestDownloadFile, FetchPennsieveFile],

  async asyncData({ app, route, error, $axios }) {
    const datasetInfo = await DatasetInfo.methods.getDatasetInfo(
      $axios,
      route.query.dataset_id,
      route.query.dataset_version,
      app.$cookies.get('user-token')
    )

    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      route.query.file_path,
      route.query.dataset_id,
      route.query.dataset_version,
      error
    )
    const sourcePackageId = file.sourcePackageId
    let packageType = "None"
    if (sourcePackageId !== 'details') {
      packageType = file.packageType
    }
    const hasTimeseriesViewer = packageType === 'TimeSeries' && process.env.SHOW_TIMESERIES_VIEWER

    return {
      datasetInfo,
      file,
      sourcePackageId,
      packageType,
      hasTimeseriesViewer
    }
  },

  data: function() {
    return {
      tabs: [
        {
          label: 'Timeseries Viewer',
          id: 'timeseriesViewer'
        }
      ],
      activeTabId: 'timeseriesViewer',
    }
  },

  computed: {
    ...mapGetters('user', ['cognitoUserToken']),
    userToken() {
      return this.cognitoUserToken || this.$cookies.get('user-token')
    },
    title: function() {
      return propOr(undefined, 'name', this.datasetInfo)
    },
    datasetId: function() {
      return this.$route.query.dataset_id
    },
    datasetVersion: function() {
      return this.$route.query.dataset_version
    },
    filePath: function() {
      return this.$route.query.file_path
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.tabs {
  border: 1px solid $lineColor2;
}
</style>
