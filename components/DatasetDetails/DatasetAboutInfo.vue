<template>
  <div class="dataset-about-info">
    <div class="dataset-about-info__container">
      <h3>Last Updated</h3>
      <p>{{ updatedDate }}</p>
      <h3>Dataset DOI</h3>
      <p>{{ doi }}</p>
      <el-row
        v-if="datasetRecords.length !== 0"
        type="flex"
        justify="center"
        class="protocol-block"
      >
        <el-col :span="24">
          <h3>
            Protocol DOIs
          </h3>
          <a
            v-for="(record, index) in datasetRecords"
            :key="`${record}-${index}`"
            :href="record.properties.url"
            class="dataset-about-info__container--protocol-text"
          >
            {{ record.properties.url }}
          </a>
        </el-col>
      </el-row>
      <h3>Awards</h3>
      <h3>Cite This Dataset</h3>
      <!-- <el-row type="flex" justify="center">
        <el-col :span="24">
          <h3>
            Cite this dataset
          </h3>
          <div
            v-loading="citationLoading"
            class="info-citation"
            aria-live="polite"
            v-html="citationText"
          />
          "$sanitize(citationText, ['i'])"
          <div class="info-citation-links mb-24">
            Formatted as:
            <button
              title="Format citation apa"
              :class="{ active: activeCitation === 'apa' }"
              @click="handleCitationChanged('apa')"
            >
              APA
            </button>
            <button
              title="Format citation chicago"
              :class="{
                active: activeCitation === 'chicago-note-bibliography'
              }"
              @click="handleCitationChanged('chicago-note-bibliography')"
            >
              Chicago
            </button>
            <button
              title="Format citation ieee"
              :class="{ active: activeCitation === 'ieee' }"
              @click="handleCitationChanged('ieee')"
            >
              IEEE
            </button>
            <a
              :href="`https://crosscite.org/?doi=${datasetDetails.doi}`"
              target="_blank"
            >
              More on Crosscite.org
            </a>
          </div>
        </el-col>
      </el-row> -->
      <div class="dataset-about-info__container--citation">
        Citation goes here
      </div>
      <h3>Tags</h3>
      <tag-list :tags="datasetTags" />
    </div>
  </div>
</template>

<script>
import TagList from '@/components/TagList/TagList.vue'
export default {
  name: 'DatasetAboutInfo',

  components: {
    TagList
  },
  props: {
    updatedDate: {
      type: String,
      default: ''
    },

    doi: {
      type: String,
      default: ''
    },

    datasetRecords: {
      type: Array,
      default: () => []
    },

    datasetTags: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      citationLoading: false,
      citationText: ''
    }
  },

  methods: {
    /**
     * gets bibiolography based on citation type for current DOI
     * @param {String} citationType
     */
    handleCitationChanged: function(citationType) {
      if (citationType === this.activeCitation) {
        return
      }
      this.citationLoading = true
      this.activeCitation = citationType
      // find all citation types at https://github.com/citation-style-language/style
      const doi = propOr('', 'doi', this.datasetDetails)
      const url = `${this.crosscite_host}/format?doi=${doi}&style=${citationType}&lang=en-US`
      return fetch(url)
        .then(response => {
          return response.text()
        })
        .then(text => {
          this.citationText = text
        })
        .finally(() => {
          this.citationLoading = false
        })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.dataset-about-info {
  &__container {
    h3 {
      font-size: 0.875em;
      font-weight: 500;
      line-height: 1em;
      color: black;
    }

    p {
      font-size: 0.875em;
      font-weight: normal;
      line-height: 24px;
      color: black;
    }

    &--citation {
      height: 6.5rem;
      background: $washed-gray;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-bottom: 1.5rem;
    }

    &--protocol-text {
      color: black;
      text-decoration: none;
      font-size: 0.875em;
      line-height: 24px;
      margin-bottom: 1.5rem;
      font-weight: normal;
    }
  }
}
</style>
