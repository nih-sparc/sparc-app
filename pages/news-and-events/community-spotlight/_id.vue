<template>
  <div class="events-page">
    <div class="page-wrap container">
      <div class="subpage">
        hello! {{id}}
        <div class="content" v-html="renderedStory" />
      </div>
    </div>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
  name: 'StoryPage',
  async asyncData({ route }) {
    try {
      console.log('in id page!')
      console.log(route.params.story)
      return {
        id: route.params.id,
        story: route.params.story
      }
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
      id: '',
      story: ''
    }
  },
  computed:{
    renderedStory: function(){
      if (this.story){
        return documentToHtmlString(this.story)
      }
      return ''
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.page-wrap {
  width: 1035px;
}

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
