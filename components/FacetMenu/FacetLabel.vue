<template>
  <div>
    <hr />
    <h2 class="title">
      {{ label }}
      <svg-icon
				v-show="showCollapsibleArrow"
        @click="() => collapsed = !collapsed"
        class="ml-8 icon-arrow"
        name="icon-arrow"
        :dir="collapsibleArrowDir"
        height="15"
        width="15"
      />
    </h2>
    <div v-show="!collapsed" class="light-gray-background">
			<slot></slot>
		</div>
  </div>
</template>

<script>

export default {
  name: 'FacetLabel',

  components: {},

  props: {
		label: {
			type: String,
			default: ""
  	},
		collapseByDefault: {
			type: Boolean,
			default: false
  	},
		showCollapsibleArrow: {
			type: Boolean,
			default: true
  	}
  },

  data() {
    return {
      collapsed: this.collapseByDefault
    }
  },
  computed: {
    collapsibleArrowDir: function() {
      return this.collapsed ? 'up' : 'down'
    }
  }
}

</script>

<style lang="scss" scoped>
@import '../../assets/_variables.scss';

.light-gray-background {
  background-color: rgb(250,251,252);
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
}

.title {
  display: flex;
  justify-content: space-between;
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