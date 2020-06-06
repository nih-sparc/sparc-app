<template>
  <div class="biolucida-image-gallery full-size">
    <div class="description-info">
      <p>
        <strong>Data collection:</strong>
        {{ description }}
      </p>
      <p>
        <strong>Highlighted image:</strong>
        {{ imageName }}
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
            :to="{
              name: 'datasets-viewer-id',
              params: {
                id: thumbnail_image.id,
              },
              query: {
                viewer: viewerId(thumbnail_image.share_link),
              },
            }"
          >
            <img
              :ref="'key_image_' + thumbnail_image.id"
              :src="thumbnail_image.img"
              alt="thumbnail missing"
              class="thumbnail thumbnail-100"
            />
          </nuxt-link>
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
  </div>
</template>

<script>
import biolucida from '@/services/biolucida'
import MarkedMixin from '@/mixins/marked'

export default {
  name: 'ImageGallery',
  mixins: [MarkedMixin],
  props: {
    datasetImages: {
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
      imageName: '',
      thumbnails: [],
      imageNames: [],
      currentIndex: 0,
      controlWidth: 50,
      controlHeight: 60,
      slideAspectRatio: 0,
      slideAxis: undefined,
      slideNaturalWidth: -1,
      numberOfImagesVisible: 0,
      defaultImg: require('@/assets/logo-sparc-wave-primary.svg'),
    }
  },
  computed: {
    isPrevPossible() {
      return this.currentIndex > 0
    },
    isNextPossible() {
      return this.currentIndex < this.datasetImages.length - 1
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
    this.currentIndex = Math.floor(this.datasetImages.length / 2 - 0.5)
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
      if (highIndex > this.datasetImages.length) {
        offset = highIndex - this.datasetImages.length
      }
      const isVisible =
        Math.abs(this.currentIndex - index) <
        this.numberOfImagesVisible / 2 + offset
      return isVisible ? undefined : 'none'
    },
    goNext() {
      if (this.currentIndex < this.datasetImages.length - 1) {
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
      this.slideAspectRatio = 1.0
      this.thumbnails = Array.from(this.datasetImages, (dataset_image) => {
        return {
          id: dataset_image.image_id,
          img: this.defaultImg,
          share_link: dataset_image.share_link,
        }
      })
      this.datasetImages.forEach((dataset_image) => {
        biolucida
          .getThumbnail(dataset_image.image_id)
          .then((response) => {
            const index = this.thumbnails.findIndex(
              (item) => item.id === dataset_image.image_id,
            )
            const thumbnail = this.thumbnails[index]
            biolucida.getImageInfo(dataset_image.image_id).then((response) => {
              const imageInfo = response.data
              let imageName = imageInfo.name
              this.imageNames[index] =
                imageName.substring(0, imageName.lastIndexOf('.')) || imageName
              if (index === this.currentIndex) {
                this.imageName = this.imageNames[index]
              }
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
                _this.slideAspectRatio = img.naturalHeight / img.naturalWidth
                _this.slideNaturalWidth = img.naturalWidth
                _this.calculateNumberOfImagesVisible()
              }

              img.src =
                'data:' +
                response.headers['content-type'] +
                ';base64,' +
                response.data
            }
            // Can I get the reference for the element now? I think so.
            if (index === this.currentIndex) {
              const keyImageElement = this.$refs['key_image_' + thumbnail.id][0]
              keyImageElement.parentElement.classList.add('active')
            }
          })
          .catch((error) => {
            console.log('Error fetching thumbnail: ', dataset_image.image_id)
            console.log(error.message)
          })
      })
    },
    calculateNumberOfImagesVisible() {
      const imagesVisibleCount =
        (this.$el.parentElement.clientWidth - 2 * this.controlWidth) /
        this.slideNaturalWidth
      this.numberOfImagesVisible = Math.floor(imagesVisibleCount)
    },
    viewerId(shareLink) {
      const linkParts = shareLink.split(process.env.BL_SHARE_LINK_PREFIX)

      return linkParts[1]
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
</style>
