<template>
  <div>
    <el-radio class="margin-bottom" :label="label" />
    <div class="flex margin-y">
      <el-select
        v-model="month"
        class="margin-right"
        placeholder="Month"
        :disabled="!enabled"
        @change="monthChanged"
      >
        <el-option
          v-for="(month, index) in months"
          :key="index"
          :label="month"
          :value="month"
        />
      </el-select>
      <el-input-number
        v-model="year"
        class="remove-number-arrows"
        placeholder="Year"
        :precision="0"
        :min="2000"
        :max="2040"
        :disabled="!enabled"
        @change="yearChanged"
      />
    </div>
  </div>
</template>

<script>
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export default {
  name: 'RadioDateOption',

  components: {},

  props: {
    label: {
      type: String,
      default: ''
    },
    enabled: {
      type: Boolean,
      default: false
    },
    defaultMonth: {
      type: String,
      default: 'Mar'
    },
    defaultYear: {
      type: Number,
      default: 2020
    }
  },

  data() {
    return {
      months: months,
      month: this.defaultMonth,
      year: this.defaultYear
    }
  },

  computed: {},
  watch: {
    defaultMonth: function() {
      if (this.month === this.defaultMonth) {
        return
      }
      this.month = this.defaultMonth
    },
    defaultYear: function() {
      if (this.year === this.defaultYear) {
        return
      }
      this.year = this.defaultYear
    }
  },

  mounted() {},

  methods: {
    yearChanged: function(newValue) {
      this.$emit('year-changed', newValue)
    },
    monthChanged: function(newValue) {
      this.$emit('month-changed', newValue)
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
.remove-number-arrows > .el-input-number__increase,
.remove-number-arrows > .el-input-number__decrease {
  display: none;
}
.remove-number-arrows > .el-input > .el-input__inner {
  padding: 0;
}
</style>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.flex {
  display: flex;
  justify-content: space-around;
  max-width: fit-content;
}

.margin-y {
  margin: 0 1.5rem;
}

.margin-right {
  margin-right: 0.5rem;
}

.margin-bottom {
  margin-bottom: 0.25rem;
}
</style>
