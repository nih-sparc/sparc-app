<template>
  <div class="card-container p-16">
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="image-container"> 
          <img class="banner-image" :src="banner" :alt="'image could not load'" />
        </div>
      </el-col>
      <el-col :span="18">
        <nuxt-link
          class="dataset-name tab1"
          :to="link"
        >
          {{ title }}
        </nuxt-link>
        <div class="dataset-description body1 mt-8">
          {{ description }}
        </div>
        <el-button class="secondary mt-16">
          <nuxt-link
            class="button-link"
            :to="link"
          >
            {{ buttonText }}
          </nuxt-link>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ProjectsAndDatasetsCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    banner: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.card-container {
  background-color: white;
  height: 100%;
}
.image-container {
  display: flex;
  aspect-ratio: 1;
  border: 1px solid $lineColor2;
}
.banner-image {
  height: auto;
  width: 100%;
  margin: auto;
}
.dataset-name:hover {
  text-decoration: underline;
}
.button-link:hover {
  text-decoration: none;
}
.dataset-description {
  word-wrap: break-word;
}
</style>
