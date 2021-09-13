<template>
  <facet-menu
    :selected-facets="selectedFacet"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-radio-button-category
      :label="'News/Event Type'"
      :options="options"
      :default-selected-option="selectedNewsAndEventTypeLabel"
      @selection-changed="selectedTypeChanged"
    />
  </facet-menu>
</template>

<script>
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonCategory from './FacetRadioButtonCategory.vue'

const options = [
  {
    label: 'news',
    id: 'news'
  },
  {
    label: 'events',
    id: 'event'
  }
]

export default {
  name: 'SparcInfoFacetMenu',

  components: {
    FacetMenu,
    FacetRadioButtonCategory
  },

  props: {},

  data() {
    return {
      options: options,
      newsAndEventsType: options[0].id,
    }
  },

  computed: {
    selectedNewsAndEventTypeLabel: function() {
      var selectedOption = this.options.find(
        option => this.newsAndEventsType === option.id
      )
      return selectedOption === undefined
        ? options[0].label
        : selectedOption.label
    },
    selectedFacet: function() {
      return []
    }
  },

  watch: {},

  mounted() {
    if (this.$route.query.newsAndEventsType) {
      this.newsAndEventsType = this.$route.query.newsAndEventsType
    }
  },

  methods: {
    selectedTypeChanged(newValue) {
      if (this.newsAndEventsType === newValue) {
        return
      }
      this.newsAndEventsType = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, newsAndEventsType: newValue }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    getSelectedType() {
      return this.newsAndEventsType
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
          }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    deselectFacet() {
      if (this.newsAndEventsType === this.options[0].id) {
        this.$refs.publicationCategory.reset()
      } else if (this.newsAndEventsType === options[1].id) {
        this.$refs.eventCategory.reset()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
.white-background {
  background-color: white;
  border: 0.1rem solid #e4e7ed;
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
}

.title {
  margin-bottom: 0;
  padding: 0.5rem 1rem;
  font-weight: 300;
}

hr {
  border: none;
  border-bottom: 1px solid #dbdfe6;
  margin: 0;
}
</style>
