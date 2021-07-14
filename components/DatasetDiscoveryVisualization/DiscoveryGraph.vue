<template>
  <div v-loading="isLoading" class="">
    vis
  </div>
</template>

<script>
export default {
  name: 'DiscoveryGraph',

  props: {
    /**
    * info about each dataset we're comparing
    *
    */
    datasetsInfo: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
    }
  },

  watch: {
    datasetsInfo: {
      immediate: true,
      handler (values, oldValues) {
        console.log("refreshing visualization...")
        this.refreshVisualization(values)
      }
    },
  },

  computed: {
  },

  methods: {
    async refreshVisualization (datasetsInfo) {
      this.$emit('loading')

      try {
        const { data } = await this.$axios.get("/dataset-discovery-api/test")

        console.log("response from our frontend server:", data)
        return data

      } catch (err) {
        console.error(err)
        
      } finally {
        this.$emit('notLoading')
      }

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
