<template>
  <div class="dataset-about-info">
    <div class="dataset-about-info__container">
      <h3>Last Updated</h3>
      <p>{{ updatedDate }}</p>
      <h3>Dataset DOI</h3>
      <p>{{ doi }}</p>
      <el-row type="flex" justify="center" class="protocol-block">
        <el-col :span="24">
          <h3>
            Protocol Links
          </h3>
          <div v-if="datasetRecords.length !== 0">
            <a
              v-for="(record, index) in datasetRecords"
              :key="`${record}-${index}`"
              :href="record.properties.url"
              target="_blank"
              class="dataset-about-info__container--protocol-text"
            >
              {{ record.properties.url }}
            </a>
          </div>
          <div v-else class="dataset-about-info__container--protocol-text-na">
            <p>N/A</p>
          </div>
        </el-col>
      </el-row>
      <h3>NIH Award</h3>
      <p>{{ getSparcAwardNumber }}</p>
      <h3>Cite This Dataset</h3>
      <div class="dataset-about-info__container--citation">
        <el-row type="flex" justify="center">
          <el-col :span="24">
            <div
              v-loading="citationLoading"
              class="info-citation"
              aria-live="polite"
              v-html="citationText"
            />
            <div class="dataset-about-info__container--citation-links mb-24">
              Formatted as:
              <a
                title="Format citation apa"
                :class="{ 'active-citation': activeCitation === 'apa' }"
                @click="handleCitationChanged('apa')"
              >
                APA
              </a>
              |
              <a
                title="Format citation chicago"
                :class="{
                  'active-citation':
                    activeCitation === 'chicago-note-bibliography'
                }"
                @click="handleCitationChanged('chicago-note-bibliography')"
              >
                Chicago
              </a>
              |
              <a
                title="Format citation ieee"
                :class="{ 'active-citation': activeCitation === 'ieee' }"
                @click="handleCitationChanged('ieee')"
              >
                IEEE
              </a>
              |
              <a
                :href="`https://citation.crosscite.org/?doi=${doiValue}`"
                target="_blank"
              >
                More on Crosscite.org
              </a>
            </div>
          </el-col>
        </el-row>
      </div>
      <h3>Tags</h3>
      <div v-if="datasetTags.length !== 0">
        <tag-list :tags="datasetTags" />
      </div>
      <div v-else>
        <p>N/A</p>
      </div>
    </div>
  </div>
</template>

<script>
import { compose, propOr, head } from 'ramda'

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

    doiValue: {
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
      citationText: '',
      activeCitation: '',
      crosscite_host: process.env.crosscite_api_host,
      sparcAwardNumber: ''
    }
  },

  computed: {
    /**
     * Gets the sparc award number
     * @return {String}
     */
    getSparcAwardNumber: function() {
      return this.sparcAwardNumber !== '' ? this.sparcAwardNumber : 'N/A'
    },

    /**
     * Return DOI link
     * @returns {String}
     */
    DOIlink: function() {
      return this.doiValue ? `https://doi.org/${this.doiValue}` : ''
    },

    /**
     * Url to get records for model
     * @returns {String}
     */
    getRecordsUrl: function() {
      return `${process.env.discover_api_host}/search/records?datasetId=${this.$route.params.datasetId}`
    }
  },

  watch: {
    DOIlink: {
      handler: function(val) {
        if (val) {
          this.handleCitationChanged('apa')
        }
      },
      immediate: true
    },

    getRecordsUrl: {
      handler: function(val) {
        if (val) {
          this.getDatasetRecords()
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * Retrievs the metadata records for a dataset to get the sparc award number
     */
    getDatasetRecords: async function() {
      try {
        const summary = await this.$axios
          .$get(`${this.getRecordsUrl}&model=summary`)
          .catch(
            // handle error
            (this.errorLoading = true)
          )
        const award = await this.$axios
          .$get(`${this.getRecordsUrl}&model=award`)
          .catch(
            // handle error
            (this.errorLoading = true)
          )

        const summaryId = compose(
          propOr('', 'hasAwardNumber'),
          propOr([], 'properties'),
          head,
          propOr([], 'records')
        )(summary)

        const awardId = compose(
          propOr('', 'award_id'),
          propOr([], 'properties'),
          head,
          propOr([], 'records')
        )(award)

        this.sparcAwardNumber = summaryId || awardId
      } catch (e) {
        console.error(e)
      }
    },

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
      const url = `${this.crosscite_host}/format?doi=${this.doiValue}&style=${citationType}&lang=en-US`
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
  }
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

    .info-citation {
      font-size: 14px;
      font-weight: normal;
      line-height: 24px;
      color: black;
      margin-top: 1rem;
    }

    &--citation-links {
      font-weight: bold;
      font-size: 14px;
      margin-top: 1rem;
      a {
        text-decoration: none;
        color: $median;
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        cursor: pointer;
        &.active-citation {
          color: black;
          text-decoration: underline;
        }
      }
    }

    &--protocol-text {
      color: black;
      text-decoration: none;
      font-size: 0.875em;
      line-height: 24px;
      font-weight: normal;
    }

    &--protocol-text-na {
      p {
        margin-bottom: 0;
      }
    }

    .protocol-block {
      margin-bottom: 1rem;
    }
  }
}
@media screen and (max-width: 768px) {
  .dataset-about-info {
    &__container {
      &--citation {
        height: 100%;
      }
    }
  }
}
</style>
