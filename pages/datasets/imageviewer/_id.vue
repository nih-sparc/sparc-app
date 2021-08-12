<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <img
          v-show="activeTab === 'viewer'"
          ref="img"
          :src="imageSrc"
          class="image-viewer"
          @load="imageLoaded"
        />
      </detail-tabs>
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ imageName }}</h1>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            {{ imageType }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Size</strong>
          <div class="file-detail__column">
            {{ imageSize }}
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
    </div>
  </div>
</template>

<script>
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import discover from '@/services/discover'

import { baseName } from '@/utils/common'

export default {
  name: 'ImageViewerPage',

  components: {
    DetailTabs
  },

  async asyncData({ route }) {
    const response = await discover.fetch(
      route.query.dataset_id,
      route.query.dataset_version,
      route.query.file_path,
      true
    )

    const imageInfo = {
      description: 'image description',
      name: baseName(route.query.file_path),
      src: `data:${route.query.mimetype};base64,${response.data}`,
      size: 'XxY'
    }

    return {
      imageInfo
    }
  },

  data: () => {
    return {
      tabs: [
        {
          label: 'Image Viewer',
          type: 'viewer'
        }
      ],
      activeTab: 'viewer',
      file: {}
    }
  },

  computed: {
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
     * Return the image name without extension from the image information.
     * @returns String
     */
    imageName: function() {
      let imageName = this.imageInfo.name
      return imageName.substring(0, imageName.lastIndexOf('.')) || imageName
    },

    /**
     * Return the type of an image.
     * @returns String
     */
    imageType: function() {
      return this.$route.query.mimetype
    },

    /**
     * Return a string that descripes the size of the image.
     * @returns String
     */
    imageSize: function() {
      return this.imageInfo.size
    },

    /**
     * Return the image src as a base64 description.
     * @returns String
     */
    imageSrc: function() {
      return this.imageInfo.src
    }
  },
  methods: {
    imageLoaded() {
      this.imageInfo.size = `${this.$refs.img.naturalWidth}x${this.$refs.img.naturalHeight}`
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
.image-viewer {
  max-height: 100%;
  max-width: 100%;
}
</style>
