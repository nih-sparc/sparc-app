<template>
  <facet-menu
    :selectedFacets="selectedFacetArray"
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
		/>
		<facet-radio-button-date-category 
			:label='"Event Date"'
			:enabled="selectedNewsAndEventType === options[1].label"
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
		}
	},

  props: {
    newsAndEventsType: {
      type: String,
      default: options[0].id
    },
  },

  data() {
    return {
      selectedFacetArray: [],
			options: options,
    }
  },

  methods: {
    selectedTypeChanged(newValue){
			this.$emit('news-and-events-type-changed', newValue)
		},
    deselectAllFacets() {
    },
    deselectFacet(id) {
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

