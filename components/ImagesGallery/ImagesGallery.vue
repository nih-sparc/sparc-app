<template>
  <div class="full-size">
    <div v-if="hasDescription" class="description-info">
      <p>
        <strong>Data collection:</strong>
        {{ description }}
      </p>
    </div>
    <client-only placeholder="Loading gallery ...">
      <div class="gallery-container">
        <gallery
          :items="galleryItems"
          :max-width="maxWidth"
          :show-indicator-bar="true"
          :show-card-details="true"
          :highlight-active="true"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import biolucida from '@/services/biolucida'
import discover from '@/services/discover'

import FormatString from '@/mixins/format-string'
import MarkedMixin from '@/mixins/marked'

import { baseName, extractSection } from '@/utils/common'

export default {
  name: 'ImagesGallery',
  components: {
    Gallery: process.client
      ? () => import('@abi-software/gallery').then(gallery => gallery)
      : null
  },
  mixins: [FormatString, MarkedMixin],
  props: {
    datasetScicrunch: {
      type: Object,
      default: () => {
        return {}
      }
    },
    datasetBiolucida: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
      defaultFlatmapImg: require('~/assets/flatmap-thumbnail.png'),
      ro: null,
      maxWidth: 3,
      scicrunchItems: [],
      biolucidaItems: []
    }
  },
  computed: {
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
      return this.biolucidaItems.concat(this.scicrunchItems)
    },
    hasDescription() {
      return this.description !== ''
    }
  },
  watch: {
    markdown: function(text) {
      const html = this.parseMarkdown(text)
      this.description = extractSection(/data collect[^:]+:/i, html)
    },
    datasetScicrunch: {
      deep: true,
      immediate: true,
      handler: function(scicrunchData) {
        let items = []
        const baseRoute = this.$router.options.base || '/'
        let datasetId = -1
        let datasetVersion = -1
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
                const thumbnail = this.getThumbnailForScaffold(
                  index,
                  scicrunchData
                )

                this.getScaffoldThumbnail(items, {
                  id,
                  fetchAttempts: 0,
                  datasetId,
                  datasetVersion,
                  mimetype: thumbnail.mimetype.name,
                  file_path: thumbnail.dataset.path
                })
                let filePath = encodeURIComponent(`files/${file_path}`)
                const linkUrl = `${baseRoute}datasets/scaffoldviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}`
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
          items.push(
            ...Array.from(scicrunchData.video, videoFile => {
              const filePath = this.getS3FilePath(
                datasetId,
                datasetVersion,
                videoFile.dataset.path
              )
              const linkUrl = `${baseRoute}datasets/videoviewer?dataset_version=${datasetVersion}&dataset_id=${datasetId}&file_path=${filePath}&mimetype=${videoFile.mimetype.name}`
              return {
                title: videoFile.name,
                type: 'Video',
                thumbnail: this.defaultVideoImg,
                link: linkUrl
              }
            })
          )
        }

        if ('flatmaps' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData.flatmaps, f => {
              let title = f.uberonid ? f.uberonid : null
              if (f.organ) title = this.capitalize(f.organ)
              const linkUrl = `${baseRoute}datasets/flatmapviewer?dataset_version=${datasetVersion}&dataset_id=${datasetId}&taxo=${f.taxo}&uberonid=${f.uberonid}`
              const item = {
                id: f.uberonid,
                title: title,
                type: 'Flatmap',
                thumbnail: null,
                link: linkUrl
              }
              this.scaleThumbnailImage(item, {
                mimetype: 'image/png',
                data: this.defaultFlatmapImg
              })
              return item
            })
          )
        }

        if ('mbf-segmentation' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData['mbf-segmentation'], segmentation => {
              const id = segmentation.id
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
              // this.getImageFromS3(items, {
              //   id,
              //   fetchAttempts: 0,
              //   datasetId,
              //   datasetVersion,
              //   imageFilePath: filePath,
              //   mimetype: generic_image.mimetype.name
              // })
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
    getThumbnailForScaffold(index, scaffold_info) {
      if (
        'abi-scaffold-thumbnail' in scaffold_info &&
        index < scaffold_info['abi-scaffold-thumbnail'].length
      ) {
        return scaffold_info['abi-scaffold-thumbnail'][index]
      } else if (
        'abi-thumbnail' in scaffold_info &&
        index < scaffold_info['abi-thumbnail'].length
      ) {
        return scaffold_info['abi-thumbnail'][index]
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
    getScaffoldThumbnail(items, info) {
      discover
        .fetch(info.datasetId, info.datasetVersion, info.file_path, true)
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
              return this.getScaffoldThumbnail(items, info)
            } else {
              let item = items.find(x => x.id === info.id)
              this.$set(item, 'thumbnail', this.defaultScaffoldImg)
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
    scaleThumbnailImage(item, image_info) {
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

        if (
          image_info.data.includes('flatmap-thumbnail') ||
          image_info.data.startsWith('data:')
        ) {
          img.src = image_info.data
        } else {
          img.src = `data:${image_info.mimetype};base64,${image_info.data}`
        }
      }
    },
    getImageFromS3(items, image_info) {
      discover
        .fetch(
          image_info.datasetId,
          image_info.datasetVersion,
          image_info.imageFilePath,
          true
        )
        .then(
          response => {
            let item = items.find(x => x.id === image_info.id)
            this.scaleThumbnailImage(item, {
              mimetype: image_info.mimetype,
              data: response.data
            })
          },
          reason => {
            if (
              reason.message.includes('timeout') &&
              reason.message.includes('exceeded') &&
              image_info.fetchAttempts < 3
            ) {
              image_info.fetchAttempts += 1
              this.getImageFromS3(items, image_info)
            } else {
              let item = items.find(x => x.id === image_info.id)
              this.$set(item, 'thumbnail', this.defaultImg)
            }
          }
        )
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

          console.log('Maximum iterations reached aborting.')
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

          console.log('Maximum iterations reached aborting.')
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
</style>
