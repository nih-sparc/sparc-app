<template>
  <div class="data-page">
    <page-hero v-if="heroCopy" class="subpage">
      <h2>A growing collection of SPARC data</h2>
      <p>
        The SPARC portal provides access to high-value datasets, maps, and
        predictive simulations ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Lorem ipsum dolor sit amet.
      </p>
    </page-hero>
    <div class="page-wrap container">
      <el-row type="flex">
        <el-col :span="24">
          <ul class="search-tabs">
            <li v-for="type in searchTypes" :key="type.label">
              <nuxt-link
                class="search-tabs__button"
                :to="{
                  name: 'data',
                  query: {
                    type: type.type
                  }
                }"
              >
                {{ type.label }}
              </nuxt-link>
            </li>
          </ul>
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col :span="6">
          <search-filters v-model="yo" />
        </el-col>
        <el-col :span="18">
          <div class="table-wrap">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column :fixed="true" prop="name" label="Name" />
              <el-table-column prop="image" label="Image" />
              <el-table-column
                prop="description"
                label="Description"
                width="250"
              />
              <el-table-column prop="col1" label="Description" width="250" />
              <el-table-column prop="col2" label="Description" width="250" />
              <el-table-column prop="col3" label="Description" width="250" />
              <el-table-column prop="col4" label="Description" width="250" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { compose, head, propOr } from 'ramda'
import PageHero from '@/components/PageHero/PageHero.vue'
import SearchFilters from '@/components/SearchFilters/SearchFilters.vue'

import createClient from '@/plugins/contentful.js'

const client = createClient()

export default {
  name: 'DataPage',

  components: {
    PageHero,
    SearchFilters
  },

  mixins: [],

  asyncData() {
    return Promise.all([
      // Get page content
      client.getEntry(process.env.ctf_about_page_id)
    ])
      .then(([page]) => {
        return { ...page.fields }
      })
      .catch(console.error)
  },

  data: () => {
    return {
      yo: [
        {
          category: 'category',
          items: [
            {
              label: 'filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 filter 1 ',
              key: 'filter_1',
              value: false
            }
          ]
        },
        {
          category: 'category 2',
          items: [
            {
              label: 'filter 1',
              key: 'filter_2',
              value: false
            }
          ]
        }
      ],
      searchType: 'dataset',
      searchTypes: [
        {
          label: 'Datasets',
          type: 'dataset'
        },
        {
          label: 'Files',
          type: 'file'
        },
        {
          label: 'Organs',
          type: 'organ'
        },
        {
          label: 'Projects',
          type: 'project'
        },
        {
          label: 'Simulations',
          type: 'simulation'
        }
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          image: '',
          description:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col1:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col2:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col3:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col4:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col5:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col6:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore maga aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…',
          col7:
            'Lorem ipsum dolor sit amet, consectetur dol adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ea exercitation ullamco laboris nisi ut aliquip commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum…'
        }
      ]
    }
  },

  mounted: function() {
    // Check the searchType param in the route and set it if it doesn't exist
    if (!this.$route.query.type) {
      const firstTabType = compose(propOr('', 'type'), head)(this.searchTypes)

      this.$router.replace({ query: { type: firstTabType } })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/_variables.scss';

.search-tabs {
  border-bottom: 2px solid #dbdfe6;
  display: flex;
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  li {
    margin: 0 2em;
    transform: translateY(2px);
    &:first-child {
      margin-left: 0;
    }
  }
}
.search-tabs__button {
  background: none;
  border: none;
  color: #909399;
  cursor: pointer;
  display: block;
  font-size: 1.25em;
  font-weight: 500;
  outline: none;
  padding: 0.5rem;
  text-decoration: none;
  &:hover,
  &:focus,
  &.nuxt-link-exact-active {
    color: $navy;
    border-bottom: 2px solid $median;
  }
}

.table-wrap {
  background: #fff;
  border: 1px solid rgb(228, 231, 237);
  padding: 16px;
}
</style>
