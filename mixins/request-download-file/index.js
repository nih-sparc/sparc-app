import { compose, last, defaultTo, split, propOr } from 'ramda'
import FileDownload from 'js-file-download'

export default {
  methods: {
    /**
     * Request download file via axios. This will file will be saved on the users computer with file name "fileName"
     */
    requestDownloadFile: function(downloadInfo) {
      const fileName = propOr('', 'name', downloadInfo)
      const datasetVersionRegexp = /s3:\/\/pennsieve-prod-discover-publish-use1\/(?<datasetId>\d*)\/(?<version>\d*)\/(?<filePath>.*)/
      const matches = downloadInfo.uri.match(datasetVersionRegexp)

      const payload = {
        data: {
          paths: [matches.groups.filePath],
          datasetId: matches.groups.datasetId,
          version: matches.groups.version
        }
      }
      this.$axios.$post(process.env.zipit_api_host, payload).then(response => {
        FileDownload(response, fileName)
      })
    },
    /**
     * Request file contents via axios. This returns a promise which resolves to the contents of the file to then be used withing sparc-app (ie to display markdown)
     */
    requestFileContent(downloadInfo) {
      return new Promise(resolve => {
        const datasetVersionRegexp = /s3:\/\/pennsieve-prod-discover-publish-use1\/(?<datasetId>\d*)\/(?<version>\d*)\/(?<filePath>.*)/
        const matches = downloadInfo.uri.match(datasetVersionRegexp)

        const payload = {
          data: {
            paths: [matches.groups.filePath],
            datasetId: matches.groups.datasetId,
            version: matches.groups.version
          }
        }
        this.$axios
          .$post(process.env.zipit_api_host, payload)
          .then(response => {
            resolve(response)
          })
      })
    }
  }
}
