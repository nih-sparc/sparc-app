<template>
  <div v-loading="loadingMarkdown" class="dataset-description-info">
    <h2 class="section-text">
      Methodology
    </h2>
    <div
      class="col-xs-12 description-container"
      v-html="parseMarkdown(markdown.markdownTop)"
    />
    <div
      v-if="markdown.markdownBottom"
      class="col-xs-12 description-container"
      v-html="parseMarkdown(markdown.markdownBottom)"
    />
    <hr>
    <h2 class="section-text">
      Metadata
    </h2>
    <p><strong>Experimental Design: </strong></p>
    <div class="experimental-design-container">
      <span class="experimental-design-section-text-column"><strong>Protocol Links: </strong></span>
      <span v-if="datasetRecords.length !== 0">
        <div v-for="record in datasetRecords" :key="record.id">
          <a
            :href="record.url"
            target="_blank"
          >
            {{ record.url }}
          </a>
        </div> 
      </span>
      <span
        v-else
      >
        <p>N/A</p>
      </span>
    </div>
    <hr>
    <span><strong>Keywords: </strong></span>
    <span v-if="datasetTags.length !== 0">
      <span class="keywords" v-for="(item, index) in datasetTags" :key="index">
        <p v-if="index !== datasetTags.length - 1">{{item}},&nbsp</p>
        <p v-else>{{item}}</p>
      </span>
    </span>
    <span v-else>
      <p>N/A</p>
    </span>
  </div>
</template>

<script>
import marked from '@/mixins/marked/index'

export default {
  name: 'DatasetDescriptionInfo',

  mixins: [marked],

  props: {
    loadingMarkdown: {
      type: Boolean,
      default: false
    },
    markdown: {
      type: Object,
      default: () => {}
    },
    datasetRecords: {
      type: Array,
      default: () => []
    },
    datasetTags: {
      type: Array,
      default: () => []
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.dataset-description-info {
  .section-text {
    font-weight: 500;
  }
  ::v-deep hr{
    margin-top: 1rem;
    border-top: none;
  }
  .keywords {
    p {
      display: inline-block;
      margin: 0;
    }
    p:first-letter {
      text-transform: uppercase;
    }
  }

  .experimental-design-container {
    padding-left: 2rem;
    display: flex;
    a {
      text-decoration: underline;
    }
    @media (max-width: 48em) {
      flex-direction: column;
    }
    .experimental-design-section-text-column {
      min-width: 7rem;
    }
  }
}
</style>
