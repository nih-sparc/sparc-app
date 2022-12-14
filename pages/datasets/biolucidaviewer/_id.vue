<template>
  <div class="file-detail-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <biolucida-viewer
          v-show="activeTab === 'viewer'"
          :data="biolucidaData"
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
            {{ image_info.name }}
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
        <div class="file-detail">
          <strong class="file-detail__column_1">Data collection</strong>
          <div class="file-detail__column_2">
            {{ data_collection }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Modality</strong>
          <div class="file-detail__column_2">
            {{ xmp_metadata.modality }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Channel target labels</strong>
          <div class="file-detail__column_2">
            <image-channels :channel-colours="xmp_metadata.channel_colours" />
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Image scaling</strong>
          <div class="file-detail__column_2">
            <image-scaling
              :x-scale="xmp_metadata.pixel_height"
              :y-scale="xmp_metadata.pixel_width"
              :z-scale="xmp_metadata.z_spacing"
            />
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
import biolucida from '@/services/biolucida'
import scicrunch from '@/services/scicrunch'

import BiolucidaViewer from '@/components/BiolucidaViewer/BiolucidaViewer'
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import ImageScaling from '@/components/Images/ImageScaling.vue'
import ImageChannels from '@/components/Images/ImageChannels.vue'
import BfButton from '@/components/shared/BfButton/BfButton.vue'

import { pathOr } from 'ramda'

import ErrorMessages from '@/mixins/error-messages'
import RequestDownloadFile from '@/mixins/request-download-file'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'
import MarkedMixin from '@/mixins/marked'
import FileDetails from '@/mixins/file-details'

import { extractSection } from '@/utils/common'

export default {
  name: 'BiolucidaViewerPage',

  components: {
    BiolucidaViewer,
    BfButton,
    DetailTabs,
    ImageScaling,
    ImageChannels
  },

  mixins: [FileDetails, MarkedMixin, RequestDownloadFile, FetchPennsieveFile],

  async asyncData({ route, error, $axios }) {
    try {
      const image_identifier = route.params.id
      const identifier = route.query.item_id.substring(2)

      const [
        blv_link,
        image_info,
        dataset_response,
        xmp_metadata
      ] = await Promise.all([
        biolucida.getBLVLink(image_identifier),
        biolucida.getImageInfo(image_identifier),
        scicrunch.getDatasetInfoFromObjectIdentifier(identifier),
        biolucida.getXMPInfo(image_identifier)
      ])

      let dataset_info = dataset_response.data.result[0]
      let file = {}
      if (dataset_info === undefined) {
        dataset_info = { readme: '', title: '' }
      } else {
        // Find the biolucida object with the same image name to determine the file path
        const biolucidaObjects = pathOr(
          [],
          ['biolucida-2d'],
          dataset_info
        ).concat(pathOr([], ['biolucida-3d'], dataset_info))
        const biolucidaObject = biolucidaObjects.find(biolucidaObject => {
          return pathOr('', ['dataset', 'path'], biolucidaObject).includes(
            image_info.name
          )
        })
        const filePath = `files/${pathOr(
          '',
          ['dataset', 'path'],
          biolucidaObject
        )}`
        file = await FetchPennsieveFile.methods.fetchPennsieveFile(
          $axios,
          filePath,
          route.query.dataset_id,
          route.query.dataset_version,
          error
        )
      }

      return {
        blv_link: blv_link['link'],
        image_info,
        xmp_metadata,
        dataset_info,
        file
      }
    }
    catch (e) {
      const message = ErrorMessages.methods.biolucida()
      return error({ statusCode: 400, message: message, display: true, error: e})
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
      data_collection: '',
      queryView: false
    }
  },

  computed: {
    /**
     * Compute biolucida data
     * @returns {Object}
     */
    biolucidaData: function() {
      return {
        biolucida_image_id: '',
        blv_link: this.blv_link,
        share_link: process.env.BL_SHARE_LINK_PREFIX + this.$route.query.view,
        status: '',
        location: this.$route.query.location
      }
    },

    title: function() {
      return this.dataset_info.title
    },

    readme: function() {
      return this.dataset_info.readme
    },

    /**
     * Return the dataset id from the route query.
     * @returns String
     */
    datasetId: function() {
      return this.$route.query.dataset_id
    }
  },

  mounted: function() {
    const html = this.parseMarkdown(this.readme)
    this.data_collection = extractSection(/data collect[^:]+:/i, html)
  },
  methods: {
    copyLink: function() {
      this.queryView = !this.queryView
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';
</style>
