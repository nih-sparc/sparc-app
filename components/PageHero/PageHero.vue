<template>
  <div class="page-hero">
    <div class="container">
      <el-row type="flex" :justify="justify">
        <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="18">
          <slot />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHero',
  props: {
    justify: {
      type: String,
      default: 'center'
    }
  }
}
</script>

<style lang="scss">
.page-hero {
  background-image: linear-gradient(90deg, #0026ff 0%, #00ffb9 100%);
  color: #f0f2f5;
  font-size: 1em;
  line-height: 1.5rem;
  padding: 2rem 1rem;
  @media (min-width: 768px) {
    font-size: 1.25em;
    line-height: 2rem;
    padding: 1.5rem 0;
  }
  &.large {
    background-image: linear-gradient(
      90deg,
      rgb(12, 0, 191) 0%,
      rgb(188, 0, 252) 100%
    );
    text-align: center;

    @media (min-width: 768px) {
      font-size: 1.625em;
      line-height: 2.375rem;
      padding: 3rem 0;
    }
    p {
      margin: 0 auto 1rem;
      max-width: 58rem;
      @media (min-width: 768px) {
        margin-bottom: 2rem;
      }
    }
  }
}
</style>
