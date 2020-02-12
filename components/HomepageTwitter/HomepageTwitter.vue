<template>
  <div class="homepage-twitter">
    <div class="container">
      <el-row type="flex" justify="center">
        <el-col :xs="22" :sm="22" :md="12">
          <a
            class="twitter-timeline"
            href="https://twitter.com/sparc_science?ref_src=twsrc%5Etfw"
            data-height="500"
          >
            Tweets by sparc_science
          </a>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomepageTwitter',

  mounted() {
    /**
     * Load the Twitter widget library
     * https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
     */
    window.twttr = (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {}
      if (d.getElementById(id)) return t
      js = d.createElement(s)
      js.id = id
      js.src = 'https://platform.twitter.com/widgets.js'
      fjs.parentNode.insertBefore(js, fjs)

      t._e = []
      t.ready = function(f) {
        t._e.push(f)
      }

      return t
    })(document, 'script', 'twitter-wjs')
  }
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
