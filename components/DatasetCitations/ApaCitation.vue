<template>
  <div>
    {{authorCitations}} ({{year}}) {{title}}. <em>{{publisher}}</em>. <a :href="url" target="_blank">{{url}}</a>
  </div>
</template>

<script>

import { propOr } from 'ramda'

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
      lastNameStartIndex = lastNameStartIndex === -1 ? 0 : lastNameStartIndex
      const lastName = familyName.substring(lastNameStartIndex)
      return isLast ? `and ${lastName}, ${firstName.charAt(0)}. ` : `${lastName}, ${firstName.charAt(0)}., `
    },
    /**
     * Get the Title from doi.org
     */
    getCitationInfo() {
      console.log("Publication = ", this.publication)
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
        })
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
