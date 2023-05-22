<template>
  <el-card :shadow="shadow" :style="{ border: 'none', maxWidth: width + 'rem' }" class="card">
    <news-list-item
      :item="item"
    />
  </el-card>
</template>

<script>
import NewsListItem from '@/components/NewsListItem/NewsListItem.vue'

export default {
  name: 'HighlightCard',
  components: {
    NewsListItem
  },
  props: {
    item: {
      type: Object,
      default: {}
    },
    width: {
      type: Number,
      default: 68
    },
    showShadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    shadow() {
      return this.showShadow ? 'always' : 'never'
    },
  }
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.card {
  background-color: transparent;
  position: relative;
  cursor: default;
}
</style>
