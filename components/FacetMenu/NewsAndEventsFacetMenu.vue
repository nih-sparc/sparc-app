<template>
  <div>
    <facet-menu
      class="news-and-event-facet-menu"
      :selected-facets="selectedFacet"
      :visible-facet-categories="visibleCategories"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    >
      <facet-radio-button-category
        label="News/Event Type"
        :options="newsEventsTypeOptions"
        :default-selected-option="selectedNewsAndEventTypeLabel"
        @selection-changed="selectedTypeChanged"
      />
      <facet-radio-button-date-category
        ref="publicationCategory"
        label="Publication Date"
        :enabled="selectedNewsAndEventTypeLabel === newsEventsTypeOptions[0].label"
        :default-selected-option="publicationDateOption"
        :default-selected-month="publicationMonth"
        :default-selected-year="publicationYear"
        @selected-date-option-changed="publicationDateOptionChanged"
        @selected-month-changed="publicationMonthChanged"
        @selected-year-changed="publicationYearChanged"
      />
      <facet-radio-button-date-category
        ref="eventCategory"
        label="Event Date"
        :enabled="selectedNewsAndEventTypeLabel === newsEventsTypeOptions[1].label"
        :default-selected-option="eventDateOption"
        :default-selected-month="eventMonth"
        :default-selected-year="eventYear"
        @selected-date-option-changed="eventDateOptionChanged"
        @selected-month-changed="eventMonthChanged"
        @selected-year-changed="eventYearChanged"
      />
    </facet-menu>
    <dropdown-multiselect
      ref="eventTypeCategory"
      collapse-by-default
      :category="eventTypeOptions"
      :enabled="selectedNewsAndEventTypeLabel === newsEventsTypeOptions[1].label"
      :default-checked-ids="selectedEventTypeOptions"
      @selection-change="selectedEventTypeOptionsChanged"
    />
  </div>
</template>

<script>
import { pluck } from 'ramda'
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonCategory from './FacetRadioButtonCategory.vue'
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

const eventTypeOptions = {
  label: 'Event Type',
  id: 'event type',
  data: [
    {
      label: 'Cancelled',
      id: 'Cancelled',
    },
    {
      label: 'Conference',
      id: 'Conference',
    },
    {
      label: 'Funding',
      id: 'Funding',
    },
    {
      label: 'Other Event',
      id: 'Other Event',
    },
    {
      label: 'Postponed',
      id: 'Postponed',
    },{
      label: 'Virtual Conference',
      id: 'Virtual Conference',
    },
    {
      label: 'Webinar',
      id: 'Webinar',
    },
    {
      label: 'Workshop',
      id: 'Workshop',
    }
  ]
}

const visibleCategories = ['newsAndEvents']

const EVENT_DATE_FACET_ID = 'event date'
const PUBLICATION_DATE_FACET_ID = 'publication date'

