<template>
  <div>
    <div class="subpage-col about-page-border">
      <div class="about-page-text" v-html="text" />
      <NuxtLink
        v-if="buttonText !== null && buttonLinkExternal === null"
        class="margin-top-auto"
        :to="buttonLink"
      >
        <el-button class="about-button">
          {{ buttonText }}
        </el-button>
      </NuxtLink>
      <a
        v-if="buttonText !== null && buttonLinkExternal !== null"
        class="margin-top-auto"
        :href="buttonLinkExternal"
        target="_blank"
      >
        <el-button class="about-button">
          {{ buttonText }}
        </el-button>
      </a>
    </div>
    <img
      v-if="imgSrc"
      slot="image"
      class="portal-image midnightblue-background"
      :src="imgSrc"
    />
  </div>
</template>

<script>
export default {
  name: 'Paper',
  props: {
    text: {
      type: String,
      default: ''
    },
    buttonLink: {
      type: Object,
      default: null
    },
    buttonLinkExternal: {
      type: String,
      default: null
    },
    buttonText: {
      type: String,
      default: null
    },
    imgSrc: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.subpage-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;
  padding: 2rem;

  @media screen and (max-width: 767px) {
    margin-top: 0;
  }
  .about-page-text {
    @media screen and (max-width: 767px) {
      margin-left: 0;
    }
  }
}
.about-page-border {
  border: 1px solid #dcdfe6;
}
.margin-top-auto {
  margin-top: auto;
}
.about-button {
  border: 2px solid $median;
  background-color: ghostwhite;
}
.midnightblue-background {
  background-color: midnightblue;
}
.portal-image {
  height: auto;
  width: 30%;
  min-width: 20rem;

  @media screen and (max-width: 767px) {
    display: none;
  }
}
</style>
