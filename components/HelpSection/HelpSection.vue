<template>
  <div class="help-section">
    <h2>
      {{ section.fields.title }}
    </h2>
    <div class="section">
      <help-card
        v-for="(item, index) in section.fields.helpDocuments"
        :key="`${item}-${index}`"
        :help-item="item"
      />
    </div>
  </div>
</template>

<script>
import HelpCard from '@/components/HelpCard/HelpCard.vue'

export default {
  name: 'HelpSection',
  components: {
    HelpCard
  },
  props: {
    section: {
      type: Object,
      default: () => {
        return {
          title: '',
          sys: {},
          summary: ''
        }
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
</style>
