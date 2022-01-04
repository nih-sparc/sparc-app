<template>
  <div class="external-publication-list-item">
    <u>
      <a
        class="dataset-about-info__container--doi-link mb-16"
        :href="linkFromDoi(publication.doi)"
        target="_blank"
      >
        {{ title }}
      </a>
    </u>
    <span v-if="showDescription">: {{description}}</span>
  </div>
</template>

<script>
export default {
  name: 'ExternalPublicationListItem',

  props: {
    publication: {
      type: Object,
      default: () => {
        return {
          doi: ''
        }
      }
    },
    showDescription: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      title: '',
      description: ''
    }
  },

  created() {
    this.getInfo()
  },

  methods: {
    /**
     * Get the Title from doi.org
     */
    getInfo() {
      fetch(this.linkFromDoi(this.publication.doi), {
        method: 'GET',
        headers: { Accept: 'application/json'}
      })
        .then(response => response.json())
        .then(json => {
          this.title = json.title
          this.description = json.description
          this.loading = false
        })
    },

    linkFromDoi(doi){
      return `https://doi.org/${doi}`
    }
  }
}
</script>
