<template>
  <facet-label :label="label" :disabled="!enabled">
		<hr>
		<el-radio-group class="indent" v-model="selectedOption" @input="selectedDateOptionChanged">
			<el-radio class="padding-bottom"
				:label="showAllOption"
			/>
      <radio-date-option 
				class="padding-bottom"
        v-for="(option, index) in dateOptions"
        :label="option"
        :key="index"
				:enabled="selectedOption === option"
				@year-changed="yearChanged"
				@month-changed="monthChanged"
      />
		</el-radio-group> 
  </facet-label>
</template>

<script>
import FacetLabel from './FacetLabel.vue'
import RadioDateOption from './RadioDateOption.vue'
const showAllOption = 'show all'
const dateOptions = ['Before', 'During', 'After']

export default {
  name: 'FacetRadioButtonCategory',

  components: {FacetLabel, RadioDateOption},

  props: {
    label: {
      type: String,
      default: ""
    },
    defaultSelectedOption: {
      type: String,
      default: showAllOption
    },
		defaultSelectedMonth: {
			type: String,
			default: ""
		},
		defaultSelectedYear: {
			type: Number,
			default: 0
		},
		enabled: {
			type: Boolean,
			default: false
		}
  },

	data() {
		return {
			dateOptions : dateOptions,
			showAllOption: showAllOption,
			selectedOption: this.defaultSelectedOption,
			month: this.defaultSelectedMonth,
			year: this.defaultSelectedYear
		}
	},

  computed: {
    
  },
  watch: {
		defaultSelectedOption: function() {
      this.selectedOption = this.defaultSelectedOption
		},
		defaultSelectedYear: function() {
      this.year = this.defaultSelectedYear
		},
		defaultSelectedMonth: function() {
      this.month = this.defaultSelectedMonth
		}
  },

  mounted() {
    
  },

  methods: {
    selectedDateOptionChanged: function(newValue) {
      this.$emit('selected-date-option-changed', newValue);
    },
		monthChanged: function(newValue) {
			this.month = newValue;
			this.$emit('selected-month-changed', newValue);
		},
		yearChanged: function(newValue) {
			this.year = newValue;
			this.$emit('selected-year-changed', newValue);
		},
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
  .indent {
    display: block;
    text-transform: capitalize;
    padding: 1rem 0 0 2rem;
  }

	.padding-bottom {
		padding-bottom: 1rem;
	}

</style>