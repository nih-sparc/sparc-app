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
      <div class="subpage">
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
            {{ segmentation_info.subject.species }}
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
      </div>
    </div>
  </div>
</template>

<script>
import discover from '@/services/discover'
import scicrunch from '@/services/scicrunch'

import SegmentationViewer from '@/components/SegmentationViewer/SegmentationViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'

import MarkedMixin from '@/mixins/marked'

import { extractSection } from '@/utils/common'
import { baseName } from '@/utils/common'

export default {
  name: 'SegmentationViewerPage',

  components: {
    SegmentationViewer,
    DetailTabs
  },

  mixins: [MarkedMixin],

  async asyncData({ route }) {
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

      let dataset_info = dataset_response.data.result[0]
      if (dataset_info === undefined) {
        dataset_info = { readme: '', title: '' }
      }

      return {
        segmentation_info,
        readme: dataset_info.readme,
        title: dataset_info.title
      }
    } catch (e) {
      // Error caught return empty data.
    }
    return {
      segmentation_info: { subject: '', atlas: '' },
      readme: '',
      title: ''
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
.file-detail__column_1 {
  flex: 0.2;
}
.file-detail__column_2 {
  flex: 0.8;
}
</style>
