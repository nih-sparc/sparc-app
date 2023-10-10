<template>
  <div class="full-size">
    <client-only placeholder="Loading gallery ...">
        <div class="loading-gallery mt-16" v-if="$fetchState.pending" v-loading="$fetchState.pending" />
        <div v-else-if="$fetchState.error">
          There was an error loading the gallery items
        </div>
        <div v-else-if="galleryItems.length > 0" :class="['gallery-container', { 'one-item': galleryItems.length === 1 }]">
          <div v-if="hasDescription" class="description-info">
            <p>
              <strong>Data collection:</strong>
              {{ description }}
            </p>
          </div>
          <gallery
            :items="galleryItems"
            :max-width="maxWidth"
            :show-indicator-bar="true"
            :show-card-details="true"
            :highlight-active="shouldHighlight"
          />
        </div>
        <div v-else-if="!$fetchState.pending">
          This dataset does not contain gallery items
        </div>
    </client-only>
  </div>
</template>

<script>
import biolucida from '@/services/biolucida'
import discover from '@/services/discover'
import scicrunch from '@/services/scicrunch'
import flatmaps from '@/services/flatmaps'
import Uberons from '@/static/js/uberon-map.js'
import ErrorMessages from '@/mixins/error-messages'

import FormatString from '@/mixins/format-string'
import MarkedMixin from '@/mixins/marked'
import { propOr } from 'ramda'

import { mapState } from 'vuex'

import { baseName, extractSection, extractS3BucketName } from '@/utils/common'

import { failMessage } from '@/utils/notification-messages'

const getBiolucidaData = async datasetId => {
  try {
    return biolucida.searchDataset(datasetId)
  } catch (e) {
    return {}
  }
}

/**
 * Get data for objects that have a data specific viewer.
 * @param {Number} datasetId
 */
const getThumbnailData = async (datasetDoi, datasetId, datasetVersion, datasetFacetsData) => {
  let biolucidaImageData = {}
  let scicrunchData = {}
  try {
    const [biolucida_response, scicrunch_response] = await Promise.all([
      getBiolucidaData(datasetId),
      scicrunch.getDatasetInfoFromDOI(datasetDoi)
    ])

    if (biolucida_response.status === 'success') {
      biolucidaImageData = biolucida_response
      biolucidaImageData['discover_dataset_version'] = datasetVersion
    }

    if (scicrunch_response.data.result.length > 0) {
      scicrunchData = scicrunch_response.data.result[0]
      scicrunchData.discover_dataset = {
        id: Number(datasetId),
        version: datasetVersion
      }
      // Check for flatmap data
      if (scicrunchData.organs) {
        let flatmapData = []
        let species = undefined
        // Get species data from algolia if it exists
        if (datasetFacetsData){
          let speciesArray = datasetFacetsData.filter(item=>item.label==="Species")
          if (speciesArray && speciesArray.length > 0)
            species = speciesArray[0].children[0].label.toLowerCase()
        }

        // check if there is a flatmap for the given species, use a rat if there is not
        const taxo = species && species in Uberons.species ? Uberons.species[species] : Uberons.species['rat']

        // Check if flatmap has the anatomy for this species. This is done by asking the flatmap knowledge base
        // if a flatmap of (species) has (anatomy)
        let foundAnatomy = []
        if (scicrunchData.organs[0]) { // Check if dataset has organ annotation
          // Send a requst to flatmap knowledgebase
          const anatomy = scicrunchData.organs.map(organ => organ.curie)
          const data = await flatmaps.anatomyQuery(taxo, anatomy)

          // Check request was successful
          const anatomyResponse = data.data ? data.data.values : undefined
          if (anatomyResponse && anatomyResponse.length > 0) {
            foundAnatomy = anatomyResponse.map(val => val[1]) // uberon is stored in second element of tuple
          }
        }

        // Add flatmaps that match the anatomy and taxonomy to the gallery
        scicrunchData.organs.forEach(organ => {
          if (foundAnatomy.includes(organ.curie)){
            let organData = {
              taxo,
              uberonid: organ.curie,
              organ: organ.name,
              id: datasetId,
              version: datasetVersion,
              species: species
            }
            flatmapData.push(organData)
          }
        })
        //Only create a flatmaps field if flatmapData is not empty
        if (flatmapData.length > 0)
          scicrunchData['flatmaps'] = flatmapData
      }
    }
  } catch (e) {
    console.error(
      'Hit error in the scicrunch processing. ( pages/_datasetId.vue ). Error: ',
      e
    )
    return {
      biolucidaImageData: {},
      scicrunchData: {}
    }
  }
  return {
    biolucidaImageData,
    scicrunchData
  }
}

