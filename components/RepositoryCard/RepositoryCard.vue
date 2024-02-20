<template>
  <el-card :style="{ border: 'none', maxWidth: width + 'rem' }" class="card centered">
    <div class="image-container">
      <img class="thumbnail" :src="thumbnailUrl" alt="thumbnail loading ..." />
    </div>
    <div class="body1 mb-16">
      {{description}}
    </div>
    <div class="body1 mb-16">
      Status: <b>{{ status }}</b>
    </div>
    <a :href="buttonLink" target="_blank">
      <el-button class='secondary'>
        Launch Pennsieve <svg-icon icon="icon-open" height="16" width="16" />
      </el-button>
    </a>
  </el-card>
</template>
<script>
export default {
  name: 'RespositoryCard',
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
.centered {
  text-align: center;
}
.image-container {
  max-width: 75%;
  margin: auto;
  img {
    width: 100%;
  }
}
</style>