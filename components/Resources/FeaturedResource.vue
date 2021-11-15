<template>
  <div class="featured-resource">
    <div v-if="thumbnailUrl !== null" class="thumbnail">
      <div class="image-container">
        <div class="image-border">
          <img :src="thumbnailUrl" />
        </div>
      </div>
    </div>
    <div class="resource-info">
      <div>
        <div class="header">
          <h3>{{ title }}</h3>
          <sparc-pill v-if="tag !== null">{{ tag }}</sparc-pill>
        </div>
        <p v-if="subtitle !== null" class="subtitle">
          {{ subtitle }}
        </p>
      </div>
      <p v-if="description !== null">
        {{ description }}
      </p>
      <a v-if="buttonLink !== null" :href="buttonLink">
        <el-button class="pink-button">
          View resource
        </el-button>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.featured-resource {
  display: flex;
  flex-direction: row;
  & > div.thumbnail {
    flex: 0.3;
    & > .image-container {
      & > .image-border {
        border: 2px solid rgb(151, 151, 151);
        border-radius: 1px;
        padding: 0.65em;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        & > img {
          height: auto;
          width: 100%;
        }
      }
      padding-top: 100%;
      position: relative;
    }
  }
  & > div.resource-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  & > div + div {
    margin-left: 2em;
  }
}
h3 {
  font-size: 1.5rem;
  line-height: 2.25rem;
}
.header {
  display: flex;
  align-items: center;
  & > h3 {
    margin: 0 1em 0 0;
  }
  & > span {
    font-family: 'Asap', sans-serif;
    font-size: 12px;
    padding: 0 0.65rem;
  }
}
.subtitle {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 14px;
}
</style>

<style lang="scss">
@import '@/assets/_variables.scss';
button.pink-button {
  padding-top: 0.688rem;
  background: #f9f2fc;
  border: 1px solid $median;
  color: $median;
  &:hover {
    color: #1a1489;
  }
  @media (max-width: 24em) {
    margin-top: 10px;
    margin-left: 0;
  }
}
</style>

<script>
import SparcPill from '@/components/SparcPill/SparcPill.vue'
export default {
  name: 'FeaturedResource',
  components: {
    SparcPill
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    description: {
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
    }
  }
}
</script>
