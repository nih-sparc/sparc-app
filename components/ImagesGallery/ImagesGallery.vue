<template>
  <div class="biolucida-image-gallery full-size">
    <div class="description-info">
      <p>
        <strong>Data collection:</strong>
        {{ description }}
      </p>
      <p>
        <strong>Highlighted image:</strong>
        {{ imageNames[currentIndex] }}
      </p>
    </div>
    <div class="standard-gallery">
      <a
        href="#"
        class="prev"
        :class="{ disabled: !isPrevPossible }"
        :style="
          `width: ${controlWidth}px; height: ${controlHeight}px; line-height: ${controlHeight}px; margin-right: auto;`
        "
        @click.prevent="goPrev"
      >
        <span>&lsaquo;</span>
      </a>
      <div class="image-line">
        <span
          v-for="(thumbnail_image, index) in thumbnails"
          :key="'thumbnail_' + index"
          :style="{ display: displayState(index) }"
          :class="['key-image-span', { active: currentIndex === index }]"
        >
          <nuxt-link
            v-slot="{ href }"
            :to="{
              name: getThumbnailLinkName(thumbnail_image),
              params: getThumbnailLinkParams(thumbnail_image),
              query: getThumbnailLinkQuery(thumbnail_image),
            }"
          >
            <a target="_blank" :href="href">
              <img
                :ref="'key_image_' + thumbnail_image.id"
                :src="thumbnail_image.img"
                alt="thumbnail missing"
                class="thumbnail thumbnail-100"
                :height="slideNaturalHeight"
                :width="slideNaturalWidth"
              />
            </a>
          </nuxt-link>
          <div
            class="overlay"
            :style="`background-color: ${imageOverlayColour(index)}`"
          />
        </span>
      </div>
      <a
        href="#"
        class="next"
        :class="{ disabled: !isNextPossible }"
        :style="
          `width: ${controlWidth}px; height: ${controlHeight}px; line-height: ${controlHeight}px; margin-left: auto;`
        "
        @click.prevent="goNext"
      >
        <span>&rsaquo;</span>
      </a>
    </div>
    <index-indicator :count="imageCount" :current="currentIndex" />
  </div>
</template>

<script>
import biolucida from '@/services/biolucida'
import discover from '@/services/discover'

import MarkedMixin from '@/mixins/marked'
import IndexIndicator from '@/components/ImagesGallery/IndexIndicator'

export default {
  name: 'ImageGallery',
  components: { IndexIndicator },
  mixins: [MarkedMixin],
  props: {
    datasetImages: {
      type: Array,
      default: () => {
        return []
      },
    },
    datasetScaffolds: {
      type: Array,
      default: () => {
        return []
      },
    },
    markdown: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      description: '',
      thumbnails: [],
      imageNames: [],
      overlayColours: [],
      currentIndex: 0,
      controlWidth: 50,
      controlHeight: 60,
      slideAxis: undefined,
      slideNaturalHeight: 135,
      slideNaturalWidth: 180,
      defaultImg: require('~/assets/logo-sparc-wave-primary.svg'),
      defaultScaffoldImg: require('~/assets/scaffold-light.png'),
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
      return this.datasetImages.length + this.datasetScaffolds.length
    },
    numberOfImagesVisible() {
      const imagesVisibleCount =
        (this.$el.parentElement.clientWidth - 2 * this.controlWidth) /
        this.slideNaturalWidth
      return Math.floor(imagesVisibleCount)
    },
  },
  watch: {
    markdown: function(text) {
      const html = this.parseMarkdown(text)
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const links = doc.querySelectorAll('p')
      links.forEach((paragraph) => {
        if (paragraph.innerText.includes('Data collection:')) {
          this.description = paragraph.innerText.replace('Data collection:', '')
        }
      })
    },
    currentIndex: function(index) {
      this.imageName = this.imageNames[index]
    },
  },
  mounted() {
    this.currentIndex = Math.floor(this.imageCount / 2 - 0.5)
    this.getThumbnails()
  },
  methods: {
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
    getThumbnails() {
      this.thumbnails.clear
      this.slideAxis = undefined
      this.thumbnails = Array.from(this.datasetImages, (dataset_image) => {
        return {
          id: dataset_image.image_id,
          img: this.defaultImg,
          share_link: dataset_image.share_link,
        }
      })
      this.datasetImages.forEach((dataset_image) => {
        this.overlayColours = [...Array(this.imageCount)].map(() => 'grey')
        const image_id = dataset_image.image_id
        biolucida
          .getThumbnail(image_id)
          .then((response) => {
            const index = this.thumbnails.findIndex(
              (item) => item.id === image_id,
            )
            let thumbnail = this.thumbnails[index]
            biolucida.getImageInfo(image_id).then((response) => {
              const imageInfo = response.data
              let imageName = imageInfo.name
              imageName =
                imageName.substring(0, imageName.lastIndexOf('.')) || imageName
              if (imageName.toUpperCase().endsWith('JPX')) {
                this.overlayColours.splice(index, 1, 'cyan')
                imageName += ' - 3D image'
              } else {
                this.overlayColours[index] = 'violet'
                imageName += ' - 2D image'
              }
              this.imageNames[index] = imageName
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
          .catch((error) => {
            console.log('Error fetching thumbnail: ', dataset_image.image_id)
            console.log(error.message)
          })
      })
      this.datasetScaffolds.forEach((dataset_scaffold) => {
        const scaffold_index = this.thumbnails.length
        this.imageNames[scaffold_index] =
          dataset_scaffold.name + ' - 3D scaffold'
        this.overlayColours[scaffold_index] = 'yellow'
        this.thumbnails.push({
          id: dataset_scaffold.name,
          img: this.defaultScaffoldImg,
          metadata_file: '',
        })
        discover
          .browse(
            this.$route.params.datasetId,
            dataset_scaffold.version,
            dataset_scaffold.path,
          )
          .then((response) => {
            response.data.files.forEach((entry) => {
              if (entry.name.toUpperCase().includes('METADATA')) {
                this.thumbnails[
                  scaffold_index
                ].metadata_file = entry.uri.replace(
                  's3://blackfynn-discover-use1/',
                  '',
                )
              }
            })
          })
          .catch((error) => {
            console.log(
              'Error fetching scaffold files: ',
              dataset_scaffold.name,
            )
            console.log(error.message)
          })
      })
    },
    viewerId(shareLink) {
      const linkParts = shareLink.split(process.env.BL_SHARE_LINK_PREFIX)

      return linkParts[1]
    },
    getThumbnailLinkType(imageInfo) {
      const imageInfoKeys = Object.keys(imageInfo)
      const shareLinkIndex = imageInfoKeys.indexOf('share_link')
      const metadataFileIndex = imageInfoKeys.indexOf('metadata_file')
      let imageType = 'unknown'
      if (shareLinkIndex !== -1) {
        imageType = 'biolucida'
      } else if (metadataFileIndex !== -1) {
        imageType = 'scaffold'
      }
      return imageType
    },
    getThumbnailLinkParams(imageInfo) {
      const imageType = this.getThumbnailLinkType(imageInfo)
      let params = {}
      switch (imageType) {
        case 'biolucida':
          params = {
            id: imageInfo.id,
          }
          break
        case 'scaffold':
          params = {
            id: imageInfo.name,
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
          }
          break
        case 'scaffold':
          query = {
            scaffold: imageInfo.metadata_file,
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
        default:
      }

      return name
    },
    imageOverlayColour(index) {
      return this.overlayColours[index]
    },
  },
}
</script>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
}

.key-image-span.active {
  transform: scale(1.1);
  border: #8300bf solid;
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
