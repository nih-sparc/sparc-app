<template>
  <div class="citation-container py-16 pl-16 pr-24" v-loading="citationLoading">
    <button class="copy-button" @click="handleCitationCopy">
      <img src="../../static/images/copyIcon.png" />
    </button>
    <div>
      {{authorCitations}} ({{year}}) {{title}}. 
      <em v-if="publisher.length > 0">{{publisher}}. </em>
      <a :href="url" target="_blank">{{url}}</a>
    </div>
  </div>
</template>

<script>
import { propOr } from 'ramda'
import { successMessage, failMessage } from '@/utils/notification-messages'

export default {
  name: 'ApaCitation',

  props : {
    doi: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      citationLoading: true,
      authors: [],
      title: "",
      publisher: "",
      year: 0,
      url: ""
    }
  },

  created() {
    this.getCitationInfo()
  },

  methods: {
    getAuthorName: function(author, isLast) {
      const firstName = propOr('', 'given', author)
      const familyName = propOr('', 'family', author)
      // Sometimes the middle initial is included as part of the family name. Remove it.
      let lastNameStartIndex = familyName.lastIndexOf(" ")
      lastNameStartIndex = lastNameStartIndex === -1 ? 0 : lastNameStartIndex + 1
      const lastName = familyName.substring(lastNameStartIndex)
      return isLast ? `and ${lastName}, ${firstName.charAt(0)}. ` : `${lastName}, ${firstName.charAt(0)}., `
    },
    /**
     * Get the Title from doi.org
     */
    getCitationInfo() {
      this.citationLoading = true
      fetch(this.doiLink, {
        method: 'GET',
        headers: { Accept: 'application/json'}
      })
        .then(response => response.json())
        .then(json => {
          this.title = json.title
          this.authors = json.author
          this.publisher = json["container-title"]
          this.year = json.published["date-parts"][0][0]
          this.url = json.URL
          this.citationLoading = false
        })
    },
    /**
     * Handle copy citation to clipboard
     */
    handleCitationCopy: function() {
      this.$copyText(this.citationText).then(() => {
        this.$message(
          successMessage(
            `Successfully copied citation.`
          )
        )
      }),
        () => {
          this.$message(failMessage('Failed to copy citation.'))
        }
    },
  },

  computed: {
    doiLink() {
      if (this.doi === "") {
        return undefined
      }
      return `https://doi.org/${this.doi}`
    },
    authorCitations() {
      let authorCitationText = ""
      let num = 0
      this.authors.forEach(author => {
        authorCitationText += this.getAuthorName(author, num === this.authors.length-1)
        num++
      })
      return authorCitationText
    },
    citationText() {
      return `${this.authorCitations} (${this.year}) ${this.title}. ${this.publisher.length > 0 ? this.publisher + "." : ""} ${this.url}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.citation-container {
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
</style>
