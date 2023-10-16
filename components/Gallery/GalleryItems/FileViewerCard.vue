<template>
  <el-card :shadow="shadow" :style="{ padding: '0px', maxWidth: width + 'rem' }">
    <div v-loading="!isReady">
      <div class="cursor-pointer" @click.prevent="cardClicked">
        <img v-if="useDefaultImg" src="~/assets/logo-sparc-wave-primary.svg" svg-inline />
        <img v-else :src="thumbnail" alt="thumbnail loading ..." />
      </div>
      <div v-if="false" class="image-overlay">
        <div
          class="triangle-right-corner"
          :style="`border-left-width: ${triangleHeight * 1.2}rem; border-top-width: ${triangleHeight}rem;`"
          @click="openLinkInNewTab"
        />
        <el-tooltip class="item" :content="`View ${data.type}`" placement="left">
          <img
            class="triangle-icon"
            :style="`height: ${triangleHeight * 0.25}rem;top: ${triangleHeight * 0.15}rem;right: ${triangleHeight * 0.15}rem`"
            :src="typeIcon"
            @click="openLinkInNewTab"
          />
        </el-tooltip>
      </div>
      <div v-if="showCardDetails" class="details">
        <p v-if="!data.hideType">
          <b>{{ data.type }}</b>
        </p>
        <el-popover
          ref="galleryPopover"
          :disabled="disableTooltip"
          :content="data.title"
          placement="top"
          trigger="hover"
          popper-class="gallery-popper"
        />
        <!--use v-show here to make sure el popover always have a starting location -->
        <p v-show="!data.hideTitle" ref="titleText" v-popover:galleryPopover class="title">
          {{ data.title }}
        </p>
        <p v-show="data.hideTitle" class="title text-placeholder" />
        <el-button class="primary" @click.prevent="cardClicked"> View {{ data.type }}</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>

function isValidHttpUrl(string) {
  let url = undefined

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export default {
  name: 'GalleryCard',
  mixins: [],
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 3,
    },
    height: {
      type: Number,
      default: 3,
    },
    showCardDetails: {
      type: Boolean,
    },
    shadow: {
      type: String,
      default: 'always',
    },
  },
  data() {
    return {
      ro: null,
      triangleSize: 4,
      thumbnail: undefined,
      useDefaultImg: false,
      disableTooltip: false,
      tooltipCalculated: false,
    }
  },
  computed: {
    isReady() {
      return this.data.title && (this.thumbnail || this.useDefaultImg) && (this.data.link || this.data.userData)
    },
    imageHeight() {
      return this.showCardDetails ? this.height * 0.525 : this.height
    },
    imageWidth() {
      return this.width - 2 * this.marginDetails
    },
    triangleHeight() {
      return this.height * 0.237
    },
    marginDetails() {
      return this.height * 0.076
    },
    typeIcon() {
      return undefined
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function () {
        this.thumbnail = undefined
        this.useDefaultImg = false
        this.tooltipCalculated = false
        this.disableTooltip = false
        if (this.data.thumbnail) {
          if (isValidHttpUrl(this.data.thumbnail) && this.data.mimetype) {
            this.downloadThumbnail(this.data.thumbnail, { fetchAttempts: 0 })
          } else {
            this.thumbnail = this.data.thumbnail
          }
        } else {
          this.useDefaultImg = true
        }
        //Dynamically check title length to determine if popover should be shown
        this.$nextTick(() => {
          this.calculateShowTooltip()
        })
      },
    },
  },
  updated: function () {
    if (!this.tooltipCalculated) {
      this.$nextTick(() => {
        this.calculateShowTooltip()
      })
    }
  },
  methods: {
    /**
     * Open a new link if link is provide.
     * Fire an event if userData is provide.
     */
    cardClicked: function () {
      if (this.data.link) {
        const link = document.createElement('a')
        link.href = this.data.link
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      if (this.data.userData) {
        this.$emit('card-clicked', this.data.userData)
      }
    },
    /**
     * handle thumbnail downloading,, it will use a default svg image if fails
     */
    downloadThumbnail: function (url, info) {
      this.getRequest(url, {}, 11000).then(
        (response) => {
          let data = response.data
          if (typeof data === 'string' && data.startsWith('data:')) {
            this.thumbnail = response.data
          } else {
            if (this.data.mimetype) {
              this.thumbnail = `data:${this.data.mimetype};base64,${response.data}`
            } else {
              this.thumbnail = response.data
            }
          }
        },
        (reason) => {
          if (reason.message.includes('timeout') && reason.message.includes('exceeded') && info.fetchAttempts < 3) {
            info.fetchAttempts += 1
            this.downloadThumbnail(url, info)
          } else {
            this.useDefaultImg = true
          }
        }
      )
    },
    //dynamically calculate if tooltip is required
    calculateShowTooltip: function () {
      if (this.data.hideTitle) {
        this.disableTooltip = true
        this.tooltipCalculated = true
      } else {
        const ele = this.$refs.titleText
        //Check if title text is rendered yet
        if (ele && ele.offsetParent) {
          this.tooltipCalculated = true
          if (ele.offsetWidth >= ele.scrollWidth) this.disableTooltip = true
          else this.disableTooltip = false
        } else {
          //text not rendered yet
          if (this.data.title.length > 20) this.disableTooltip = false
          else this.disableTooltip = true
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.card {
  position: relative;
}
.details {
  text-align: left;
}

.cursor-pointer {
  cursor: pointer;
}

.text-placeholder {
  height: 1rem;
}

.title {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.bold {
  font-weight: bold;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
}

.triangle-icon {
  position: absolute;
}

.triangle-right-corner {
  width: 0;
  height: 0;
  border-left: solid transparent;
  border-top: solid $purple;
}
</style>