export default {
  name: 'ImagesGallery',
  components: {
    Gallery: process.client
      ? () => import('@abi-software/gallery').then(gallery => gallery)
      : null
  },
  mixins: [FormatString, MarkedMixin],
  props: {
    datasetImages: {
      type: Array,
      default: () => {
        return []
      }
    },
    datasetScaffolds: {
      type: Array,
      default: () => {
        return []
      }
    },
    datasetPlots: {
      type: Array,
      default: () => {
        return []
      }
    },
    datasetVideos: {
      type: Array,
      default: () => {
        return []
      }
    },
    markdown: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      description: '',
      imageNames: [],
      imageTypes: [],
      overlayColours: [],
      currentIndex: 0,
      controlWidth: 50,
      controlHeight: 60,
      slideAxis: undefined,
      slideNaturalHeight: 135,
      slideNaturalWidth: 180,
      defaultImg: require('~/assets/logo-sparc-wave-primary.svg'),
      defaultScaffoldImg: require('~/assets/scaffold-light.png'),
      defaultPlotImg: require('~/assets/data-icon.png'),
      defaultVideoImg: require('~/assets/video-default.png'),
      flatmapImg: {
        rat: require('~/assets/flatmap-thumbnails/rat.png'),
        mouse: require('~/assets/flatmap-thumbnails/mouse.png'),
        human: require('~/assets/flatmap-thumbnails/human.png'),
        pig: require('~/assets/flatmap-thumbnails/pig.png'),
        cat: require('~/assets/flatmap-thumbnails/cat.png')
      },
      ro: null,
      maxWidth: 3,
      scicrunchItems: [],
      biolucidaItems: [],
      timeseriesItems: [],
      timeseriesData: [],
      datasetScicrunch: {},
      datasetBiolucida: {},
    }
  },
  computed: {
    ...mapState('pages/datasets/datasetId', 
      ['datasetInfo', 'datasetFacetsData']
    ),
    datasetId() {
      return propOr('', 'id', this.datasetInfo)
    },
    isPrevPossible() {
      return this.currentIndex > 0
    },
    isNextPossible() {
      return this.currentIndex < this.imageCount - 1
    },
    imageCount() {
      return (
        this.datasetImages.length +
        this.datasetScaffolds.length +
        this.datasetPlots.length +
        this.datasetVideos.length
      )
    },
    numberOfImagesVisible() {
      const imagesVisibleCount =
        (this.$el.parentElement.clientWidth - 2 * this.controlWidth) /
        this.slideNaturalWidth
      return Math.floor(imagesVisibleCount)
    },
    thumbnails() {
      return this.datasetThumbnailData
    },
    galleryItems() {
      return this.biolucidaItems.concat(this.scicrunchItems).concat(this.timeseriesItems)
    },
    hasDescription() {
      return this.description !== ''
    },
    // Highlighting the items looks weird if there is only one item and there is no description above it
    shouldHighlight() {
      return this.hasDescription || this.galleryItems.length > 1
    }
  },
  async fetch() {
    const { biolucidaImageData, scicrunchData } = await getThumbnailData(
      this.datasetInfo.doi,
      this.datasetId,
      this.datasetInfo.version,
      this.datasetFacetsData
    )
    if (Object.keys(biolucidaImageData).length === 0 &&
      Object.keys(scicrunchData).length === 0 ) {
      //Non critical error
      this.$message(failMessage(ErrorMessages.methods.scicrunch()))
    }
    this.datasetBiolucida = biolucidaImageData
    this.datasetScicrunch = scicrunchData

    const newDatasetInfo = {
      ...this.datasetInfo,
      sciCrunch: scicrunchData
    }

    this.$store.dispatch('pages/datasets/datasetId/setDatasetInfo', newDatasetInfo)

        // Get all timeseries files (those with an '.edf' extension)
    const timeseriesData = process.env.SHOW_TIMESERIES_VIEWER
    ? await this.$axios.$get(`${process.env.discover_api_host}/search/files?fileType=edf&datasetId=${this.datasetId}`)
        .then(({ files }) => {
          let data = []
          files.forEach(file => {
            const filePath = file.uri.substring(file.uri.indexOf('files'))
            const linkUrl =
                process.env.ROOT_URL +
                `/datasets/timeseriesviewer?&dataset_id=${file.datasetId}&dataset_version=${file.datasetVersion}&file_path=${filePath}`

            data.push({
              title: file.name,
              type: 'Timeseries',
              thumbnail: undefined,
              link: linkUrl
            })
          })
          return data
        })
        .catch(() => {
          return []
        }) 
    : []
    this.timeseriesData = timeseriesData
  },
  watch: {
    markdown: {
      immediate: true,
      handler: function(text) {
        const html = this.parseMarkdown(text)
        this.description = extractSection(/data collect[^:]+:/i, html)
      }
    },
    timeseriesData: {
      deep: true,
      immediate: true,
      handler: function(data) {
        this.timeseriesItems = data
      }
    },
    datasetScicrunch: {
      deep: true,
      immediate: true,
      handler: function(scicrunchData) {
        let items = []
        const baseRoute = this.$router.options.base || '/'
        let datasetId = -1
        let datasetVersion = -1
        let s3Bucket = extractS3BucketName(scicrunchData['s3uri'])
        if ('discover_dataset' in scicrunchData) {
          datasetId = scicrunchData.discover_dataset.id
          datasetVersion = scicrunchData.discover_dataset.version
        }
        if ('abi-scaffold-metadata-file' in scicrunchData) {
          let index = 0
          items.push(
            ...Array.from(
              scicrunchData['abi-scaffold-metadata-file'],
              scaffold => {
                const file_path = scaffold.dataset.path
                const id = scaffold.identifier
                const thumbnail = this.getThumbnailPathForScaffold(
                  scaffold,
                  scicrunchData["abi-scaffold-view-file"],
                  scicrunchData["abi-thumbnail"],
                  index
                )
                this.retrieveThumbnailFromInfo(items, {
                    id,
                    fetchAttempts: 0,
                    datasetId,
                    datasetVersion,
                    mimetype: thumbnail.mimetype.name,
                    file_path: thumbnail.dataset.path,
                    s3Bucket: s3Bucket
                  },
                  this.defaultScaffoldImg
                )
                let filePath = encodeURIComponent(`files/${file_path}`)
                const linkUrl = `${baseRoute}maps?type=scaffold&dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}`
                index += 1
                return {
                  id,
                  title: baseName(file_path),
                  type: 'Scaffold',
                  thumbnail: this.defaultScaffoldImg,
                  link: linkUrl
                }
              }
            )
          )
        }

        if ('video' in scicrunchData) {
          const thumbnailPaths = {}
          if (scicrunchData['abi-thumbnail']) {
            scicrunchData['abi-thumbnail'].forEach(thumbnail => {
              const videoPath = thumbnail.datacite.isDerivedFrom.path[0]
              thumbnailPaths[videoPath] = thumbnail.dataset.path
            })
          }
          scicrunchData.video.forEach(async videoFile => {
            let thumbnail = this.defaultVideoImg
            if (thumbnailPaths[videoFile.dataset.path]) {
              const url = new URL(`${process.env.portal_api}/s3-resource/${datasetId}/${datasetVersion}/files/${thumbnailPaths[videoFile.dataset.path]}`)
              url.searchParams.append('encodeBase64', true)
              const img = await fetch(url).then(resp => resp.ok ? resp.text() : null)
              if (img) {
                thumbnail = 'data:image/png;base64,' + img
              }
            }
            const filePath = this.getS3FilePath(
              datasetId,
              datasetVersion,
              videoFile.dataset.path
            )
            const linkUrl = `${baseRoute}datasets/videoviewer?dataset_version=${datasetVersion}&dataset_id=${datasetId}&file_path=${filePath}&mimetype=${videoFile.mimetype.name}`
            items.push({
              title: videoFile.name,
              type: 'Video',
              thumbnail,
              link: linkUrl
            })
          })
        }

        if ('flatmaps' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData.flatmaps, f => {
              let title = f.uberonid ? f.uberonid : null
              if (f.organ) {
                title = `View ${f.organ} on ${f.species ? f.species : 'rat'}`
              }

              let linkUrl = `${baseRoute}maps?type=flatmap&dataset_version=${datasetVersion}&dataset_id=${datasetId}&taxo=${f.taxo}&uberonid=${f.uberonid}`
              if (f.species) linkUrl = linkUrl + `&for_species=${f.species}`
              const item = {
                id: f.uberonid,
                title: title,
                type: 'Flatmap',
                thumbnail: null,
                link: linkUrl
              }

              this.scaleThumbnailImage(
                item,
                {
                  mimetype: 'image/png',
                  data: this.flatmapImg[flatmaps.speciesMap[f.taxo]]
                },
                true
              )
              return item
            })
          )
        }

        if ('mbf-segmentation' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData['mbf-segmentation'], segmentation => {
              const id = segmentation.identifier
              let file_path = segmentation.dataset.path
              // patch for discrepancy between file paths containing spaces and/or commas and the s3 path. s3 paths appear to use underscores instead
              file_path = file_path.replaceAll(' ', '_')
              file_path = file_path.replaceAll(',', '_')
              const link = `${baseRoute}datasets/segmentationviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=files/${file_path}`

              this.getSegmentationThumbnail(items, {
                id,
                fetchAttempts: 0,
                datasetId: datasetId,
                datasetVersion: datasetVersion,
                segmentationFilePath: file_path
              })

              return {
                id,
                title: baseName(file_path),
                type: 'Segmentation',
                thumbnail: null,
                link
              }
            })
          )
        }

        if ('abi-plot' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData['abi-plot'], plot => {
              const id = plot.identifier
              const file_path = plot.dataset.path
              const thumbnail = this.getThumbnailPathForPlot(
                plot,
                scicrunchData["abi-thumbnail"]
              )
              this.retrieveThumbnailFromInfo(items, {
                  id,
                  fetchAttempts: 0,
                  datasetId,
                  datasetVersion,
                  mimetype: thumbnail.mimetype.name,
                  file_path: thumbnail.dataset.path,
                  s3Bucket: s3Bucket
                },
                this.defaultPlotImg
              )
              const linkUrl = `${baseRoute}datasets/plotviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&identifier=${id}`
              return {
                id,
                title: baseName(file_path),
                type: 'Plot',
                thumbnail: this.defaultPlotImg,
                link: linkUrl
              }
            })
          )
        }

        if ('common-images' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData['common-images'], generic_image => {
              const filePath = generic_image.dataset.path
              const id = generic_image.identifier
              const linkUrl = `${baseRoute}datasets/imageviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}&mimetype=${generic_image.mimetype.name}`
              return {
                id,
                title: baseName(filePath),
                type: 'Image',
                thumbnail: this.defaultImg,
                link: linkUrl
              }
            })
          )
        }
        this.scicrunchItems = items
      }
    },
    datasetBiolucida: {
      deep: true,
      immediate: true,
      handler: function(biolucidaData) {
        let items = []
        const baseRoute = this.$router.options.base || '/'
        if ('dataset_images' in biolucidaData) {
          items.push(
            ...Array.from(biolucidaData.dataset_images, dataset_image => {
              this.getThumbnailFromBiolucida(items, {
                id: dataset_image.image_id,
                fetchAttempts: 0
              })
              this.getImageInfoFromBiolucida(items, {
                id: dataset_image.image_id,
                fetchAttempts: 0
              })
              const viewEncoding = dataset_image.share_link.replace(
                process.env.BL_SHARE_LINK_PREFIX,
                ''
              )
              // https://sparc.science/datasets/imageviewer/2724?view=MjcyNC1jb2wtMTA4&dataset_version=5&dataset_id=43
              let linkUrl =
                baseRoute +
                'datasets/biolucidaviewer/' +
                dataset_image.image_id +
                '?view=' +
                viewEncoding +
                '&dataset_version=' +
                biolucidaData.discover_dataset_version +
                '&dataset_id=' +
                biolucidaData.discover_dataset_id +
                '&item_id=' +
                dataset_image.sourcepkg_id

              return {
                id: dataset_image.image_id,
                title: null,
                type: 'Image',
                thumbnail: null,
                link: linkUrl
              }
            })
          )
        }
        this.biolucidaItems = items
      }
    }
  },
  mounted() {
    this.ro = new ResizeObserver(this.onResize).observe(this.$el)
  },
  destroyed() {
    delete this.ro
  },
  methods: {
    /**
     * Returns a file path for S3.
     * @param {String} dataset_id dataset id.
     * @param {String} dataset_version dataset version.
     * @param {String} file_path file path.
     * @returns {String} full path to S3 file.
     */
    getS3FilePath(dataset_id, dataset_version, file_path) {
      const encoded_file_path = encodeURIComponent(file_path)
      return `${dataset_id}/${dataset_version}/files/${encoded_file_path}`
    },
    /**
     * Find data path in the array that matches the provide path
     */
    findEntryWithPathInArray(array, path) {
      if (path && array) {
        for (let i = 0; i < array.length; i++) {
          if (path === array[i].dataset.path) return array[i]
        }
      }
      return undefined
    },
    getThumbnailPathForPlot(plot, thumbnails) {
      if (thumbnails && plot) {
        return this.findEntryWithPathInArray(thumbnails, plot.datacite.isSourceOf.path[0])
      }
      return {
        dataset: {
          path: ''
        },
        mimetype: {
          name: ''
        }
      }
    },
    /**
     * Use the scaffoldViews to help with finding the correct thumbnails.
     * Use the index if the workflow stated above fails.
     */
    getThumbnailPathForScaffold(scaffold, scaffoldViews, thumbnails, index) {
      if (thumbnails && thumbnails.length > 0) {
        let thumbnail = undefined
        if (scaffold && scaffoldViews) {
          const view = this.findEntryWithPathInArray(scaffoldViews, scaffold.datacite.isSourceOf.path[0])
          if (view) {
            thumbnail = this.findEntryWithPathInArray(thumbnails, view.datacite.isSourceOf.path[0])
          }
        }
        if (thumbnail) {
          return thumbnail
        } else if (index < thumbnails.length) {
          return thumbnails[index]
        }
      }

      return {
        dataset: {
          path: ''
        },
        mimetype: {
          name: ''
        }
      }
    },
    retrieveThumbnailFromInfo(items, info, defaultImg) {
      discover
        .fetch(info.datasetId, info.datasetVersion, info.file_path, true, info.s3Bucket)
        .then(
          response => {
            let item = items.find(x => x.id === info.id)
            this.scaleThumbnailImage(item, {
              mimetype: info.mimetype,
              data: response.data
            })
          },
          reason => {
            if (
              reason.message.includes('timeout') &&
              reason.message.includes('exceeded') &&
              info.fetchAttempts < 3
            ) {
              info.fetchAttempts += 1
              return this.retrieveThumbnailFromInfo(items, info)
            } else {
              let item = items.find(x => x.id === info.id)
              this.$set(item, 'thumbnail', defaultImg)
            }

            return Promise.reject('Maximum iterations reached.')
          }
        )
    },
    goNext() {
      if (this.currentIndex < this.imageCount - 1) {
        this.currentIndex += 1
      }
    },
    goPrev() {
      if (0 < this.currentIndex) {
        this.currentIndex -= 1
      }
    },
    getFilePath(items, data) {
      const what = discover.getDiscoverPath(data.uri).then(
        response => {
          return response.data
        },
        reason => {
          if (
            reason.message.includes('timeout') &&
            reason.message.includes('exceeded') &&
            data.fetchAttempts < 3
          ) {
            data.fetchAttempts += 1
            return this.getFilePath(items, data)
          } else {
            let item = items.find(x => x.id === data.id)
            item.title = 'No response'
            this.$set(item, 'thumbnail', this.defaultImg)
          }
          return Promise.reject('Maximum attempts reached.')
        }
      )

      return what
    },
    getSegmentationThumbnail(items, segmentation_info) {
      biolucida
        .getNeurolucidaThumbnail(
          segmentation_info.datasetId,
          segmentation_info.datasetVersion,
          segmentation_info.segmentationFilePath
        )
        .then(
          response => {
            let item = items.find(x => x.id === segmentation_info.id)
            this.scaleThumbnailImage(item, {
              mimetype: 'image/png',
              data: response
            })
          },
          reason => {
            if (
              reason.message.includes('timeout') &&
              reason.message.includes('exceeded') &&
              segmentation_info.fetchAttempts < 3
            ) {
              segmentation_info.fetchAttempts += 1
              this.getSegmentationThumbnail(items, segmentation_info)
            } else {
              let item = items.find(x => x.id === segmentation_info.id)
              this.$set(item, 'thumbnail', this.defaultImg)
            }
          }
        )
    },
    scaleThumbnailImage(item, image_info, local_file = false) {
      if (typeof window !== 'undefined') {
        let img = document.createElement('img')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const this_ = this
        img.onload = function() {
          ctx.drawImage(img, 0, 0)

          const MAX_WIDTH = 180
          const MAX_HEIGHT = 135
          let width = img.width
          let height = img.height

          if (width > height) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          } else {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
          canvas.width = width
          canvas.height = height
          let new_ctx = canvas.getContext('2d')
          new_ctx.drawImage(img, 0, 0, width, height)

          const dataurl = canvas.toDataURL(image_info.mimetype)
          this_.$set(item, 'thumbnail', dataurl)
        }

        if (local_file) {
          img.src = image_info.data
        } else {
          img.src = `data:${image_info.mimetype};base64,${image_info.data}`
        }
      }
    },
    getThumbnailFromBiolucida(items, info) {
      biolucida.getThumbnail(info.id).then(
        response => {
          let item = items.find(x => x.id === info.id)

          this.$set(item, 'thumbnail', 'data:image/png;base64,' + response.data)
        },
        reason => {
          if (
            reason.message.includes('timeout') &&
            reason.message.includes('exceeded') &&
            info.fetchAttempts < 3
          ) {
            info.fetchAttempts += 1
            this.getThumbnailFromBiolucida(items, info)
          } else {
            let item = items.find(x => x.id === info.id)
            this.$set(item, 'thumbnail', this.defaultImg)
          }
          // return Promise.reject('Maximum iterations reached.')
        }
      )
    },
    getImageInfoFromBiolucida(items, info) {
      biolucida.getImageInfo(info.id).then(
        response => {
          let item = items.find(x => x.id === info.id)
          const name = response.name
          if (name) {
            this.$set(item, 'title', name.substring(0, name.lastIndexOf('.')))
          }
        },
        reason => {
          if (
            reason.message.includes('timeout') &&
            reason.message.includes('exceeded') &&
            info.fetchAttempts < 3
          ) {
            info.fetchAttempts += 1
            this.getImageInfoFromBiolucida(items, info)
          } else {
            let item = items.find(x => x.id === info.id)
            this.$set(item, 'thumbnail', this.defaultImg)
          }
          // return Promise.reject('Maximum iterations reached.')
        }
      )
    },
    onResize() {
      this.maxWidth = this.$el.clientWidth
      // this.$emit('resize', this.$el.clientWidth)
    }
  }
}
</script>

