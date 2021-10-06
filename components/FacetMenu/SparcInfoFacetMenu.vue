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
    <div v-if="showFacetMenu">
      <facet-category
        ref="sparcInvestigatorsCategory"
        :default-checked-keys="defaultCheckedKeys"
        :enabled="selectedTypeLabel === options[1].label"
        :facet="sparcInvestigatorsCategory"
        :hide-show-all-option="true"
        :show-collapsible-label-arrow="false"
        @selection-change="onSparcInvestigatorsChanged"
      />
      <facet-category
        ref="hasPublicationsCategory"
        :default-checked-keys="defaultCheckedKeys"
        :enabled="selectedTypeLabel === options[3].label"
        :facet="hasPublicationsCategory"
        :hide-show-all-option="true"
        :show-collapsible-label-arrow="false"
        @selection-change="onHasPublicationsChanged"
      />
      <facet-category
        ref="hasDatasetsCategory"
        :default-checked-keys="defaultCheckedKeys"
        :enabled="selectedTypeLabel === options[3].label"
        :facet="hasDatasetsCategory"
        :hide-show-all-option="true"
        :show-collapsible-label-arrow="false"
        @selection-change="onHasDatasetsChanged"
      />
      <facet-category
        ref="hasModelSimulationCategory"
        :default-checked-keys="defaultCheckedKeys"
        :enabled="selectedTypeLabel === options[3].label"
        :facet="hasModelSimulationCategory"
        :hide-show-all-option="true"
        :show-collapsible-label-arrow="false"
        @selection-change="onHasModelSimulationChanged"
      />
    </div>
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
      sparcInfoType: options[0].id,
      sparcInvestigatorsCategory: sparcInvestigatorsCategory,
      hasPublicationsCategory: hasPublicationsCategory,
      hasDatasetsCategory: hasDatasetsCategory,
      hasModelSimulationCategory: hasModelSimulationCategory,
      defaultCheckedKeys: [],
      showFacetMenu: process.env.show_facet_menu
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
    selectedFacet: function() {
      return []
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
    }
  },

  watch: {},

  mounted() {
    if (this.$route.query.sparcInfoType) {
      this.sparcInfoType = this.$route.query.sparcInfoType
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
    onSparcInvestigatorsChanged(newValue) {},
    onHasPublicationsChanged(newValue) {},
    onHasDatasetsChanged(newValue) {},
    onHasModelSimulationChanged(newValue) {},
    getSelectedType() {
      if (this.sparcInfoType === 'policies' || this.sparcInfoType === 'about') {
        return process.env.ctf_about_details_content_type_id
      }
      return this.sparcInfoType
    },
    deselectAllFacets() {
      this.$router.replace(
        {
          query: {
            ...this.$route.query
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
