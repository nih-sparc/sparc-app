<template>
  <div class="full-size">
    <div v-if="hasDescription" class="description-info">
      <p>
        <strong>Data collection:</strong>
        {{ description }}
      </p>
      <!-- <p>
        <strong>Highlighted {{ imageTypes[currentIndex] }} image:</strong>
        {{ imageNames[currentIndex] }}
      </p> -->
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
import MarkedMixin from '@/mixins/marked'

import { baseName } from '@/utils/common'

import { plotTypeMap } from '@/static/js/plots'

export default {
  name: 'ImagesGallery',
  components: {
    Gallery: process.client
      ? () => import('@abi-software/gallery').then(gallery => gallery)
      : null
  },
  mixins: [MarkedMixin],
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
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const links = doc.querySelectorAll('p')
      links.forEach(paragraph => {
        if (paragraph.innerText.includes('Data collection:')) {
          this.description = paragraph.innerText.replace('Data collection:', '')
        }
      })
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
        const TURN_OFF = false
        if (
          'scaffolds' in scicrunchData &&
          scicrunchData.scaffolds &&
          TURN_OFF
        ) {
          items.push(
            ...Array.from(scicrunchData.scaffolds, scaffold => {
              const metaFilePath = encodeURIComponent(scaffold.meta_file.path)
              const thumbnailFilePath = encodeURIComponent(
                scaffold.thumbnail.path
              )
              discover
                .fetch(datasetId, datasetVersion, thumbnailFilePath)
                .then(response => {
                  console.log('thumbnail response :', response)
                })
                .catch(e => {
                  console.log('thumbnail error:', e.message)
                })
              let linkUrl =
                baseRoute +
                'datasets/scaffoldviewer' +
                '?scaffold=' +
                `${datasetId}/${datasetVersion}/files/${metaFilePath}`
              return {
                id: scaffold.meta_file.path,
                title: 'no-name', //scaffold.file ? scaffold.file.name : 'no-name',
                type: 'Scaffold',
                thumbnail: this.defaultScaffoldImg,
                link: linkUrl
              }
            })
          )
        }
        if ('mp4' in scicrunchData && TURN_OFF) {
          items.push(
            ...Array.from(scicrunchData.mp4, videoFile => {
              const filePath = this.getS3FilePath(
                datasetId,
                datasetVersion,
                videoFile.dataset.path
              )
              const linkUrl = `${baseRoute}datasets/videoviewer?dataset_version=${datasetVersion}&dataset_id=${datasetId}&file_path=${filePath}`
              return {
                title: videoFile.file.name,
                type: 'Video',
                thumbnail: this.defaultVideoImg,
                link: linkUrl
              }
            })
          )
        }
        if ('csv' in scicrunchData && TURN_OFF) {
          items.push(
            ...Array.from(scicrunchData.csv, csvFile => {
              const plotTypeName = plotTypeMap.get(csvFile.file.name)
              const filePath = this.getS3FilePath(
                datasetId,
                datasetVersion,
                csvFile.dataset.path
              )
              const linkUrl = `${baseRoute}datasets/plotviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}&plot_type=${plotTypeName}`
              return {
                title: 'no-csv-file', //csvFile.file.name,
                type: plotTypeName ? plotTypeName : 'CSV',
                thumbnail: this.defaultPlotImg,
                link: linkUrl
              }
            })
          )
          items = items.filter(item => item.type !== 'CSV')
        }
        if ('mbf-segmentation' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData['mbf-segmentation'], segmentation => {
              const filePath = segmentation.dataset.path
              const id = segmentation.remote.id
              this.getSegmentationThumbnail(items, {
                id,
                fetchAttempts: 0,
                datasetId,
                datasetVersion,
                segmentationFilePath: filePath
              })
              const linkUrl = `${baseRoute}datasets/segmentationviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}`
              return {
                id,
                title: baseName(filePath),
                type: 'Segmentation',
                thumbnail: null,
                link: linkUrl
              }
            })
          )
        }
        if ('common-images' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData['common-images'], generic_image => {
              const filePath = generic_image.dataset.path
              const id = generic_image.remote.id
              this.getImageFromS3(items, {
                id,
                datasetId,
                datasetVersion,
                imageFilePath: filePath,
                mimetype: generic_image.mimetype
              })
              const linkUrl = `${baseRoute}datasets/imageviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}&mimetype=${generic_image.mimetype}`
              return {
                id,
                title: baseName(filePath),
                type: 'Image',
                thumbnail: null,
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
              this.getThumbnailFromBiolucida(items, dataset_image.image_id)
              this.getImageInfoFromBiolucida(items, dataset_image.image_id)
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
                biolucidaData.discover_dataset_id

              return {
                id: dataset_image.image_id,
                title: null,
                type: 'XD Image',
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
    getS3FilePath(datasetId, datasetVersion, filePath) {
      const encodedFilePath = encodeURIComponent(filePath)
      return `${datasetId}/${datasetVersion}/files/${encodedFilePath}`
    },
    getBiolucidaImageType(name) {
      let imageType = ''
      if (name.toUpperCase().endsWith('JPX')) {
        imageType += '3D'
      } else {
        imageType += '2D'
      }

      return imageType + ' Image'
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
    getSegmentationThumbnail(items, segmentation_info) {
      discover
        .fetchEmbeddedThumbnail(
          segmentation_info.datasetId,
          segmentation_info.datasetVersion,
          segmentation_info.segmentationFilePath
        )
        .then(
          response => {
            let item = items.find(x => x.id === segmentation_info.id)
            this.scaleThumbnailImage(item, {
              mimetype: 'image/png',
              data: response.data
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
            }
          }
        )
        .catch(() => {
          let item = items.find(x => x.id === segmentation_info.id)
          this.$set(item, 'thumbnail', this.defaultImg)
        })
    },
    scaleThumbnailImage(item, image_info) {
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
      if (image_info.data.startsWith('data:')) {
        img.src = image_info.data
      } else {
        img.src = `data:${image_info.mimetype};base64,${image_info.data}`
      }
    },
    getImageFromS3(items, image_info) {
      discover
        .fetch(
          image_info.datasetId,
          image_info.datasetVersion,
          image_info.imageFilePath
        )
        .then(response => {
          let item = items.find(x => x.id === image_info.id)
          this.scaleThumbnailImage(item, {
            mimetype: image_info.mimetype,
            data: response.data
          })
        })
        .catch(() => {
          let item = items.find(x => x.id === image_info.id)
          this.$set(item, 'thumbnail', this.defaultImg)
        })
    },
    getThumbnailFromBiolucida(items, image_id) {
      biolucida.getThumbnail(image_id).then(
        response => {
          let item = items.find(x => x.id === image_id)

          this.$set(item, 'thumbnail', 'data:image/png;base64,' + response.data)
        },
        reason => {
          if (
            reason.message.includes('timeout') &&
            reason.message.includes('exceeded')
          ) {
            this.getThumbnailFromBiolucida(items, image_id)
          }
        }
      )
    },
    getImageInfoFromBiolucida(items, image_id) {
      biolucida.getImageInfo(image_id).then(
        response => {
          let item = items.find(x => x.id === image_id)
          const name = response.name
          if (name) {
            const extension = name.substring(
              name.lastIndexOf('.') + 1,
              name.length
            )
            this.$set(item, 'title', name.substring(0, name.lastIndexOf('.')))
            this.$set(item, 'type', this.getBiolucidaImageType(extension))
          }
        },
        reason => {
          if (
            reason.message.includes('timeout') &&
            reason.message.includes('exceeded')
          ) {
            this.getImageInfoFromBiolucida(items, image_id)
          }
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