<style scoped>
.loading-gallery {
  overflow: hidden;
  min-height: 4rem;
}

.full-size {
  width: 100%;
  height: 100%;
}

.key-image-span.active {
  transform: scale(1.16);
  border: 4px #8300bf solid;
}

.key-image-span {
  display: flex;
  position: relative;
}

.overlay {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 1.61em;
  height: 1em;
  border-radius: 3px;
  opacity: 0.8;
}

img {
  vertical-align: bottom;
}

a.prev,
a.next {
  display: flex;
  font-size: 3em;
}

a.prev:not(.underline),
a.next:not(.underline) {
  text-decoration: none;
}

a.prev {
  justify-content: flex-start;
}

a.next {
  justify-content: flex-end;
}

.standard-gallery {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.image-line {
  display: flex;
  margin-top: 1%;
  margin-bottom: 1%;
  flex-grow: 1;
  justify-content: space-between;
}
.disabled {
  opacity: 0.2;
  cursor: default;
}

.rectangle {
  height: 1em;
  width: 2em;
  border-radius: 3px;
  background-color: #555;
}

::v-deep .one-item .card-line {
  flex-grow: unset !important;
}
</style>

<style lang="scss">
.gallery-container {
  @import '~@abi-software/gallery/dist/gallery';
}
</style>
