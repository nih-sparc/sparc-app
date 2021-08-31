<template>
  <facet-menu
    :selectedFacets="selectedFacetArray"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-radio-button-category
			:label="label"
			:options="options"
			:selectedOption="selectedRadioOption"
			@selection-changed="selectedTypeChanged"
		/>
  </facet-menu>
</template>

<script>
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonCategory from './FacetRadioButtonCategory.vue'

const label = "News/Event Type"
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

  components: { TagsContainer, FacetMenu, FacetRadioButtonCategory },

	computed: {
		selectedRadioOption: function() {
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
			label: label
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

