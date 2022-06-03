<template>
  <client-only>
    <div class="main-container">
      Redirecting you to the SPARC Help Center...
    </div>
  </client-only>
</template>
<script>
export default {
  mounted() {
    // It appears the only way to handle vue router redirects to external sites is by setting window.location.href directly, but the window object is only present after
    // the page has been mounted and is viewable. Therefore we display the redirecting text before redirecting. This issue has been filed many times with Vue:
    // https://github.com/nuxt/nuxt.js/issues/770, https://github.com/vuejs/vue-router/issues/1280, https://github.com/nuxt/nuxt.js/issues/1082
    if (process.client) {
        window.location.href = "https://docs.sparc.science/";
    }
  },
}
</script>
