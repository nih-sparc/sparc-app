<template>
  <div>
    <facet-menu
      class="remove-bottom-border"
      :selected-facets="selectedFacet"
      :visible-facet-categories="visibleCategories"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <dropdown-multiselect
      class="remove-bottom-border"
      ref="spotlightTypeCategory"
      collapse-by-default
      :category="spotlightTypes"
      enabled
      :default-checked-ids="selectedSpotlightTypes"
      @selection-change="selectedSpotlightTypesChanged"
    />
    <dropdown-multiselect
      ref="anatomicalStructuresCategory"
      collapse-by-default
      :category="anatomicalStructures"
      enabled
      :default-checked-ids="selectedAnatomicalStructures"
      @selection-change="selectedAnatomicalStructuresChanged"
    />
  </div>
</template>

<script>
import { pluck } from 'ramda'
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonDateCategory from './FacetRadioButtonDateCategory.vue'

const SPOTLIGHT_TYPE_OPTIONS = {
  label: 'Spotlight Type',
  id: 'spotlightType',
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

// Ideally we would pull these values from all the possible field values in Contentful, but there is no simple way to do that as shown here: https://www.contentfulcommunity.com/t/all-possible-values-of-the-field/3307.
// These values should be in sync with CommunitySpotlightItem's field 'Anatomical Structure' validation list
const ANATOMICAL_STRUCTURE_OPTIONS = {
  label: 'Anatomical Structure',
  id: 'spotlightAnatomicalStructure',
  data: [
    {
      label: 'Colon',
      id: 'Colon',
    },
    {
      label: 'Heart',
      id: 'Heart',
    },
    {
      label: 'Lung',
      id: 'Lung',
    },
    {
      label: 'Nerves & Ganglia',
      id: 'Nerves & Ganglia',
    },
    {
      label: 'Pancreas',
      id: 'Pancreas',
    },
    {
      label: 'Stomach',
      id: 'Stomach',
    },
    {
      label: 'Urinary System',
      id: 'Urinary System',
    }
  ]
}

const visibleCategories = ['spotlightType', 'spotlightAnatomicalStructure']

export default {
  name: 'CommunitySpotlightFacetMenu',

  components: {
    FacetMenu,
    FacetRadioButtonDateCategory
  },

  data() {
    return {
      spotlightTypes: SPOTLIGHT_TYPE_OPTIONS,
      anatomicalStructures: ANATOMICAL_STRUCTURE_OPTIONS,
      selectedAnatomicalStructures: [],
      selectedSpotlightTypes: [],
      visibleCategories: visibleCategories,
    }
  },

  computed: {
    selectedFacet: function() {
      let facets = []
      if (this.selectedAnatomicalStructures !== []) {
        this.selectedAnatomicalStructures.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: this.anatomicalStructures.id
          })
        })
      }
      if (this.selectedSpotlightTypes !== []) {
        this.selectedSpotlightTypes.forEach(selectedOption => {
          facets.push({
            label: `${selectedOption.label}`,
            id: `${selectedOption.id}`,
            facetPropPath: this.spotlightTypes.id
          })
        })
      }
      return facets
    }
  },

  mounted() {
    if (this.$route.query.selectedAnatomicalStructures) {
      this.selectedAnatomicalStructures = this.$route.query.selectedAnatomicalStructures.split(",")
    }
    if (this.$route.query.selectedSpotlightTypes) {
      this.selectedSpotlightTypes = this.$route.query.selectedSpotlightTypes.split(",")
    }
  },

  methods: {
    selectedAnatomicalStructuresChanged(newValue) {
      this.selectedAnatomicalStructures = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, selectedAnatomicalStructures: this.selectedAnatomicalStructures.length === 0 ? undefined : pluck('id', this.selectedAnatomicalStructures).toString() }
        },
        () => {
          this.$emit('community-spotlight-selections-changed')
        }
      )
    },
    selectedSpotlightTypesChanged(newValue) {
      this.selectedSpotlightTypes = newValue.checkedNodes
      this.$router.replace(
        {
          query: { ...this.$route.query, selectedSpotlightTypes: this.selectedSpotlightTypes.length === 0 ? undefined : pluck('id', this.selectedSpotlightTypes).toString() }
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
            selectedSpotlightTypes: undefined,
            selectedAnatomicalStructures: undefined
          }
        },
        () => {
          this.$emit('community-spotlight-selections-changed')
          this.$refs.spotlightTypeCategory.uncheckAll()
        }
      )
    },
    deselectFacet(facetId) {
      this.$refs.anatomicalStructuresCategory.uncheck(facetId)
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

.remove-bottom-border {
  // hacky fix to address placing the design system drop down for the event type category outside the facet menu since it handles its own borders
  border-bottom: none;
}
</style>
