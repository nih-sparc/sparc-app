<template>
  <div>
    <div v-html="parseMarkdown(data.description)" />
    <nuxt-link :to="data.url">
      <el-button class="call-to-action-btn">{{ data.title }}</el-button>
    </nuxt-link>
  </div>
</template>

<script>
import MarkedMixin from '@/mixins/marked'

export default {
  name: 'CallToAction',
  mixins: [MarkedMixin],

  props: {
    data: {
      type: Object
    }
  }
}
</script>
<style scoped>
.call-to-action-btn {
  font-size: 24px;
  padding: 1.2rem 1.8rem;
}
</style>
