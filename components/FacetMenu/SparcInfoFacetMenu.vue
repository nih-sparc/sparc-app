<template>
  <facet-menu
    :selected-facets="selectedFacetsArray"
    :visible-facet-categories="visibleCategories"
    @deselect-facet="deselectFacet"
    @deselect-all-facets="deselectAllFacets"
  >
    <facet-radio-button-category
      :label="'type'"
      :options="options"
      :default-selected-option="selectedTypeLabel"
      @selection-changed="onSelectedTypeChanged"
    />
    <facet-category
      ref="sparcInvestigatorsCategory"
      :default-checked-keys="defaultCheckedKeys"
      :enabled="selectedTypeLabel === options[1].label"
      :facet="sparcInvestigatorsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onSparcInvestigatorsChanged"
    />
    <!-- Hiding the 3 categories below. See the following wrike ticket comment: https://www.wrike.com/workspace.htm?acc=3203588#path=folder&id=745309608&c=list&vid=43893997&a=3203588&t=735304640&so=2&bso=10&sd=0&st=space-441356195 -->
    <facet-category
      v-if="false"
      ref="hasPublicationsCategory"
      :default-checked-keys="defaultCheckedKeys"
      :enabled="selectedTypeLabel === options[3].label"
      :facet="hasPublicationsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onHasPublicationsChanged"
    />
    <facet-category
      v-if="false"
      ref="hasDatasetsCategory"
      :default-checked-keys="defaultCheckedKeys"
      :enabled="selectedTypeLabel === options[3].label"
      :facet="hasDatasetsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onHasDatasetsChanged"
    />
    <facet-category
      v-if="false"
      ref="hasModelsSimulationsCategory"
      :default-checked-keys="defaultCheckedKeys"
      :enabled="selectedTypeLabel === options[3].label"
      :facet="hasModelsSimulationsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onHasModelsSimulationsChanged"
    />
  </facet-menu>
</template>

<script>
import FacetCategory from './FacetCategory.vue'
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
  {
    label: 'projects',
    id: process.env.ctf_project_id
  }
]

const sparcInvestigatorsCategory = {
  label: 'information for sparc investigators',
  key: 'sparcInvestigators',
  id: 'sparcInvestigators',
  facetPropPath: 'sparcInvestigators',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'sparcInvestigators',
      children: [],
      facetPropPath: 'sparcInvestigators',
      key: 'sparcInvestigators'
    }
  ]
}

const hasPublicationsCategory = {
  label: 'has publications',
  key: 'hasPublications',
  id: 'hasPublications',
  facetPropPath: 'hasPublications',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'hasPublications',
      children: [],
      key: 'hasPublications'
    }
  ]
}

const hasDatasetsCategory = {
  label: 'has datasets',
  key: 'hasDatasets',
  id: 'hasDatasets',
  facetPropPath: 'hasDatasets',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'hasDatasets',
      children: [],
      key: 'hasDatasets'
    }
  ]
}

const hasModelsSimulationsCategory = {
  label: 'has model/simulation',
  key: 'hasModelsSimulations',
  id: 'hasModelsSimulations',
  facetPropPath: 'hasModelsSimulations',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'hasModelsSimulations',
      children: [],
      key: 'hasModelsSimulations'
    }
  ]
}

export default {
  name: 'SparcInfoFacetMenu',

  components: {
    FacetCategory,
    FacetMenu,
    FacetRadioButtonCategory
  },

  props: {},

  data() {
    return {
      options: options,
      sparcInfoType: options[0].id,
      sparcInvestigatorsCategory: sparcInvestigatorsCategory,
      hasPublicationsCategory: hasPublicationsCategory,
      hasDatasetsCategory: hasDatasetsCategory,
      hasModelsSimulationsCategory: hasModelsSimulationsCategory,
      defaultCheckedKeys: [],
      showFacetMenu: process.env.show_facet_menu,
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
      if (this.selectedTypeLabel === options[3].label) {
        visibleCategories = [
          'hasDatasets',
          'hasPublications',
          'hasModelsSimulations'
        ]
      }
      return visibleCategories
    }
  },

  watch: {},

  mounted() {
    if (this.$route.query.sparcInfoType) {
      this.sparcInfoType = this.$route.query.sparcInfoType
    }
    if (this.$route.query.sparcInvestigators) {
      this.defaultCheckedKeys = this.defaultCheckedKeys.concat([
        this.sparcInvestigatorsCategory.children[0].id
      ])
    }
    if (this.$route.query.hasPublications) {
      this.defaultCheckedKeys = this.defaultCheckedKeys.concat([
        this.hasPublicationsCategory.children[0].id
      ])
    }
    if (this.$route.query.hasDatasets) {
      this.defaultCheckedKeys = this.defaultCheckedKeys.concat([
        this.hasDatasetsCategory.children[0].id
      ])
    }
    if (this.$route.query.hasModelsSimulations) {
      this.defaultCheckedKeys = this.defaultCheckedKeys.concat([
        this.hasModelsSimulationsCategory.children[0].id
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
      if (!isEmpty(data.facets)) {
        this.setSelectedFacetsArray({
          facets: [sparcInvestigatorsCategory],
          key: 'sparcInvestigators'
        })
      } else {
        this.setSelectedFacetsArray(data)
      }

      const sparcInvestigators = data.facets.length > 0 ? true : undefined
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
    onHasPublicationsChanged(data) {
      if (!isEmpty(data.facets)) {
        this.setSelectedFacetsArray({
          facets: [hasPublicationsCategory],
          key: 'hasPublications'
        })
      } else {
        this.setSelectedFacetsArray(data)
      }

      const hasPublications = data.facets.length > 0 ? true : undefined
      this.$router.replace(
        {
          query: { ...this.$route.query, hasPublications: hasPublications }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    onHasDatasetsChanged(data) {
      if (!isEmpty(data.facets)) {
        this.setSelectedFacetsArray({
          facets: [hasDatasetsCategory],
          key: 'hasDatasets'
        })
      } else {
        this.setSelectedFacetsArray(data)
      }

      const hasDatasets = data.facets.length > 0 ? true : undefined
      this.$router.replace(
        {
          query: { ...this.$route.query, hasDatasets: hasDatasets }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    onHasModelsSimulationsChanged(data) {
      if (!isEmpty(data.facets)) {
        this.setSelectedFacetsArray({
          facets: [hasModelsSimulationsCategory],
          key: 'hasModelsSimulations'
        })
      } else {
        this.setSelectedFacetsArray(data)
      }

      const hasModelsSimulations = data.facets.length > 0 ? true : undefined
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            hasModelsSimulations: hasModelsSimulations
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
      const selectedFacet = this.selectedFacets[sparcInvestigatorsCategory.key]
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
          this.$emit('sparc-info-selections-changed')
          this.$refs.sparcInvestigatorsCategory.uncheckAll()
        }
      )
    },
    deselectFacet(id) {
      this.$refs.sparcInvestigatorsCategory.uncheck(id)
    },
    setSelectedFacetsArray(data) {
      this.selectedFacets[data.key] = data.facets
      this.selectedFacetsArray = []
      for (const [key, value] of Object.entries(this.selectedFacets)) {
        this.selectedFacetsArray = this.selectedFacetsArray.concat(value)
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
