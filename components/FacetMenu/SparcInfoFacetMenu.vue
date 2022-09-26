<template>
  <div>
    <facet-menu
      :selected-facets="selectedFacetsArray"
      :visible-facet-categories="visibleCategories"
      :visibleFacets="facetMenuVisibleFacets"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    >
      <facet-radio-button-category
        :label="'type'"
        :options="options"
        :default-selected-option="selectedTypeLabel"
        @selection-changed="onSelectedTypeChanged"
      />
    </facet-menu>
    <dropdown-multiselect
      :enabled="selectedTypeLabel === options[1].label"
      :category="sparcInvestigatorsCategory"
      :default-checked-ids="defaultCheckedIds"
      @selection-change="onSparcInvestigatorsChanged"
      ref="sparcInvestigatorsCategory"
    />
  </div>
</template>

<script>
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonCategory from './FacetRadioButtonCategory.vue'
import { isEmpty } from 'ramda'

const options = [
  {
    label: 'about',
    id: 'about'
  },
  {
    label: 'help',
    id: process.env.ctf_help_id
  },
  {
    label: 'policies',
    id: 'policies'
  },
]

const sparcInvestigatorsCategory = {
  label: 'Information for SPARC Investigators',
  id: 'sparcInvestigators',
  data: [
    {
      label: 'Information for SPARC Investigators',
      id: 'sparcInvestigators',
      facetPropPath: 'sparcInvestigators'
    }
  ]
}

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
      sparcInfoType: options[0].id,
      sparcInvestigatorsCategory: sparcInvestigatorsCategory,
      defaultCheckedIds: [],
      selectedFacets: {},
      selectedFacetsArray: []
    }
  },

  computed: {
    selectedTypeLabel: function() {
      var selectedOption = this.options.find(
        option => this.sparcInfoType === option.id
      )
      return selectedOption === undefined
        ? options[0].label
        : selectedOption.label
    },
    aboutDetailsTypesToCheck: function() {
      if (this.sparcInfoType !== 'policies' && this.sparcInfoType !== 'about') {
        return undefined
      }
      return this.sparcInfoType === 'policies'
        ? process.env.ctf_about_details_page_types
            .filter(type => type === 'Policies')
            .toString()
        : process.env.ctf_about_details_page_types
            .filter(type => type !== 'Policies')
            .toString()
    },
    visibleCategories: function() {
      var visibleCategories = []
      if (this.selectedTypeLabel === options[1].label) {
        visibleCategories = ['sparcInvestigators']
      }
      return visibleCategories
    },
    facetMenuVisibleFacets: function() {
      const sparcInvestigators = {
        'Information for SPARC Investigators': true,
        facetPropPath: 'sparcInvestigators',
      }
      return {...this.visibleFacets, sparcInvestigators}
    },
  },
  mounted() {
    if (this.$route.query.sparcInfoType) {
      this.sparcInfoType = this.$route.query.sparcInfoType
    }
    if (this.$route.query.sparcInvestigators) {
      this.defaultCheckedIds = this.defaultCheckedIds.concat([
        this.sparcInvestigatorsCategory.data[0].id
      ])
    }
  },
  methods: {
    onSelectedTypeChanged(newValue) {
      if (this.sparcInfoType === newValue) {
        return
      }
      this.sparcInfoType = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, sparcInfoType: newValue }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    onSparcInvestigatorsChanged(data) {
      this.selectedFacets[data.id] = data.checkedNodes

      this.selectedFacetsArray = []
      for (const [id, value] of Object.entries(this.selectedFacets)) {
        this.selectedFacetsArray = this.selectedFacetsArray.concat(value)
      }

      const sparcInvestigators = data.checkedNodes.length > 0 ? true : undefined
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            sparcInvestigators: sparcInvestigators
          }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    getSelectedType() {
      if (this.sparcInfoType === 'policies' || this.sparcInfoType === 'about') {
        return process.env.ctf_about_details_content_type_id
      }
      return this.sparcInfoType
    },
    getTags() {
      const selectedFacet = this.selectedFacets[sparcInvestigatorsCategory.id]
      if (
        this.selectedTypeLabel === options[1].label &&
        selectedFacet !== undefined &&
        !isEmpty(selectedFacet)
      ) {
        return 'SPARC Investigators'
      }
      return undefined
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            sparcInvestigators: undefined,
          }
        },
        () => {
          this.$refs.sparcInvestigatorsCategory.uncheckAll()
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    deselectFacet(id) {
      this.$refs.sparcInvestigatorsCategory.uncheck(id)
    },
  }
}
</script>
