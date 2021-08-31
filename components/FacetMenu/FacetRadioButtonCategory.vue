<template>
  <facet-label :label="label" :showCollapsibleArrow="false">
		<el-radio-group v-model="selectedOption" @input="selectionChanged" class="fill-width white-background negate-label-padding">
      <el-radio 
        v-for="option in this.options"
        class="radio"
        :label="option.label"
        :key="option.id"
      />
		</el-radio-group> 
  </facet-label>
</template>

<script>
import FacetLabel from './FacetLabel.vue'

export default {
  name: 'FacetRadioButtonCategory',

  components: {FacetLabel},

  props: {
    label: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    selectedOption: {
      type: String,
      default: ""
    }
  },

  computed: {
    
  },
  watch: {
    
  },

  mounted() {
    
  },

  methods: {
    selectionChanged: function(newValue) {
      const newValueId = this.options.find(option => option.label == newValue).id;
      this.$emit('selection-changed', newValueId);
    }
  }
}
</script>

<style>
.el-radio__input.is-checked + .el-radio__label {
  color: #8300bf;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #8300bf;
  background: #8300bf;
}
</style>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';
  .radio {
    display: block;
    text-transform: capitalize;
    margin: 1rem 2rem;
  }

  .fill-width {
    width: 100%;
  }

  .white-background {
    background-color: white;
  }

  .negate-label-padding {
    margin-top: -0.5rem;
  }

</style>