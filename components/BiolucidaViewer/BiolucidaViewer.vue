<template>
  <div class="biolucida-viewer">
    <template v-if="data.status !== 'error'">
      <iframe :src="data.share_link" />
      <a :href="data.share_link" target="_blank">
        <bf-button>Fullscreen</bf-button>
      </a>
    </template>
    <p v-else class="error">
      Sorry, an error has occurred
    </p>
  </div>
</template>

<script>
import BfButton from '@/components/shared/BfButton/BfButton.vue'

export default {
  name: 'BiolucidaViewer',

  components: {
    BfButton
  },

  props: {
    data: {
      type: Object,
      default: () => {
        return {
          biolucida_image_id: '',
          share_link: '',
          status: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
iframe {
  border: none;
  height: 500px;
  width: 100%;
}
.error {
  margin: 0;
  text-align: center;
}
</style>
