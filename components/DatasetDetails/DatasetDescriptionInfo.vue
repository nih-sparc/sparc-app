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
    <p class="mb-8"><strong>Experimental Design: </strong></p>
    <div class="experimental-design-container mb-8">
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
        n/a
      </span>
    </div>
    <div class="experimental-design-container mb-16">
      <span><strong>Experimental Approach: </strong>{{experimentalApproachText}}</span>
    </div>
    <p class="mb-8"><strong>Subject Information: </strong></p>
    <div class="experimental-design-container mb-8">
      <span><strong>Anatomical structure: </strong>{{anatomicalStructureText}}</span>
    </div>
    <div class="experimental-design-container mb-8">
      <span><strong>Species: </strong>{{speciesText}}</span>
    </div>
    <div class="experimental-design-container mb-8">
      <span><strong>Sex: </strong>{{sexText}}</span>
    </div>
    <div class="experimental-design-container mb-8">
      <span><strong>Age range: </strong>{{ageRangeText}}</span>
    </div>
    <div class="experimental-design-container mb-16">
      <span><strong>Number of subjects: </strong>{{numberSubjects}}</span>
    </div>
    <div class="mb-16">
      <a 
        :href="downloadMetadataUrl"
        @click.prevent="
          downloadItem({
            url: downloadMetadataUrl,
            label: 'metadata.json',
          })
        "
      >
        <el-button class="secondary">Download Metadata file</el-button>
      </a>
    </div>
    <hr>
    <span><strong>Keywords: </strong></span>
    <span v-if="datasetTags.length !== 0">
      <span class="keywords" v-for="(item, index) in datasetTags" :key="index">
        <p v-if="index !== datasetTags.length - 1">{{item}},&nbsp;</p>
        <p v-else>{{item}}</p>
      </span>
    </span>
    <span v-else>
      <p>n/a</p>
    </span>
  </div>
</template>

<script>
import marked from '@/mixins/marked/index'
import { mapState } from 'vuex'
import createAlgoliaClient from '@/plugins/algolia.js'
import { propOr } from 'ramda'
import _ from 'lodash'
import axios from 'axios'

const algoliaClient = createAlgoliaClient()
const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX)

export default {
  name: 'DatasetDescriptionInfo',

  mixins: [marked],

  data() {
    return {
      datasetMetadataInfo: {}
    }
  },

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
  },

  computed: {
    ...mapState('pages/datasets/datasetId', ['datasetFacetsData','datasetInfo']),
    anatomicalStructureText: function() {
      return this.getFacetText('Anatomical Structure')
    },
    experimentalApproachText: function() {
      return this.getFacetText('Experimental Approach')
    },
    speciesText: function() {
      return this.getFacetText('Species')
    },
    sexText: function() {
      return this.getFacetText('Sex')
    },
    ageRangeText: function() {
      return this.getFacetText('Age Categories')
    },
    numberSubjects: function() {
      return _.get(this.datasetMetadataInfo.item, 'statistics.subjects.count') || 'n/a'
    },
    /**
     * Gets dataset id
     * @returns {Number}
     */
    datasetId: function() {
      return propOr(0, 'id', this.datasetInfo)
    },
    /**
     * Gets dataset version
     * @returns {Number}
     */
    versionId: function() {
      return propOr(0, 'version', this.datasetInfo)
    },
    /**
     * Computes the API url for downloading the metadata of a dataset
     * @returns {String}
     */
    downloadMetadataUrl: function() {
      return `${process.env.bf_api_host}/discover/datasets/${this.datasetId}/versions/${this.versionId}/metadata`
    }
  },

  created() {
    const objectId = this.datasetInfo.id
    try {
    algoliaIndex.getObject(objectId).then(response => {
      this.datasetMetadataInfo = response
    })
    } catch (error) {

    }
  },

  methods: {
    getFacetText(facetLabel) {
       let text = ''
      const facet = this.datasetFacetsData.find(item => item.label === facetLabel)
      if (facet === undefined || !facet.children)
      {
        return 'n/a'
      }
      facet.children.forEach(child => {
        let childLabel = child.label.charAt(0).toUpperCase() + child.label.slice(1)
        text += `${childLabel}, `
      })
      return text.substring(0, text.length-2);
    },
    downloadItem({ url, label }) {
      axios.get(url, { responseType: "blob" }).then(response => {
        const blob = new Blob([response.data], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = label;
        link.click();
        URL.revokeObjectURL(link.href);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dataset-description-info {
  overflow-wrap: anywhere;
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
      min-width: 6.75rem;
    }
  }
}
</style>
