<template>
  <div class="card-container p-16">
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="image-container"> 
          <img class="banner-image" :src="banner" :alt="'image could not load'" />
        </div>
      </el-col>
      <el-col :span="18">
        <template v-if="link.isInternal">
          <nuxt-link
            class="dataset-name tab1"
            :to="link.path"
          >
            {{ title }}
          </nuxt-link>
          <div class="dataset-description body1 mt-8">
            {{ description }}
          </div>
          <el-button class="secondary mt-16">
            <nuxt-link
              class="button-link"
              :to="link.path"
            >
              {{ buttonText }}
            </nuxt-link>
          </el-button>
        </template>
        <template v-else>
          <a
            class="dataset-name tab1"
            :href="link.path"
          >
            {{ title }}
          </a>
          <div class="dataset-description body1 mt-8">
            {{ description }}
          </div>
          <el-button class="secondary mt-16">
            <a
              class="button-link"
              :href="link.path"
            >
              {{ buttonText }}
              <svg-icon name="icon-open" height="20" width="20" />
            </a>
          </el-button>
        </template>
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
      type: Object,
      default: {
        isInternal: true,
        path:'/'
      }
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
