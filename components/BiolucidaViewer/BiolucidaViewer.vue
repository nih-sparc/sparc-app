<template>
  <div class="biolucida-viewer">
    <iframe v-if="data.status !== 'error'" :src="data.share_link" />
    <p v-else class="error">
      Sorry, an error has occurred
    </p>
  </div>
</template>

<script>
export default {
  name: 'BiolucidaViewer',

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
