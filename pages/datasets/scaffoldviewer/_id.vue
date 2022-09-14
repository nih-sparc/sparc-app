<template>
  <div class="scaffold-viewer-page">
    <div class="page-wrap container">
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <ScaffoldViewer
          v-show="activeTab === 'viewer'"
          :scaffold-u-r-l="scaffoldURL"
          :view-u-r-l="viewURL"
          :region="region"
          :state="state"
        />
      </detail-tabs>
      <div class="subpage">
        <div class="page-heading">
          <h2>{{ fileName }}</h2>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Type</strong>
          <div class="file-detail__column_2">
            3D Scaffold
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">Dataset</strong>
          <div class="file-detail__column_2">
            <nuxt-link
              :to="{
                name: 'datasets-datasetId',
                params: {
                  datasetId
                }
              }"
            >
              {{ datasetTitle }}
            </nuxt-link>
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column_1">File location</strong>
          <div class="file-detail__column_2">
            <nuxt-link
              :to="{
                name: `datasets-datasetId`,
                params: {
                  datasetId
                },
                query: {
                  datasetDetailsTab: 'files',
                  path: fileFolderLocation
                }
              }"
            >
              {{ filePath }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// :scaffold-selected="scaffoldSelected"
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import FetchPennsieveFile from '@/mixins/fetch-pennsieve-file'

import FirstCol from '@/mixins/first-col/index'
import FileDetails from '@/mixins/file-details'
import ScaffoldViewer from '@/components/ScaffoldViewer/ScaffoldViewer.vue'

// supportOldRoutes:
//  Modifies the incoming $route.query to add the needed query parameters used in the new /scaffoldviewer route.
//  Note that modifying routes from Vue does not change the url, only the $route objecti in this component.
const supportOldRoutes = function(query) {
  if (query.scaffold) {
    // file_name
    const scaffold = query.scaffold
    let name =
      scaffold.substring(scaffold.lastIndexOf('/') + 1, scaffold.length) ||
      scaffold
    let nameWE = name.substring(0, name.lastIndexOf('.')) || name
    query.file_name = nameWE

    // dataset_id
    query.dataset_id = scaffold.substring(0, scaffold.indexOf('/')) || ''

    // version_number
    const postId =
      scaffold.substring(scaffold.indexOf('/') + 1, scaffold.length) || ''
    query.dataset_version = postId.substring(0, postId.indexOf('/')) || ''

    // file_path
    query.file_path =
      postId.substring(postId.indexOf('/') + 1, postId.length) || ''

    return query
  } else {
    return query
  }
}

export default {
  name: 'ScaffoldViewerPage',

  components: {
    DetailTabs,
    ScaffoldViewer
  },

  mixins: [FileDetails, FirstCol, FetchPennsieveFile],

  async fetch() {
    //Get id for retrieving state on the server,
    //Id is prioritized before viewURL and region.
    let uuid = this.$route.query.id
    if (uuid) {
      if (this.currentId != uuid) {
        this.currentId = uuid
        let url = this.api + 'scaffold/getstate'
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ uuid: uuid })
        })
          .then(response => response.json())
          .then(data => {
            this.state = data.state
          })
      }
    } else if (this.$route.query.viewURL) {
      this.viewURL = this.$route.query.viewURL
    } else if (this.$route.query.region) {
      this.region = this.$route.query.region
    }
  },

  async asyncData({ app, route, $axios }) {
    const processedQuery = supportOldRoutes(route.query)
    const filePath = processedQuery.file_path
    const file = await FetchPennsieveFile.methods.fetchPennsieveFile(
      $axios,
      filePath,
      processedQuery.dataset_id,
      processedQuery.dataset_version
    )
    const url = `${process.env.discover_api_host}/datasets/${route.query.dataset_id}`
    var datasetUrl = route.query.dataset_version ? `${url}/versions/${route.query.dataset_version}` : url
    const userToken = app.$cookies.get('user-token')
    if (userToken) {
      datasetUrl += `?api_key=${userToken}`
    }
    const datasetInfo = await $axios.$get(datasetUrl).catch(error => {
      console.log(`Could not get the dataset's info: ${error}`)
    })

    return {
      file,
      processedQuery,
      datasetInfo
    }
  },
  data: () => {
    return {
      tabs: [
        {
          label: 'Scaffold Viewer',
          type: 'scaffold'
        }
      ],
      activeTab: 'viewer',
      viewURL: '',
      region: '',
      state: undefined
    }
  },

  computed: {
    /**
     * Get the dataset id from the scaffold query parameter.
     * @returns Number
     */
    datasetId: function() {
      return this.processedQuery.dataset_id
    },
    /**
     * Get the version scaffold query parameter.
     * @returns Number
     */
    versionNumber: function() {
      return this.processedQuery.dataset_version
    },
    /**
     * Return the url for the scaffold metadata file.
     * @returns String
     */
    scaffoldURL: function() {
      return `${process.env.portal_api}/s3-resource/${this.datasetId}/${this.versionNumber}/${this.filePath}`
    },
    /**
     * Return the dataset's name.
     * @returns String
     */
    datasetTitle: function() {
      return this.datasetInfo ? this.datasetInfo.name : 'Go to dataset'
    }
  },
  created: function() {
    this.currentId = undefined
    this.api = process.env.portal_api
    let lastChar = this.api.substr(-1)
    if (lastChar != '/') {
      this.api = this.api + '/'
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/_viewer.scss';
.page-heading {
  margin-bottom: 1.375rem;
}
</style>
