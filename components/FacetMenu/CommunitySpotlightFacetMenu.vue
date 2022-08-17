<template>
  <div>
    <facet-menu
      class="community-spotlight-facet-menu"
      :selected-facets="selectedFacet"
      :visible-facet-categories="visibleCategories"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <dropdown-multiselect
      ref="spotlightTypeCategory"
      collapse-by-default
      :category="spotlightTypeOptions"
      enabled
      :default-checked-ids="selectedSpotlightTypeOptions"
      @selection-change="selectedSpotlightTypeOptionsChanged"
    />
  </div>
</template>

<script>
import { pluck } from 'ramda'
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonDateCategory from './FacetRadioButtonDateCategory.vue'

const spotlightTypeOptions = {
  label: 'Spotlight Type',
  id: 'spotlight type',
  data: [
    {
      label: 'Fireside Chat',
      id: 'firesideChat',
    },
    {
      label: 'Success Story',
      id: 'successStory',
    }
  ]
}

const visibleCategories = ['spotlightType']

export default {
  name: 'CommunitySpotlightFacetMenu',

  components: {
    FacetMenu,
    FacetRadioButtonDateCategory
  },

  data() {
    return {
      spotlightTypeOptions,
      spotlightTypeOptions: spotlightTypeOptions,
      selectedSpotlightTypeOptions: [],
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedFacet: function() {
      let facets = []
      if (this.selectedSpotlightTypeOptions !== []) {
        this.selectedSpotlightTypeOptions.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: 'spotlightType'
          })
        })
      }
      return facets
    }
  },

  mounted() {
    if (this.$route.query.selectedSpotlightTypeOptions) {
      this.selectedSpotlightTypeOptions = this.$route.query.selectedSpotlightTypeOptions.split(",")
    }
  },

  methods: {
    selectedSpotlightTypeOptionsChanged(newValue) {
      this.selectedSpotlightTypeOptions = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, selectedSpotlightTypeOptions: this.selectedSpotlightTypeOptions.length === 0 ? undefined : pluck('id', this.selectedSpotlightTypeOptions).toString() }
        },
        () => {
          this.$emit('community-spotlight-selections-changed')
        }
      )
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            selectedSpotlightTypeOptions: undefined
          }
        },
        () => {
          this.$emit('community-spotlight-selections-changed')
          this.$refs.spotlightTypeCategory.uncheckAll()
        }
      )
    },
    deselectFacet(facetId) {
      this.$refs.spotlightTypeCategory.uncheck(facetId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';
.white-background {
  background-color: white;
  border: 0.1rem solid $lineColor2;
}

hr {
  border: none;
  border-bottom: 1px solid $lineColor1;
  margin: 0;
}

.community-spotlight-facet-menu {
  // hacky fix to address placing the design system drop down for the event type category outside the facet menu since it handles its own borders
  border-bottom: none;
}
</style>
