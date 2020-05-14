<template>
  <div class="biolucida-image-gallery full-size">
    <carousel-3d
      display="7"
      :loop="false"
      :controls-visible="true"
      :start-index="startIndex"
      :aspect-ratio="slideAspectRatio"
      :axis="slideAxis"
      :count="thumbnails.length"
      @before-slide-change="slideChanged"
    >
      <slide
        v-for="(thumbnail_image, index) in thumbnails"
        :key="'slide_' + index"
        :index="index"
      >
        <img
          :ref="'slide_image_' + thumbnail_image.id"
          :src="thumbnail_image.img"
          alt="thumbnail missing"
          class="thumbnail-100"
        />
      </slide>
    </carousel-3d>
    <div class="standard-gallery">
      <span
        v-for="(thumbnail_image, index) in thumbnails"
        :key="'thumbnail_' + index"
        class="key-image-span"
      >
        <img
          :ref="'key_image_' + thumbnail_image.id"
          :src="thumbnail_image.img"
          alt="thumbnail missing"
          class="thumbnail thumbnail-100"
        />
      </span>
    </div>
  </div>
</template>

<script>
import biolucida from '@/services/biolucida'
import Carousel3d from './Carousel3d'
import Slide from './Slide'

export default {
  name: 'ImageGallery',
  components: {
    Carousel3d,
    Slide,
  },
  props: {
    datasetImages: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      thumbnails: [],
      startIndex: 0,
      slideAspectRatio: 0,
      slideAxis: undefined,
      defaultImg: require('@/assets/sparc.min.svg'),
    }
  },
  watch: {
    datasetImages: function() {
      this.startIndex = Math.floor(this.datasetImages.length / 2 - 0.5)
      this.getThumbnails()
    },
  },
  methods: {
    slideChanged(index) {
      for (let i = 0; i < this.thumbnails.length; i++) {
        const keyImageElement = this.$refs[
          'key_image_' + this.thumbnails[i].id
        ][0]
        if (i === index) {
          keyImageElement.parentElement.classList.add('active')
        } else {
          keyImageElement.parentElement.classList.remove('active')
        }
      }
    },
    getThumbnails() {
      this.thumbnails.clear
      this.slideAxis = undefined
      this.slideAspectRatio = 1.0
      this.thumbnails = Array.from(this.datasetImages, (dataset_image) => {
        const img = this.defaultImg.replace(
          'XXXYYYZZZ',
          dataset_image.image_id.toString()
        )
        return { id: dataset_image.image_id, img }
      })
      this.datasetImages.forEach((dataset_image) => {
        biolucida
          .getThumbnail(dataset_image.image_id)
          .then((response) => {
            const index = this.thumbnails.findIndex(
              (item) => item.id === dataset_image.image_id
            )
            const thumbnail = this.thumbnails[index]
            const base64Image = new Buffer(response.data, 'ascii').toString(
              'base64'
            )
            thumbnail.img =
              'data:' +
              response.headers['content-type'] +
              ';base64,' +
              base64Image
            if (!this.slideAxis) {
              let img = new Image()

              img.onload = function() {
                this.slideAxis =
                  img.naturalWidth > img.naturalHeight
                    ? 'landscape'
                    : 'portrait'
                this.slideAspectRatio = img.naturalHeight / img.naturalWidth
              }

              img.src =
                'data:' +
                response.headers['content-type'] +
                ';base64,' +
                base64Image
            }
          })
          .catch((error) => {
            console.log('Error fetching thumbnail: ', dataset_image.image_id)
            console.log(error.message)
          })
      })
    },
  },
}
</script>

<style scoped>
.full-size {
  width: 100%;
  height: 100%;
}
.thumbnail {
  max-width: 150px;
}
.key-image-span.active {
  transform: scale(1.1);
  border: black solid;
}
.thumbnail-100 {
  width: 100%;
}
.key-image-span {
  display: flex;
}
.standard-gallery {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
</style>
