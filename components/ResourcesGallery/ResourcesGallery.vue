<template>
  <div ref="myButton" class="gallery">
    <div class="resources-gallery-strip">
      <a v-if="items.length > 1" href="#" :class="['arrow-button', 'prev', { disabled: !isPrevPossible }]" @click.prevent="goPrev">
        <span class="progress-button">&lsaquo;</span>
      </a>
      <div v-else style="width: 2rem" />
      <div class="filler" />
      <div class="card-line">
        <span v-for="(item, index) in windowedItems" :key="index" :class="['key-image-span']">
          <ResourceCard
            v-if="item"
            :width="cardWidth"
            :key="item.sys.id"
            :showShadow="isActive(index)"
            :title="item.fields.name"
            :subtitle="item.fields.resourceType.join(', ')"
            :showSparcTag="item.fields.developedBySparc"
            :description="item.fields.description"
            :thumbnail-url="item.fields.logo.fields.file.url"
            :button-link="`/resources/${item.sys.id}`"
            :external-url="item.fields.url"
            @card-clicked="cardClicked"
          />
        </span>
      </div>
      <div class="filler" />
      <a v-if="items.length > 1" href="#" :class="['arrow-button', 'next', { disabled: !isNextPossible }]" @click.prevent="goNext">
        <span class="progress-button">&rsaquo;</span>
      </a>
      <div v-else style="width: 2rem" />
    </div>
    <index-indicator class="mt-32" :count="itemCount" :current="currentIndex" @clicked="indicatorClicked" />
  </div>
</template>

<script>
import IndexIndicator from './IndexIndicator'
import ResourceCard from './ResourceCard.vue'
function convertRemToPixels(rem) {
  if (typeof window !== 'undefined') {
    return rem * parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  }
  return rem * 16
}
export default {
  name: 'ResourcesGallery',
  components: { IndexIndicator, ResourceCard },
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      },
    },
    cardWidth: {
      type: Number,
      default: 21,
    },
    showIndicatorBar: {
      type: Boolean,
      default: true,
    },
    highlightActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      resizeObserver: null,
      count: 0,
      currentIndex: 0,
      maxWidth: 0
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize).observe(this.$el)
  },
  destroyed() {
    delete this.resizeObserver
  },
  computed: {
    itemCount() {
      return this.items.length
    },
    isPrevPossible() {
      return this.currentIndex > 0
    },
    isNextPossible() {
      return this.currentIndex < this.itemCount - 1
    },
    cardHeight() {
      return 0.78 * this.cardWidth
    },
    cardLineWidth() {
      const cardSpacing = 0.25
      return this.itemCount * (this.cardWidth + cardSpacing) - cardSpacing
    },
    numberOfItemsVisible() {
      // The maximum width we are allowed minus two buttons for next and previous
      // divided by the width of a card.
      // const n = this.itemCount - 1
      const cardSpacingPx = convertRemToPixels(0.5)
      const buttonPx = convertRemToPixels(2)
      const cardWidthPx = convertRemToPixels(this.cardWidth)
      const cardItems = (this.maxWidth - 2 * buttonPx - 2 * cardSpacingPx) / (1.1 * cardWidthPx)
      //Display at least one item
      return Math.max(1, Math.floor(cardItems))
    },
    valueAdjustment() {
      const halfWindow = Math.floor(this.numberOfItemsVisible / 2)
      let valueAdjust = this.currentIndex - halfWindow
      if (valueAdjust < 0) {
        valueAdjust = 0
      } else if (valueAdjust + this.numberOfItemsVisible > this.itemCount) {
        valueAdjust = this.itemCount - this.numberOfItemsVisible
      }
      return valueAdjust
    },
    windowedItems() {
      let myArray = []
      for (let i = 0; i < this.numberOfItemsVisible; i++) {
        myArray.push(this.items[i + this.valueAdjustment])
      }
      return myArray
    },
  },
  methods: {
    cardClicked(payload) {
      this.$emit('card-clicked', payload)
    },
    isActive(index) {
      return this.currentIndex - this.valueAdjustment === index && this.highlightActive
    },
    goNext() {
      this.currentIndex += 1
    },
    goPrev() {
      this.currentIndex -= 1
    },
    indicatorClicked(index) {
      if (this.currentIndex !== index) {
        this.currentIndex = index
      }
    },
    onResize() {
      this.maxWidth = this.$el.clientWidth
    }
  },
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.arrow-button {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  display: flex;
  justify-content: center;
  user-select: none;
  align-self: center;
}
.resources-gallery-strip,
.card-line {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: start;
}
.card-line {
  flex-grow: 2;
}
.progress-button {
  font-size: 3rem;
  font-weight: bold;
  color: $purple;
}
.filler {
  flex-grow: .5;
}
a.prev:not(.underline),
a.next:not(.underline) {
  text-decoration: none;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>