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
      return files.find(element => filePath === element.path || filePath.includes(element.uri.substring(element.uri.lastIndexOf('/'))))
    }
  }
}
