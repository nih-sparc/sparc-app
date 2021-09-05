<template>
  <facet-menu
    :selectedFacets="selectedFacet"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-radio-button-category
			:label='"News/Event Type"'
			:options="options"
			:defaultSelectedOption="selectedNewsAndEventType"
			@selection-changed="selectedTypeChanged"
		/>
		<facet-radio-button-date-category 
			:label='"Publication Date"'
			:enabled="selectedNewsAndEventType === options[0].label"
			:defaultSelectedOption="publicationDateOption"
			:defaultSelectedMonth="publicationMonth"
			:defaultSelectedYear="publicationYear"
			@selected-date-option-changed="publicationDateOptionChanged"
			@selected-month-changed="publicationMonthChanged"
			@selected-year-changed="publicationYearChanged"
		/>
		<facet-radio-button-date-category 
			:label='"Event Date"'
			:enabled="selectedNewsAndEventType === options[1].label"
			:defaultSelectedOption="eventDateOption"
			:defaultSelectedMonth="eventMonth"
			:defaultSelectedYear="eventYear"
			@selected-date-option-changed="eventDateOptionChanged"
			@selected-month-changed="eventMonthChanged"
			@selected-year-changed="eventYearChanged"
		/>
  </facet-menu>
</template>

<script>
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonCategory from './FacetRadioButtonCategory.vue'
import FacetRadioButtonDateCategory from './FacetRadioButtonDateCategory.vue'

const options = [{
		label:"news", 
		id:"news"
	}, 
	{
		label:"events", 
		id:"event"
	}]

export default {
  name: 'NewsAndEventsFacetMenu',

  components: { TagsContainer, FacetMenu, FacetRadioButtonCategory, FacetRadioButtonDateCategory },

	computed: {
		selectedNewsAndEventType: function() {
			var selectedOption = this.options.find(option => this.newsAndEventsType === option.id);
			return selectedOption === undefined ? options[0].label : selectedOption.label;
		},
		selectedFacet: function() {
			var facet = {
				label: "",
				id: ""
			}
			if (this.newsAndEventsType === this.options[0].id) {
				if (this.publicationDateOption === 'show all'){
					return []
				}
				facet.label = `${this.publicationDateOption} ${this.publicationMonth} ${this.publicationYear}`
			} else if (this.newsAndEventsType === options[1].id) {
				if (this.eventDateOption === 'show all'){
					return []
				}
				facet.label = `${this.eventDateOption} ${this.eventMonth} ${this.eventYear}`
			}
			facet.id = this.newsAndEventsType
			return [facet];
		}
	},

  props: {},

  data() {
    return {
			options: options,
			newsAndEventsType: options[0].id,
			publicationDateOption: 'show all',
			eventDateOption: 'show all',
			publicationMonth: 'Mar',
			publicationYear: 2020,
			eventMonth: 'Mar',
			eventYear: 2020,
    }
  },

	watch: {
		
  },

	mounted() {
		if (this.$route.query.newsAndEventsType) {
      this.newsAndEventsType = this.$route.query.newsAndEventsType
    } else {
			this.$router.replace({
        query: { ...this.$route.query, newsAndEventsType: this.newsAndEventsType }
      })
		}
		if (this.$route.query.publicationDateOption) {
      this.publicationDateOption = this.$route.query.publicationDateOption
    } else {
			this.$router.replace({
        query: { ...this.$route.query, publicationDateOption: this.publicationDateOption }
      })
		}
		if (this.$route.query.publicationMonth) {
      this.publicationMonth = this.$route.query.publicationMonth
    } else {
			this.$router.replace({
        query: { ...this.$route.query, publicationMonth: this.publicationMonth }
      })
		}
		if (this.$route.query.publicationYear) {
      this.publicationYear = Number(this.$route.query.publicationYear)
    } else {
			this.$router.replace({
        query: { ...this.$route.query, publicationYear: this.publicationYear }
      })
		}
		if (this.$route.query.eventDateOption) {
      this.eventDateOption = this.$route.query.eventDateOption
    } else {
			this.$router.replace({
        query: { ...this.$route.query, eventDateOption: this.eventDateOption }
      })
		}
		if (this.$route.query.eventMonth) {
      this.eventMonth = this.$route.query.eventMonth
    } else {
			this.$router.replace({
        query: { ...this.$route.query, eventMonth: this.eventMonth }
      })
		}
		if (this.$route.query.eventYear) {
      this.eventYear = Number(this.$route.query.eventYear)
    } else {
			this.$router.replace({
        query: { ...this.$route.query, eventYear: this.eventYear }
      })
		}
	},

  methods: {
    selectedTypeChanged(newValue){
			this.newsAndEventsType = newValue
			this.$router.replace({
        	query: { ...this.$route.query, newsAndEventsType: newValue }
      	}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}
			)	
		},
		publicationDateOptionChanged(newValue) {
			this.publicationDateOption = newValue
			this.$router.replace({
					query: { ...this.$route.query, publicationDateOption: newValue }
				}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}, (error) => {
					console.log(error);
				}
			)
		},
		publicationMonthChanged(newValue) {
			this.publicationMonth = newValue
			this.$router.replace({
					query: { ...this.$route.query, publicationMonth: newValue }
				}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}, (error) => {
					console.log(error);
				}
			)
		},
		publicationYearChanged(newValue) {
			this.publicationYear = newValue
			this.$router.replace({
					query: { ...this.$route.query, publicationYear: newValue }
				}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}
			)
		},
		eventDateOptionChanged(newValue) {
			this.eventDateOption = newValue
			this.$router.replace({
					query: { ...this.$route.query, eventDateOption: newValue }
				}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}
			)
		},
		eventMonthChanged(newValue) {
			this.eventMonth = newValue
			this.$router.replace({
					query: { ...this.$route.query, eventMonth: newValue }
				}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}
			)
		},
		eventYearChanged(newValue) {
			this.eventYear = newValue
			this.$router.replace({
					query: { ...this.$route.query, eventYear: newValue }
				}, () => { 
					this.$emit('news-and-events-selections-changed', newValue)
				}
			)
		},
    deselectAllFacets() {
			this.publicationDateOption = 'show all'
			this.eventDateOption = 'show all'
    },
    deselectFacet() {
			if (this.newsAndEventsType === this.options[0].id) {
				this.publicationDateOption = 'show all'
			} else if (this.newsAndEventsType === options[1].id) {
				this.eventDateOption = 'show all'
			}
    }
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
	.white-background {
		background-color: white;
    border: 0.1rem solid #e4e7ed
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.2;
	}

	.title {
		margin-bottom: 0;
		padding: 0.5rem 1rem;
    font-weight: 300

	}

	hr {
		border: none;
		border-bottom: 1px solid #dbdfe6;
		margin: 0;
	}
  
</style>

