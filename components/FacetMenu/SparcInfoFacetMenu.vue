<template>
  <facet-menu
    :selected-facets="selectedFacet"
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
      :facet="sparcInvestigatorsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onSparcInvestigatorsChanged"
    />
    <facet-category
      ref="hasPublicationsCategory"
      :default-checked-keys="defaultCheckedKeys"
      :facet="hasPublicationsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onHasPublicationsChanged"
    />
    <facet-category
      ref="hasDatasetsCategory"
      :default-checked-keys="defaultCheckedKeys"
      :facet="hasDatasetsCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onHasDatasetsChanged"
    />
    <facet-category
      ref="hasModelSimulationCategory"
      :default-checked-keys="defaultCheckedKeys"
      :facet="hasModelSimulationCategory"
      :hide-show-all-option="true"
      :show-collapsible-label-arrow="false"
      @selection-change="onHasModelSimulationChanged"
    />
  </facet-menu>
</template>

<script>
import FacetCategory from './FacetCategory.vue'
import FacetMenu from './FacetMenu.vue'
import FacetRadioButtonCategory from './FacetRadioButtonCategory.vue'

const options = [
  {
    label: 'about',
    id: 'about'
  },
  {
    label: 'help',
    id: 'help'
  },
  {
    label: 'policies',
    id: 'policies'
  },
  {
    label: 'projects',
    id: 'projects'
  }
]

const sparcInvestigatorsCategory = {
  label: 'information for sparc investigators',
  key: 'sparcInvestigators',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'sparcInvestigators',
      children: [],
      key: 'sparcInvestigators'
    }
  ]
}

const hasPublicationsCategory = {
  label: 'has publications',
  key: 'hasPublications',
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
  children: [
    {
      label: 'Show only if "YES"',
      id: 'hasDatasets',
      children: [],
      key: 'hasDatasets'
    }
  ]
}

const hasModelSimulationCategory = {
  label: 'has model/simulation',
  key: 'hasModelSimulation',
  children: [
    {
      label: 'Show only if "YES"',
      id: 'hasModelSimulation',
      children: [],
      key: 'hasModelSimulation'
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
      type: options[0].id,
      sparcInvestigatorsCategory : sparcInvestigatorsCategory,
      hasPublicationsCategory : hasPublicationsCategory,
      hasDatasetsCategory : hasDatasetsCategory,
      hasModelSimulationCategory : hasModelSimulationCategory,
      defaultCheckedKeys: []
    }
  },

  computed: {
    selectedTypeLabel: function() {
      var selectedOption = this.options.find(
        option => this.type === option.id
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
    if (this.$route.query.sparcInfoType) {
      this.type = this.$route.query.sparcInfoType
    }
  },

  methods: {
    onSelectedTypeChanged(newValue) {
      if (this.type === newValue) {
        return
      }
      this.type = newValue
      this.$router.replace(
        {
          query: { ...this.$route.query, sparcInfoType: newValue }
        },
        () => {
          this.$emit('sparc-info-selections-changed')
        }
      )
    },
    onSparcInvestigatorsChanged(newValue) {

    },
    onHasPublicationsChanged(newValue) {

    },
    onHasDatasetsChanged(newValue) {

    },
    onHasModelSimulationChanged(newValue) {

    },
    getSelectedType() {
      return this.type
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
      // if (this.type === this.options[0].id) {
      //   this.$refs.publicationCategory.reset()
      // } else if (this.type === options[1].id) {
      //   this.$refs.eventCategory.reset()
      // }
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
