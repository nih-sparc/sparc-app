<template>
  <div class="events-page">
    hello! {{id}}
  </div>
</template>

<script>
export default {
  name: 'StoryPage',

  async asyncData({ route }) {
    try {
      console.log('in id page!')
      return { id : route.params.id}
    } catch (error) {
      return {
        page: {
          fields: []
        }
      }
    }
  },
  data: function(){
    return {
      id: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.content {
  & ::v-deep {
    color: $vestibular;
  }
  & ::v-deep p {
    margin-bottom: 1em;
  }
  & ::v-deep img {
    height: auto;
    margin: 0.5em 0;
    max-width: 100%;
  }
}

.header {
  margin-bottom: 3em;
  .updated {
    color: #aaa;
  }
}
</style>
