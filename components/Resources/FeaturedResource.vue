<template>
  <div class="featured-resource">
    <div class="thumbnail">
      <img src="/images/osparc-human.png" />
    </div>
    <div class="resource-info">
      <h3>Un titulo</h3>
      <p class="subtitle">
        Subtítulo
      </p>
      <p>
        A web platform for creating and storing protocols. Protocols.io is a
        public platform for creating and storing scientific protocols. Each
        protocol can be kept private or made public. Protocols can be "forked"
        or copied to create a new version of the same protocol. SPARC maintains
        a workplace on this platform.
      </p>
      <el-button>View resource</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.featured-resource {
  display: flex;
  flex-direction: row;
  & > div.thumbnail {
    flex: 0.5;
    margin-right: 2em;
    & > img {
      height: auto;
      width: 100%;
    }
  }
  & > div.resource-info {
    flex: 1;
    & > button {
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
  }
  .subtitle {
    text-transform: uppercase;
  }
}
h3 {
  font-size: 1.25rem;
  line-height: 2.25rem;
}
</style>
