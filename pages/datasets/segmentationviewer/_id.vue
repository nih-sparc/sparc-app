<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <segmentation-viewer
          v-show="activeTab === 'viewer'"
          :data="segmentationData"
        />
      </detail-tabs>
      <div class="subpage pt-0 pb-16">
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
              {{ title }}
            </nuxt-link>
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Filename</strong>
          <div class="file-detail__column_2">
            {{ segmentation_info.name }}
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
        <div class="file-detail">
          <strong class="file-detail__column_1">Data collection</strong>
          <div class="file-detail__column_2">
            {{ data_collection }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Subject</strong>
          <div class="file-detail__column_2">
            {{ segmentation_info.subject.subjectid }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Species</strong>
          <div class="file-detail__column_2">
            {{ human_readable_species }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Sex</strong>
          <div class="file-detail__column_2">
            {{ segmentation_info.subject.sex }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Age</strong>
          <div class="file-detail__column_2">
            {{ segmentation_info.subject.age }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Organ</strong>
          <div class="file-detail__column_2">
            {{ segmentation_info.atlas.organ }}
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
import discover from '@/services/discover'
import scicrunch from '@/services/scicrunch'
import general from '@/services/general'

import SegmentationViewer from '@/components/SegmentationViewer/SegmentationViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import ErrorMessages from '@/mixins/error-messages'
import RequestDownloadFile from '@/mixins/request-download-file'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import MarkedMixin from '@/mixins/marked'
import FileDetails from '@/mixins/file-details'

import { extractSection } from '@/utils/common'
import { baseName } from '@/utils/common'

export default {
  name: 'SegmentationViewerPage',

  components: {
    SegmentationViewer,
    DetailTabs,
    BfButton
  },

  mixins: [FileDetails, MarkedMixin, RequestDownloadFile, FetchPennsieveFile],

  async asyncData({ route, error, $axios }) {
    const identifier = route.query.dataset_id

    try {
      const [segmentation_info_response, dataset_response] = await Promise.all([
        discover.getSegmentationInfo(
          route.query.dataset_id,
          route.query.dataset_version,
          route.query.file_path
        ),
        scicrunch.getDatasetInfoFromPennsieveIdentifier(identifier)
      ])

      const segmentation_info = {
        ...segmentation_info_response.data,
        name: baseName(route.query.file_path)
      }

      const species_lookup_response = await general.lookupOntoTerm(
        segmentation_info.subject.species
      )

      const human_readable_species = species_lookup_response.label

      let dataset_info = dataset_response.data.result[0]
      if (dataset_info === undefined) {
        dataset_info = { readme: '', title: '' }
      }

      const filePath = route.query.file_path
      const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
        $axios,
        filePath,
        route.query.dataset_id,
        route.query.dataset_version,
        error
      )

      return {
        segmentation_info,
        human_readable_species,
        readme: dataset_info.readme,
        title: dataset_info.title,
        file
      }
    } catch (e) {
      const message = ErrorMessages.methods.biolucida()
      return error({ statusCode: 400, message: message, display: true, error: e})
    }
  },

  data: () => {
    return {
      tabs: [
        {
          label: 'Segmentation Viewer',
          type: 'viewer'
        }
      ],
      activeTab: 'viewer',
      data_collection: ''
    }
  },

  computed: {
    /**
     * Compute segmentation data
     * @returns {Object}
     */
    segmentationData: function() {
      const datasetId = this.$route.query.dataset_id
      const version = this.$route.query.dataset_version
      const path = this.$route.query.file_path

      return {
        share_link: `${process.env.NL_LINK_PREFIX}/dataviewer?datasetId=${datasetId}&version=${version}&path=${path}`,
        status: ''
      }
    },

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
     * Return the type of an segmentation.
     * @returns String
     */
    segmentationType: function() {
      return 'application/vnd.mbfbioscience.neurolucida+xml'
    }
  },

  mounted: function() {
    const html = this.parseMarkdown(this.readme)
    this.data_collection = extractSection(/data collect[^:]+:/i, html)
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';
</style>
