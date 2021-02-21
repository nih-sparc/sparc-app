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

import { plotTypeMap } from '@/static/js/plots'

export default {
  name: 'ImageGallery',
  // components: { Gallery },
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
        console.log('here we go')
        console.log(scicrunchData)
        let datasetId = -1
        let datasetVersion = -1
        if ('discover_dataset' in scicrunchData) {
          datasetId = scicrunchData.discover_dataset.id
          datasetVersion = scicrunchData.discover_dataset.version
        }
        if ('scaffolds' in scicrunchData && scicrunchData.scaffolds) {
          console.log('have scaffolds')
          items.push(
            ...Array.from(scicrunchData.scaffolds, scaffold => {
              console.log(scaffold, datasetId, datasetVersion)
              // https://api.sparc.science/s3-resource/29/6/files/derivative/HB-ICN-NegDDCT-data.csv
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
              // https://sparc.science/datasets/scaffoldviewer?scaffold=95%2F1%2Ffiles%2Fderivative%2FScaffold%2FhumanColon_metadata.json
              let linkUrl =
                '/datasets/scaffoldviewer' +
                '?scaffold=' +
                `${datasetId}/${datasetVersion}/files/${metaFilePath}`
              console.log(linkUrl)
              return {
                id: scaffold.meta_file.path,
                title: scaffold.file.name,
                type: 'Scaffold',
                thumbnail: this.defaultScaffoldImg,
                link: linkUrl
              }
            })
          )
        }
        if ('mp4' in scicrunchData) {
          items.push(
            ...Array.from(scicrunchData.mp4, videoFile => {
              console.log(videoFile)
              const filePath = this.getS3FilePath(
                datasetId,
                datasetVersion,
                videoFile.dataset.path
              )
              const linkUrl = `/datasets/videoviewer?dataset_version=${datasetVersion}&dataset_id=${datasetId}&file_path=${filePath}`
              return {
                title: videoFile.file.name,
                type: 'Video',
                thumbnail: this.defaultVideoImg,
                link: linkUrl
              }
            })
          )
        }
        if ('csv' in scicrunchData) {
          console.log('have plot data')
          items.push(
            ...Array.from(scicrunchData.csv, csvFile => {
              console.log('csv file:', csvFile)
              console.log(plotTypeMap)
              const plotTypeName = plotTypeMap.get(csvFile.file.name)
              const filePath = this.getS3FilePath(
                datasetId,
                datasetVersion,
                csvFile.dataset.path
              )
              // https://sparc.science/datasets/plotviewer?dataset_version=6&dataset_id=29&file_path=29%2F6%2Ffiles%2Fderivative%2FHB-ICN-NegDDCT-data.csv&plot_type=heatmap
              let linkUrl = `/datasets/plotviewer?dataset_id=${datasetId}&dataset_version=${datasetVersion}&file_path=${filePath}&plot_type=${plotTypeName}`
              return {
                title: csvFile.file.name,
                type: plotTypeName ? plotTypeName : 'CSV',
                thumbnail: this.defaultPlotImg,
                link: linkUrl
              }
            })
          )
          items = items.filter(item => item.type !== 'CSV')
        }
        if ('generic-image' in scicrunchData) {
          console.log('have png/tiff/jpeg image')
        }
        this.scicrunchItems = items
      }
    },
    datasetBiolucida: {
      deep: true,
      immediate: true,
      handler: function(biolucidaData) {
        let items = []
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
                '/datasets/biolucidaviewer/' +
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
    getLink(thumbnail_image) {
      let link = {
        name: this.getThumbnailLinkName(thumbnail_image),
        params: this.getThumbnailLinkParams(thumbnail_image),
        query: this.getThumbnailLinkQuery(thumbnail_image)
      }
      return link
    },
    displayState(index) {
      let offset = 0
      const oddImagesVisible = this.numberOfImagesVisible % 2 === 1
      const oddOffset = oddImagesVisible ? 1 : 0
      const lowIndex =
        this.currentIndex - (this.numberOfImagesVisible + oddOffset) / 2
      if (lowIndex < 0) {
        // Because of the low side bias of one we add one to the offset to keep the number of
        // images visible consistent.
        const lowBias = 1
        offset = Math.abs(lowIndex + lowBias)
      }
      const highIndex =
        this.currentIndex + (this.numberOfImagesVisible + oddOffset) / 2
      if (highIndex > this.imageCount) {
        offset = highIndex - this.imageCount
      }
      const isVisible =
        Math.abs(this.currentIndex - index) <
        this.numberOfImagesVisible / 2 + offset
      return isVisible ? undefined : 'none'
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
    getThumbnails() {
      console.log('nobody comes here?')
      let localThumbnails = []
      this.slideAxis = undefined
      localThumbnails = Array.from(this.datasetImages, dataset_image => {
        return {
          id: dataset_image.image_id,
          img: this.defaultImg,
          share_link: dataset_image.share_link
        }
      })
      this.datasetImages.forEach(dataset_image => {
        this.overlayColours = [...Array(this.imageCount)].map(() => 'grey')
        const image_id = dataset_image.image_id
        biolucida
          .getThumbnail(image_id)
          .then(response => {
            const index = localThumbnails.findIndex(
              item => item.id === image_id
            )
            let thumbnail = localThumbnails[index]
            biolucida
              .getImageInfo(image_id)
              .then(response => {
                const imageInfo = response.data
                let imageName = imageInfo.name
                imageName =
                  imageName.substring(0, imageName.lastIndexOf('.')) ||
                  imageName
                this.imageNames[index] = imageName
                let imageType = ''
                if (imageInfo.name.toUpperCase().endsWith('JPX')) {
                  this.overlayColours.splice(index, 1, 'cyan')
                  imageType += '3D'
                } else {
                  this.overlayColours[index] = 'violet'
                  imageType += '2D'
                }
                this.imageTypes[index] = imageType
              })
              .catch(error => {
                console.log('Error fetching image information:', image_id)
                console.log(error.message)
              })
            thumbnail.img =
              'data:' +
              response.headers['content-type'] +
              ';base64,' +
              response.data
            if (!this.slideAxis && this.slideAxis !== 'pending') {
              this.slideAxis = 'pending'
              let img = new Image()

              let _this = this
              img.onload = function() {
                _this.slideAxis =
                  img.naturalWidth > img.naturalHeight
                    ? 'landscape'
                    : 'portrait'
                _this.slideNaturalHeight = img.naturalHeight
                _this.slideNaturalWidth = img.naturalWidth
              }

              img.src =
                'data:' +
                response.headers['content-type'] +
                ';base64,' +
                response.data
            }
          })
          .catch(error => {
            console.log('Error fetching thumbnail: ', dataset_image.image_id)
            console.log(error.message)
          })
      })
      this.datasetScaffolds.forEach(dataset_scaffold => {
        const localThumbnails = []
        const scaffold_index = localThumbnails.length
        this.imageNames[scaffold_index] = dataset_scaffold.name
        this.imageTypes[scaffold_index] = 'scaffold'
        this.overlayColours[scaffold_index] = 'yellow'
        localThumbnails.push({
          id: dataset_scaffold.name,
          img: this.defaultScaffoldImg,
          metadata_file: ''
        })
        discover
          .browse(
            this.$route.params.datasetId,
            dataset_scaffold.version,
            dataset_scaffold.path
          )
          .then(response => {
            response.data.files.forEach(entry => {
              if (entry.name.toUpperCase().includes('METADATA')) {
                localThumbnails[
                  scaffold_index
                ].metadata_file = entry.uri.replace(
                  's3://blackfynn-discover-use1/',
                  ''
                )
              }
            })
          })
          .catch(error => {
            console.log(
              'Error fetching scaffold files: ',
              dataset_scaffold.name
            )
            console.log(error.message)
          })
      })
      for (let i in this.datasetPlots) {
        localThumbnails.push({
          id: this.datasetId,
          img: this.defaultPlotImg,
          plot_file: this.datasetPlots[i].file_path,
          plot_type: this.datasetPlots[i].plot_type
        })
      }
      for (let i in this.datasetVideos) {
        localThumbnails.push({
          id: this.datasetId,
          img: this.defaultVideoImg,
          file_path: this.datasetVideos[i].file_path
        })
      }
    },
    viewerId(shareLink) {
      const linkParts = shareLink.split(process.env.BL_SHARE_LINK_PREFIX)

      return linkParts[1]
    },
    getThumbnailLinkType(imageInfo) {
      const imageInfoKeys = Object.keys(imageInfo)
      const shareLinkIndex = imageInfoKeys.indexOf('share_link')
      const metadataFileIndex = imageInfoKeys.indexOf('metadata_file')
      const plotFileIndex = imageInfoKeys.indexOf('plot_file')
      const videoFileIndex = imageInfoKeys.indexOf('file_path')
      let imageType = 'unknown'
      if (shareLinkIndex !== -1) {
        imageType = 'biolucida'
      } else if (metadataFileIndex !== -1) {
        imageType = 'scaffold'
      } else if (plotFileIndex !== -1) {
        imageType = 'plot'
      } else if (videoFileIndex !== -1) {
        imageType = 'video'
      }
      return imageType
    },
    getThumbnailLinkParams(imageInfo) {
      const imageType = this.getThumbnailLinkType(imageInfo)
      let params = {}
      switch (imageType) {
        case 'biolucida':
          params = {
            id: imageInfo.id
          }
          break
        case 'scaffold':
          params = {
            id: imageInfo.name
          }
          break
        case 'plt':
          params = {
            id: imageInfo.name
          }
          break
        case 'video':
          params = {
            id: imageInfo.name
          }
          break
        default:
      }

      return params
    },
    getThumbnailLinkQuery(imageInfo) {
      const imageType = this.getThumbnailLinkType(imageInfo)
      let query = {}
      switch (imageType) {
        case 'biolucida':
          query = {
            view: this.viewerId(imageInfo.share_link),
            dataset_version: this.datasetVersion,
            dataset_id: this.datasetId
          }
          break
        case 'scaffold':
          query = {
            scaffold: imageInfo.metadata_file
          }
          break
        case 'plot':
          query = {
            dataset_version: this.datasetVersion,
            dataset_id: this.datasetId,
            file_path: imageInfo.plot_file,
            plot_type: imageInfo.plot_type
          }
          break
        case 'video':
          query = {
            dataset_version: this.datasetVersion,
            dataset_id: this.datasetId,
            file_path: imageInfo.file_path
          }
          break
        default:
      }

      return query
    },
    getThumbnailLinkName(imageInfo) {
      const imageType = this.getThumbnailLinkType(imageInfo)
      let name = '/'
      switch (imageType) {
        case 'biolucida':
          name = 'datasets-imageviewer-id'
          break
        case 'scaffold':
          name = 'datasets-scaffoldviewer-id'
          break
        case 'plot':
          name = 'datasets-plotviewer-id'
          break
        case 'video':
          name = 'datasets-videoviewer-id'
          break
        default:
      }

      return name
    },
    imageOverlayColour(index) {
      return this.overlayColours[index]
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
