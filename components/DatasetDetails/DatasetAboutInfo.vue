<template>
  <div class="dataset-about-info">
    <div class="dataset-about-info__container">
      <h3>Last Updated</h3>
      <p>{{ updatedDate }}</p>
      <h3>Dataset DOI</h3>
      <p>
        <a
          class="dataset-about-info__container--doi-link mb-16"
          :href="DOIlink"
          target="_blank"
        >
          {{ doi }}
        </a>
      </p>
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
      <p>
        Publication Date: {{ updatedDate }}<br />
        Platform:
        <a href="https://discover.blackfynn.com/" target="_blank">
          Blackfynn Discover
        </a>
      </p>
      <div class="dataset-about-info__container--citation">
        <el-row type="flex" justify="center">
          <el-col :span="24">
            <ul class="dataset-about-info__container--citation-links">
              <li
                v-for="citationType in citationTypes"
                :key="citationType.type"
              >
                <a
                  :title="citationTypeTitle(citationType)"
                  :class="{
                    'active-citation': activeCitation.type === citationType.type
                  }"
                  @click="handleCitationChanged(citationType)"
                >
                  {{ citationType.label }}</a>
                |
              </li>
              <li>
                <a
                  :href="`https://citation.crosscite.org/?doi=${doiValue}`"
                  target="_blank"
                >
                  More on Crosscite.org
                </a>
              </li>
            </ul>
            <div
              v-loading="citationLoading"
              class="info-citation"
              aria-live="polite"
              v-html="citationText"
            />
            <el-button
              class="copy-button"
              size="small"
              @click="handleCitationCopy"
            >
              Copy Citation
            </el-button>
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
      sparcAwardNumber: '',
      citationTypes: [
        {
          type: 'apa',
          label: 'APA'
        },
        {
          type: 'chicago-note-bibliography',
          label: 'Chicago'
        },
        {
          type: 'ieee',
          label: 'IEEE'
        },
        {
          type: 'bibtex',
          label: 'Bibtex'
        }
      ]
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
          const initialCitationType = this.citationTypes.filter(
            citationType => {
              return citationType.type == 'apa'
            }
          )[0]
          this.handleCitationChanged(initialCitationType)
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
      const url = `${this.crosscite_host}/format?doi=${this.doiValue}&style=${citationType.type}&lang=en-US`
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
    },

    /**
     * Handle copy citation to clipboard
     */
    handleCitationCopy: function() {
      this.$copyText(this.citationText).then(() => {
        this.$message.success(
          `${this.activeCitation.label} citation copied to clipboard.`
        )
      }),
        () => {
          this.$message.error('Failed to copy citation.')
        }
    },

    /**
     * Title for citation type while hovering over link
     * @param {Object} citationType
     * @returns {String}
     */
    citationTypeTitle: function(citationType) {
      return `Format citation ${citationType.label}`
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
      height: 100%;
      background: $washed-gray;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-bottom: 1.5rem;
      .copy-button {
        border: 1px solid gray;
        color: gray;
        font-weight: normal;
        margin: 1.875rem 0 1rem 0;
      }
    }

    .info-citation {
      font-size: 14px;
      font-weight: normal;
      line-height: 24px;
      color: black;
      margin-top: 1rem;
    }

    &--citation-links {
      border-bottom: 1px solid black;
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      li {
        margin: 0 0.15rem;
        a {
          color: black;
          text-decoration: none;
          cursor: pointer;
          &.active-citation {
            color: $median;
            border-bottom: 1px solid $median;
            padding-bottom: 0.188rem;
          }
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

    &--doi-link {
      color: black;
      text-decoration: none;
    }
  }
}
</style>
