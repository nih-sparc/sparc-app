<template>
  <div class="featured-resource">
    <div class="thumbnail">
      <div class="image-container">
        <div class="image-border">
          <img src="/images/osparc-human.png" />
        </div>
      </div>
    </div>
    <div class="resource-info">
      <div>
        <div class="header">
          <h3>Un titulo</h3>
          <chip>SPARC</chip>
        </div>
        <p class="subtitle">
          Subtítulo
        </p>
      </div>
      <p>
        A web platform for creating and storing protocols. Protocols.io is a
        public platform for creating and storing scientific protocols. Each
        protocol can be kept private or made public. Protocols can be "forked"
        or copied to create a new version of the same protocol. SPARC maintains
        a workplace on this platform.
      </p>
      <div>
        <el-button class="pink-button">
          View resource
        </el-button>
      </div>
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
        padding: 0.65em;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
      }
      & img {
        height: auto;
        width: 100%;
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
import Chip from '@/components/Chip/Chip.vue'
export default {
  name: 'FeaturedResource',
  components: {
    Chip
  }
}
</script>