export default {
  name: 'NewsAndEventsFacetMenu',

  components: {
    FacetMenu,
    FacetRadioButtonCategory,
    FacetRadioButtonDateCategory
  },

  data() {
    return {
      newsEventsTypeOptions: newsEventsTypeOptions,
      newsAndEventsType: newsEventsTypeOptions[0].id,
      eventTypeOptions: eventTypeOptions,
      selectedEventTypeOptions: [],
      publicationDateOption: 'show all',
      eventDateOption: 'show all',
      eventTypeOption: 'show all',
      publicationMonth: 'Mar',
      publicationYear: 2020,
      eventMonth: 'Mar',
      eventYear: 2020,
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedNewsAndEventTypeLabel: function() {
      var selectedOption = this.newsEventsTypeOptions.find(
        option => this.newsAndEventsType === option.id
      )
      return selectedOption === undefined
        ? newsEventsTypeOptions[0].label
        : selectedOption.label
    },
    selectedFacet: function() {
      let facets = []
      if (this.newsAndEventsType === this.newsEventsTypeOptions[0].id) {
        if (this.publicationDateOption !== 'show all') {
          facets.push({
            label: `${this.publicationDateOption} ${this.publicationMonth} ${this.publicationYear}`,
            id: PUBLICATION_DATE_FACET_ID,
            facetPropPath: 'newsAndEvents'
          })
        }
      } else if (this.newsAndEventsType === newsEventsTypeOptions[1].id) {
        if (this.eventDateOption !== 'show all') {
          facets.push({
            label: `${this.eventDateOption} ${this.eventMonth} ${this.eventYear}`,
            id: EVENT_DATE_FACET_ID,
            facetPropPath: 'newsAndEvents'
          })
        }
        if (this.selectedEventTypeOptions !== []) {
          this.selectedEventTypeOptions.forEach(selectedOption => {
            facets.push({
              label: `${selectedOption.label}`,
              id: `${selectedOption.id}`,
              facetPropPath: 'newsAndEvents'
            })
          })
        }
      }
      return facets
    }
  },

  mounted() {
    if (this.$route.query.newsAndEventsType) {
      this.newsAndEventsType = this.$route.query.newsAndEventsType
    }
    if (this.$route.query.selectedEventTypeOptions) {
      this.selectedEventTypeOptions = this.$route.query.selectedEventTypeOptions.split(",")
    }
    if (this.$route.query.publicationDateOption) {
      this.publicationDateOption = this.$route.query.publicationDateOption
    }
    if (this.$route.query.publicationMonth) {
      this.publicationMonth = this.$route.query.publicationMonth
    }
    if (this.$route.query.publicationYear) {
      this.publicationYear = Number(this.$route.query.publicationYear)
    }
    if (this.$route.query.eventDateOption) {
      this.eventDateOption = this.$route.query.eventDateOption
    }
    if (this.$route.query.eventMonth) {
      this.eventMonth = this.$route.query.eventMonth
    }
    if (this.$route.query.eventYear) {
      this.eventYear = Number(this.$route.query.eventYear)
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
          this.$emit('news-and-events-selections-changed')
        }
      )
    },
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
          this.$emit('news-and-events-selections-changed')
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
          this.$emit('news-and-events-selections-changed')
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
          this.$emit('news-and-events-selections-changed')
        }
      )
    },
    selectedEventTypeOptionsChanged(newValue) {
      this.selectedEventTypeOptions = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, selectedEventTypeOptions: this.selectedEventTypeOptions.length === 0 ? undefined : pluck('id', this.selectedEventTypeOptions).toString() }
        },
        () => {
          this.$emit('news-and-events-selections-changed')
        }
      )
    },
    eventDateOptionChanged(newValue) {
      if (this.eventDateOption === newValue) {
        return
      }
      this.eventDateOption = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, eventDateOption: newValue }
        },
        () => {
          this.$emit('news-and-events-selections-changed')
        }
      )
    },
    eventMonthChanged(newValue) {
      if (this.eventMonth === newValue) {
        return
      }
      this.eventMonth = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, eventMonth: newValue }
        },
        () => {
          this.$emit('news-and-events-selections-changed')
        }
      )
    },
    eventYearChanged(newValue) {
      if (this.eventYear === newValue) {
        return
      }
      this.eventYear = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, eventYear: newValue }
        },
        () => {
          this.$emit('news-and-events-selections-changed')
        }
      )
    },
    getPublishedLessThanDate() {
      return this.selectedNewsAndEventTypeLabel === this.newsEventsTypeOptions[0].label
        ? this.$refs.publicationCategory.getLessThanDate()
        : undefined
    },
    getEventsLessThanDate() {
      return this.selectedNewsAndEventTypeLabel === this.newsEventsTypeOptions[1].label
        ? this.$refs.eventCategory.getLessThanDate()
        : undefined
    },
    getPublishedGreaterThanOrEqualToDate() {
      return this.selectedNewsAndEventTypeLabel === this.newsEventsTypeOptions[0].label
        ? this.$refs.publicationCategory.getGreaterThanOrEqualToDate()
        : undefined
    },
    getEventsGreaterThanOrEqualToDate() {
      return this.selectedNewsAndEventTypeLabel === this.newsEventsTypeOptions[1].label
        ? this.$refs.eventCategory.getGreaterThanOrEqualToDate()
        : undefined
    },
    getSelectedType() {
      return this.newsAndEventsType
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
            eventDateOption: undefined,
            selectedEventTypeOptions: undefined
          }
        },
        () => {
          this.$emit('news-and-events-selections-changed')
          this.$refs.publicationCategory.reset()
          this.$refs.eventCategory.reset()
          this.$refs.eventTypeCategory.uncheckAll()
        }
      )
    },
    deselectFacet(facetId) {
      if (this.newsAndEventsType === this.newsEventsTypeOptions[0].id) {
        if (facetId === PUBLICATION_DATE_FACET_ID) {
          this.$refs.publicationCategory.reset()
        }
      } else if (this.newsAndEventsType === newsEventsTypeOptions[1].id) {
        if (facetId === EVENT_DATE_FACET_ID) {
          this.$refs.eventCategory.reset()
        }
        else {
          this.$refs.eventTypeCategory.uncheck(facetId)
        }
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
.news-and-event-facet-menu {
  // hacky fix to address placing the design system drop down for the event type category outside the facet menu since it handles its own borders
  border-bottom: none;
}
</style>
