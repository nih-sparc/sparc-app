<template>
  <div class="scaffold-viewer-page">
    <div class="page-wrap container">
      <div class="subpage">
        <div class="page-heading">
          <h1>{{ fileName }}</h1>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">File Details</strong>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Type</strong>
          <div class="file-detail__column">
            3D Scaffold
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Dataset id</strong>
          <div class="file-detail__column">
            {{ datasetId }}
          </div>
        </div>
        <div class="file-detail">
          <strong class="file-detail__column">Version</strong>
          <div class="file-detail__column">
            {{ versionNumber }}
          </div>
        </div>
      </div>
      <detail-tabs
        :tabs="tabs"
        :active-tab="activeTab"
        class="container"
        @set-active-tab="activeTab = $event"
      >
        <client-only placeholder="Loading scaffold ...">
          <div class="scaffoldvuer-container">
            <ScaffoldVuer
              ref="scaffoldvuer"
              :state="state"
              :display-markers="displayMarkers"
              :url="scaffoldUrl"
              :traditional="traditional"
              :background-toggle="backgroundToggle"
            />
          </div>
        </client-only>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="firstCol" class="details">
            <h3>Share</h3>
            <div>
              <button
                @click="copyLink"
                class="ml-8 btn-copy-permalink"
              >
                <svg-icon name="icon-permalink" height="28" width="28" />
                <span class="visuallyhidden">Copy permalink</span>
              </button>
            </div>
          </el-col>
        </el-row>          
      </detail-tabs>
    </div>
  </div>
</template>

<script>
// :scaffold-selected="scaffoldSelected"
import DetailTabs from '@/components/DetailTabs/DetailTabs.vue'
import { successMessage, failMessage } from '@/utils/notification-messages'

export default {
  name: 'ScaffoldViewerPage',

  components: {
    DetailTabs,
    ScaffoldVuer: process.client
      ? () => import('@abi-software/scaffoldvuer').then(m => m.ScaffoldVuer)
      : null
  },
  async fetch() {
    let uuid = this.$route.query.id;
    this.currentId = uuid;
    if (uuid && (this.currentId != uuid)) {
      this.currentId = uuid;
      let url = this.api + `scaffold/getstate`
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
  },
  watch: {
    '$route.query': '$fetch'
  },
  fetchOnServer: false,
  created: function() {
    this.currentId = undefined;
    this.api = process.env.portal_api
    let lastChar = this.api.substr(-1)
    if (lastChar != '/') {
      this.api = this.api + '/'
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
      activeTab: 'scaffold',
      file: {},
      traditional: true,
      displayMarkers: false,
      backgroundToggle: true,
      state: undefined,
    }
  },

  computed: {
    /**    console.log()
     * Get the file name from the scaffold que    console.log()ry parameter.
     * @returns String
     */
    fileName: function() {
      const scaffold = this.$route.query.scaffold
      let name =
        scaffold.substring(scaffold.lastIndexOf('/') + 1, scaffold.length) ||
        scaffold
      let nameWE = name.substring(0, name.lastIndexOf('.')) || name
      return nameWE
    },

    /**
     * Get the dataset id from the scaffold query parameter.
     * @returns Number
     */
    datasetId: function() {
      const scaffold = this.$route.query.scaffold
      const id = scaffold.substring(0, scaffold.indexOf('/')) || ''
      return id
    },

    /**
     * Get the versionmapscaffold query parameter.
     * @returns Numbermap
     */
    versionNumber: function() {
      const scaffold = this.$route.query.scaffold
      const postId =
        scaffold.substring(scaffold.indexOf('/') + 1, scaffold.length) || ''
      const version = postId.substring(0, postId.indexOf('/')) || ''
      return version
    },

    /**
     * Return the url for the scaffold metadata file.
     * @returns String
     */
    scaffoldUrl: function() {
      return `${process.env.portal_api}/s3-resource/${this.$route.query.scaffold}`
    }
  },
  methods: {
    copyLink: function() {
      this.$message(successMessage('Share link is being generated.'))
      let url = this.api + `scaffold/getshareid`;
      let state = this.$refs.scaffoldvuer.getState();
      if (state && state.url)
        delete state["url"];
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ state: state })
      })
        .then(response => response.json())
        .then(data => {
          if (data.uuid) {
            this.currentId = data.uuid;
            this.$router.replace(
              {query: {...this.$route.query, id: data.uuid}},
              () => {
                this.$copyText(`${process.env.ROOT_URL}${this.$route.fullPath}`).then(
                  () => {
                    this.$message(successMessage('Share link copied to clipboard.'))
                }, () => {
                    this.$message(failMessage('Failed to copy share link.'))
                });
              }
            );
          }
        })
        .catch(() => {
          this.$message(failMessage('Failed to get a share link.'))
      })
    },
  }

}
</script>

<style scoped lang="scss">
@import '@/assets/_variables.scss';

.page {
  display: flex;
  margin-top: 7rem;

  p {
    color: #606266;
  }
}

.about {
  text-align: center;
  min-height: 50vh;
  margin-top: 9rem;
}

h1 {
  flex: 1;
  font-size: 1.5em;
  line-height: 2rem;
}
.page-heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.375rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.page-heading__button {
  flex-shrink: 0;
}

.file-detail {
  border-bottom: 1px solid #dbdfe6;
  flex-direction: column;
  font-size: 0.875em;
  display: flex;
  padding: 1rem 0.625rem;
  @media (min-width: 48em) {
    flex-direction: row;
  }
}
.file-detail__column {
  flex: 1;
}
.btn-copy-permalink {
  border: none;
  background: none;
  color: $median;
  cursor: pointer;
  padding: 0;
  &:active {
    outline: none;
  }
}
.container ::v-deep {
  font-size: 0.875rem;
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5rem;
    text-transform: uppercase;
    margin-top:16px;
  }
  img {
    height: auto;
    max-width: 100%;
  }
}
</style>
<style lang="scss">
.scaffoldvuer-container {
  margin-top: 1.5rem;
  height: 90vh;
  max-width: calc(100% - 48px);
  left: 24px;
  overflow: hidden;
  position:relative;
  @import '~@abi-software/scaffoldvuer/dist/scaffoldvuer';
}
</style>
