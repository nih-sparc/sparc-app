<template>
  <div>
    <facet-menu
      :selected-facets="selectedFacet"
      :visible-facet-categories="visibleCategories"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    >
      <facet-radio-button-date-category
        ref="publicationCategory"
        label="Publication Date"
        enabled
        :default-selected-option="publicationDateOption"
        :default-selected-month="publicationMonth"
        :default-selected-year="publicationYear"
        @selected-date-option-changed="publicationDateOptionChanged"
        @selected-month-changed="publicationMonthChanged"
        @selected-year-changed="publicationYearChanged"
      />
    </facet-menu>
  </div>
</template>

<script>
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonDateCategory from './FacetRadioButtonDateCategory.vue'

const newsEventsTypeOptions = [
  {
    label: 'news',
    id: 'news',
    sortOrder: '-fields.publishedDate'
  },
  {
    label: 'events',
    id: 'event',
    sortOrder: '-fields.startDate'
  },
  {
    label: 'community spotlight',
    id: 'successStoryDisplay',
    sortOrder: '-fields.storyTitle'
  }
]

const visibleCategories = ['news']

const PUBLICATION_DATE_FACET_ID = 'publication date'

export default {
  name: 'NewsFacetMenu',

  components: {
    FacetMenu,
    FacetRadioButtonDateCategory
  },

  props: {},

  data() {
    return {
      publicationDateOption: 'show all',
      publicationMonth: 'Mar',
      publicationYear: 2020,
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedFacet: function() {
      let facets = []
      if (this.publicationDateOption !== 'show all') {
        facets.push({
          label: `${this.publicationDateOption} ${this.publicationMonth} ${this.publicationYear}`,
          id: PUBLICATION_DATE_FACET_ID,
          facetPropPath: 'news'
        })
      }
      return facets
    }
  },

  mounted() {
    if (this.$route.query.publicationDateOption) {
      this.publicationDateOption = this.$route.query.publicationDateOption
    }
    if (this.$route.query.publicationMonth) {
      this.publicationMonth = this.$route.query.publicationMonth
    }
    if (this.$route.query.publicationYear) {
      this.publicationYear = Number(this.$route.query.publicationYear)
    }
  },

  methods: {
    publicationDateOptionChanged(newValue) {
      if (this.publicationDateOption === newValue) {
        return
      }
      this.publicationDateOption = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, publicationDateOption: newValue }
        },
        () => {
          this.$emit('news-selections-changed')
        }
      )
    },
    publicationMonthChanged(newValue) {
      if (this.publicationMonth === newValue) {
        return
      }
      this.publicationMonth = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, publicationMonth: newValue }
        },
        () => {
          this.$emit('news-selections-changed')
        }
      )
    },
    publicationYearChanged(newValue) {
      if (this.publicationYear === newValue) {
        return
      }
      this.publicationYear = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, publicationYear: newValue }
        },
        () => {
          this.$emit('news-selections-changed')
        }
      )
    },
    getPublishedLessThanDate() {
      return this.$refs.publicationCategory.getLessThanDate()
    },
    getPublishedGreaterThanOrEqualToDate() {
      return this.$refs.publicationCategory.getGreaterThanOrEqualToDate()
    },
    getSortOrder() {
      return newsEventsTypeOptions.find(option => {
        return option.id === this.newsAndEventsType
      }).sortOrder
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            publicationDateOption: undefined,
          }
        },
        () => {
          this.$emit('news-selections-changed')
          this.$refs.publicationCategory.reset()
        }
      )
    },
    deselectFacet(facetId) {
      if (facetId === PUBLICATION_DATE_FACET_ID) {
        this.$refs.publicationCategory.reset()
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

hr {
  border: none;
  border-bottom: 1px solid #dbdfe6;
  margin: 0;
}
</style>
