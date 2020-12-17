import { compose, last, defaultTo, split, propOr } from 'ramda'

export default {
  methods: {
    /**
     * Request download file via axios.
     */
    requestDownloadFile: function(downloadInfo) {
      const fileName = propOr('', 'name', downloadInfo)
      const datasetVersionRegexp = /s3:\/\/blackfynn-discover-use1\/(?<datasetId>\d*)\/(?<version>\d*)\/(?<filePath>.*)/;
      const matches = downloadInfo.uri.match(datasetVersionRegexp)

      const payload = {
        data: {
          paths: [matches.groups.filePath],
          datasetId: matches.groups.datasetId,
          version: matches.groups.version
        }
      }

      this.$axios.post(process.env.zipit_api_host, payload).then((response) => {
        this._downloadFile(fileName, response)
      })
    },
  /**
   * Create an `a` tag to trigger downloading file
   * @param {String} filename
   * @param {String} url
   */
  _downloadFile: function(filename, url) {
    const el = document.createElement('a')
    el.setAttribute('href', url)
    el.setAttribute('download', filename)

    el.style.display = 'none'
    document.body.appendChild(el)

    el.click()

    document.body.removeChild(el)
  },
}
}
