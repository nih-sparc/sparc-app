<template>
  <el-card
    class="mr-8"
    :style="{ border: 'none', maxWidth: width + 'rem', minWidth: width + 'rem' }" 
    :body-style="{ 
      'height': '90%',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
      'text-align': 'center' }" 
  >
    <div>
      <div class="image-container">
        <img class="thumbnail" :src="thumbnailUrl" alt="thumbnail loading ..." />
      </div>
      <div class="body1">
        {{description}}
      </div>
    </div>
    <div class="status-container">
      <div class="body1 mb-16">
        Status: <b>{{ status }}</b>
      </div>
      <a :href="buttonLink" target="_blank">
        <el-button class='secondary'>
          Launch Pennsieve <svg-icon icon="icon-open" height="16" width="16" />
        </el-button>
      </a>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'RepositoryCard',
  props: {
    width: {
      type: Number,
      default: 13.8
    },
    description: {
      type: String,
      default: null
    },
    status: {
      type: String,
      default: null
    },
    buttonLink: {
      type: String,
      default: null
    },
    thumbnailUrl: {
      type: String,
      default: null
    },
  }
}
</script>
<style lang="scss" scoped>
.image-container {
  margin: auto;
  img {
    height: 5rem;
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
  }
}
</style>
