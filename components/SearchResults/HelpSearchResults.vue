<template>
  <el-table :show-header="false" :data="tableData" empty-text="No Results">
		<el-table-column>
			<template slot-scope="scope">
				  <help-card
            class="small-title"
						:help-item="scope.row"
					/>
      </template>
		</el-table-column>
  </el-table>
</template>

<script>
import HelpCard from '@/components/HelpCard/HelpCard.vue'

export default {
  name: 'HelpSearchResults',

	components: {
    HelpCard
  },

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 100%;
}

</style>
