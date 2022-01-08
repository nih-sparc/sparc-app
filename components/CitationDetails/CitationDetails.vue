<template>
  <div class="citation-details">
    <div class="heading2 mb-8">
      Dataset Citation
    </div>
    <div v-for="citationType in citationTypes" :key="citationType.type">
      <div class="label4 mb-8">{{citationType.label}}</div>
      <div class="info-citation mb-16 py-16 pl-16 pr-24" v-if="!hasCitationError" v-loading="citationLoading">
        <button class="copy-button" @click="handleCitationCopy(citationType)">
          <img src="../../static/images/copyIcon.png" />
        </button>
        <div
          class="citation-text"
          aria-live="polite"
          v-html="citationType.citationText"
        />
      </div>
      <div class="info-citation mb-16 py-16 pl-16 pr-24" v-else>
        <span class="label4">Internal Server Error</span><br />
        Sorry, something went wrong.<br />
        The dataset citation generator (<a
          href="https://citation.crosscite.org/"
          target="_blank"
        >https://citation.crosscite.org/</a>) encountered an internal error and was unable to complete your
        request.<br />
        Please come back later.
      </div>
    </div>
    <p style="text-align: end">
      More citations avaialble at:
      <a
        :href="`https://citation.crosscite.org/?doi=${doiValue}`"
        target="_blank"
      >
        Crosscite.org
      </a>
    </p>
  </div>
</template>

<script>
import { successMessage, failMessage } from '@/utils/notification-messages'

export default {
  name: 'CitationDetails',
  props: {
    doiValue: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.getCitationText()
  },
  data() {
    return {
      citationLoading: false,
      crosscite_host: process.env.crosscite_api_host,
      hasCitationError: false,
      citationTypes: [
        {
          type: 'apa',
          label: 'APA',
          citationText: ''
        },
        {
          type: 'chicago-note-bibliography',
          label: 'Chicago',
          citationText: ''
        },
        {
          type: 'ieee',
          label: 'IEEE',
          citationText: ''
        },
        {
          type: 'bibtex',
          label: 'Bibtex',
          citationText: ''
        }
      ]
    }
  },
  methods: {
    /**
     * gets bibiolography based on citation type for current DOI
     * @param {String} citationType
     */
    getCitationText: function() {
      this.citationLoading = true
      this.hasCitationError = false
      // find all citation types at https://github.com/citation-style-language/style
      this.citationTypes.forEach(citationType => {
        const url = `${this.crosscite_host}/format?doi=${this.doiValue}&style=${citationType.type}&lang=en-US`
        fetch(url)
          .then(response => {
            if (response.status !== 200) {
              throw Error
            }
            return response.text()
          })
          .then(text => {
            citationType.citationText = text
          })
          .catch(() => {
            this.hasCitationError = true
          })
          .finally(() => {
            this.citationLoading = false
          })
      })
    },

    /**
     * Handle copy citation to clipboard
     */
    handleCitationCopy: function(citationType) {
      this.$copyText(citationType.citationText).then(() => {
        this.$message(
          successMessage(
            `${citationType.label} citation copied to clipboard.`
          )
        )
      }),
        () => {
          this.$message(failMessage('Failed to copy citation.'))
        }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.citation-details {
  a {
    text-decoration: underline;
  }
  .info-citation {
    background-color: $background;
    position: relative;
    .copy-button {
      border: none;
      background: transparent;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: .25rem;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .citation-text {
    word-wrap: break-word;
  }
}
</style>
