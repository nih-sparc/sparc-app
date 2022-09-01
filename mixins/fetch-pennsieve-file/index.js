export default {
  computed: {
    userToken: function() {
      return this.$store.getters['user/cognitoUserToken'] || this.$cookies.get('user-token')
    },
  },
  methods: {
    /**
     * Workaround to using pennsieve endpoint https://docs.pennsieve.io/reference/getfile-1 to get the file
     * we can replace this once the discrepencies between the getFile and browseFiles pennsieve endpoint responses are figured out
     * for files containing multiple extensions.
     */
    fetchPennsieveFile: async function(axios, filePath, datasetId, datasetVersion) {
      const fileLocationEndIndex = filePath.lastIndexOf('/')
      const filesLocation = filePath.substring(0, fileLocationEndIndex)
      const filesUrl = `${process.env.discover_api_host}/datasets/${datasetId}/versions/${datasetVersion}/files/browse?path=${filesLocation}`
      if (this.userToken) { filesUrl += `&api_key=${this.userToken}` }
      const filesResponse = await axios.$get(filesUrl)
      const files = filesResponse.files
      if (files.length === 0) {
        console.warn(`
        WARNING! the file "${filePath}" was just attempted to download from ${filesUrl} , This will likely crash the page using this file`)
      }

      filePath = filePath.toLowerCase()
      let foundFile = {}
      let keepLooking = true

      files.every(file => {
        // Check if path matches query param.
        if (filePath.toLowerCase() === file.path.toLowerCase()) {
          foundFile = file
          keepLooking = false
        } else if (file.uri) {
          // Check if uri matches filePath query param.
          let uriFile = file.uri.substring(file.uri.lastIndexOf('/'))
          if (uriFile) {
            uriFile = uriFile.toLowerCase()
          }
          if (filePath.includes(uriFile)) {
            foundFile = file
            keepLooking = false
          }
        }
        return keepLooking
      })

      return foundFile
    }
  }
}
