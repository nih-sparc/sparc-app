export default {
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
      const filesResponse = await axios.$get(filesUrl)
      const files = filesResponse.files
      filePath = filePath.toLowerCase()
      let foundFile = {}

      files.forEach(file => {
        // Check if path matches query param
        if (filePath.toLowerCase() === file.path.toLowerCase) {
          foundFile = file
        }

        // check if uri matches filePath query param
        if (file.uri) {
          let uriFile = file.uri.substring(file.uri.lastIndexOf('/'))
          if (uriFile) {
            uriFile = uriFile.toLowerCase()
          }
          if (filePath.includes(uriFile)) {
            foundFile = file
          }
        }
      })

      return foundFile
    }
  }
}
