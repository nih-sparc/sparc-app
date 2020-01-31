<template>
  <div class="help-card">
    <h3>
      <nuxt-link
        :to="{ name: 'help-helpId', params: { helpId: helpItem.sys.id } }"
      >
        {{ helpItem.fields.title }}
      </nuxt-link>
    </h3>
    <p>{{ helpItem.fields.summary }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelpCard',
  props: {
    helpItem: {
      type: Object,
      default: () => {
        return {
          title: ''
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
