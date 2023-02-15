<template>
</template>
<script>
export default {
  name: 'FlatmapViewerPage',
  created: function() {
    this.$router.replace({
      name: 'maps',
      query: {type: "flatmap", ...this.$route.query}
    })
  },
}
</script>
