<template>
  <div class="homepage-twitter">
    <div class="container">
      <el-row type="flex" justify="center">
        <el-col :xs="22" :sm="22" :md="12">
          <div v-twitter-widgets>
            <a
              class="twitter-timeline"
              href="https://twitter.com/sparc_science?ref_src=twsrc%5Etfw"
              data-height="500"
              target="_blank"
            >
              Tweets by sparc_science
            </a>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomepageTwitter'
}
</script>

<style lang="scss" scoped>
.homepage-twitter {
  background: #fff;
  padding: 2rem 0;
  @media (min-width: 768px) {
    padding: 4rem 0;
  }
}
</style>
