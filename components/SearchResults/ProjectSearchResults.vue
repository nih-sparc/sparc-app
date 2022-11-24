<template>
  <el-table :data="tableData" :show-header="false" empty-text="No Results">
    <el-table-column width="160">
      <template slot-scope="scope">
        <div class="image-container">
          <img
            v-if="scope.row.fields.institution"
            class="img-project"
            :src="getImageSrc(scope)"
            :alt="getImageAlt(scope)"
          />
        </div>
      </template>
    </el-table-column>

    <el-table-column min-width="400">
      <template slot-scope="scope">
        <nuxt-link
          :to="{
            name: 'projects-projectId',
            path: 'projects/:scope.row.sys.id',
            params: { projectId: scope.row.sys.id }
          }"
          v-html="getHighlighted(scope.row.fields.title)"
        />
        <div class="mt-8 mb-8" v-html="getHighlighted(scope.row.fields.shortDescription)"/>
        <table class="property-table">
          <tr v-if="scope.row.fields.projectSection">
            <td class="property-name-column">
              Anatomical Focus
            </td>
            <td v-html="getHighlighted(scope.row.fields.projectSection.fields.title)"/>
          </tr>
          <tr v-if="scope.row.fields.principleInvestigator">
            <td class="property-name-column">
              Principle Investigator
            </td>
            <td v-html="getHighlighted(reverseName(scope.row.fields.principleInvestigator))"/>
          </tr>
          <tr v-if="scope.row.fields.institution">
            <td class="property-name-column">
              Institution
            </td>
            <td v-html="getHighlighted(scope.row.fields.institution.fields.name)"/>
          </tr>
          <tr v-if="scope.row.fields.awardId">
            <td class="property-name-column">
              NIH Award
            </td>
            <td>
              <a :href="getNihReporterUrl(scope)" target="_blank">
                {{ scope.row.fields.awardId }}
                <svg-icon v-if="!isInternalLink(getNihReporterUrl(scope))" name="icon-open" height="20" width="20" />
              </a>
            </td>
          </tr>
        </table>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Truncate from '@/mixins/truncate'
import { isInternalLink } from '@/mixins/marked/index'
import { HIGHLIGHT_TAG } from '../../pages/data/index.vue'

export default {
  name: 'ProjectSearchResults',

  mixins: [Truncate],

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageSrc: function(scope) {
      return scope.row.fields.institution.fields.logo
        ? scope.row.fields.institution.fields.logo.fields.file.url
        : ''
    },
    /**
     * Get image source
     * @param {Object} scope
     * @returns {String}
     */
    getImageAlt: function(scope) {
      return scope.row.fields.institution.fields.logo
        ? scope.row.fields.institution.fields.logo.fields.file.description
        : `Logo for ${scope.row.fields.institution.fields.name}`
    },

    /**
     * Get NIH Report Url
     * @param {Object} scope
     * @returns {String}
     */
    getNihReporterUrl: function(scope) {
      return scope.row.fields.nihReporterUrl || '#'
    },

    /**
     * Get short description for dataset
     * @param {Object} scope
     * @returns {String}
     */
    getShortDescription: function(scope) {
      return scope.row.fields.shortDescription || ''
    },

    // Return name in the form last, first
    reverseName: function(name) {
      const fullName = name.split(' ')
      if (fullName.length < 2) {
        return name
      }
      if (fullName.length === 2) {
        return `${fullName[1]}, ${fullName[0]}`
      }
      return `${fullName[2]}, ${fullName[0]} ${fullName[1]}`
    },
    isInternalLink,

    /**
     * Function that takes a string and wraps matching substrings with the given HTML tag.
     * @param {String} text Input text to be processed
     * @returns {String} Output text with matching terms wrapped by given HTML tag. Original text if search is empty.
     */
    getHighlighted: function(text='') {
      const search = this.$route.query.search
      if (search) {
        const terms = search.split(' ')
        let result = text
        terms.forEach(t => {
          result = result.replace(new RegExp(t, 'ig'), `<${HIGHLIGHT_TAG}>$&</${HIGHLIGHT_TAG}>`)
        })
        return result
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@nih-sparc/sparc-design-system-components/src/assets/_variables.scss';

.el-table {
  width: 100%;
}
.img-project {
  height: auto;
  width: 100%;
  margin: auto;
}
.el-table--enable-row-hover .el-table__body tr {
  background-color: transparent;
}
.property-table {
  td {
    background-color: transparent;
    padding: 0.25rem 0 0 0;
    border: none;
  }
  background-color: transparent;
  border: none;
  padding: 0;
}
// The outermost bottom border of the table. Element UI adds psuedo elements to create the bottom table border that we must hide to remove
table:not([class^='el-table__'])::before {
  display: none;
}
.property-name-column {
  width: 160px;
  font-weight: bold;
}
.image-container {
  display: flex;
  aspect-ratio: 1;
  border: 1px solid $lineColor2;
  background-color: white !important;
  padding: .25rem;
}
</style>
