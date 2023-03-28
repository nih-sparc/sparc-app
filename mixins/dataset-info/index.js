export default {
  methods: {
    /**
     * Fetch dataset information from discover api with dataset id and version
     */
    getDatasetInfo: async function(axios, datasetId, datasetVersion, userToken) {
      const url = `${process.env.discover_api_host}/datasets/${datasetId}`
      var datasetUrl = datasetVersion ? `${url}/versions/${datasetVersion}` : url
      if (userToken) {
        datasetUrl += `?api_key=${userToken}`
      }
      return await axios.$get(datasetUrl).catch(error => {
        console.log(`Could not get the dataset's info: ${error}`)
      })
    }
  }
}
