<template>
  <div class="white-background">
    <h2 class="title">
      Refine results
    </h2>
    <hr />
    <tags-container
      :selected-facets="selectedFacets"
      @deselect-facet="deselectFacet"
      @deselect-all-facets="deselectAllFacets"
    />
    <slot />
  </div>
</template>

<script>
import TagsContainer from '@/components/FacetMenu/TagsContainer.vue'
export default {
  name: 'FacetMenu',

  components: { TagsContainer },

  props: {
    selectedFacets: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    deselectAllFacets() {
      this.$emit('deselect-all-facets')
    },
    deselectFacet(id) {
      this.$emit('deselect-facet', id)
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
  font-weight: 500;
}

hr {
  border: none;
  border-bottom: 1px solid #dbdfe6;
  margin: 0;
}
</style>
