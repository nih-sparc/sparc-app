<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ segmentationName }}</h1>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Description</strong>
          <div class="file-detail__column">
            {{ segmentationDescription }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            {{ segmentationType }}
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
          </div>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
import SegmentationViewer from '@/components/SegmentationViewer/SegmentationViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import { baseName } from '~/utils/common'

export default {
  name: 'SegmentationViewerPage',

  components: {
    SegmentationViewer,
    DetailTabs
  },

  async asyncData({ route }) {
    const segmentationInfo = {
      name: baseName(route.query.file_path)
    }

    return {
      segmentationInfo
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
      activeTab: 'viewer'
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
     * Return the segmentation name without extension from the segmentation information.
     * @returns String
     */
    segmentationName: function() {
      let name = this.segmentationInfo.name
      return name.substring(0, name.lastIndexOf('.')) || name
    },

    /**
     * Return the description for the segmentation.
     * @returns String
     */
    segmentationDescription: function() {
      return 'description about segmentation.'
    },
    /**
     * Return the type of an segmentation.
     * @returns String
     */
    segmentationType: function() {
      return 'application/vnd.mbfbioscience.neurolucida+xml'
    }
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
