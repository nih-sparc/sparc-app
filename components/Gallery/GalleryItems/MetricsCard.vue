<template>
  <el-card :style="{ border: 'none', maxWidth: width + 'rem' }" class="card">
    <div class="title-container">
      <div class="title heading2">
        {{ title }}
      </div>
    </div>
    <div class="heading1 data">
      {{ data }}
    </div>
    <div class="body1 mb-16">
      {{ subData }}
    </div>
  </el-card>
</template>

<script>
import SparcPill from '@/components/SparcPill/SparcPill.vue'
export default {
  name: 'ResourceCard',
  components: {
    SparcPill
  },
  props: {
    width: {
      type: Number,
      default: 21
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: '0'
    },
    subData: {
      type: String,
      default: '0'
    },
  },
}
</script>

<style scoped lang="scss">
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.data {
  color: $purple;
}
.card {
  background-color: transparent;
  position: relative;
  cursor: default;
  text-align: center;
}
.title-container {
  display: flex;
  align-items: center;
}
.title {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
