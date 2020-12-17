import { compose, last, defaultTo, split, propOr } from 'ramda'

export default {
  methods: {
    /**
     * Request download file via axios.
     */
    requestDownloadFile: function(downloadInfo) {
      const filePath = compose(
        last,
        defaultTo([]),
        split('s3://blackfynn-discover-use1/'),
        propOr('', 'uri'),
      )(downloadInfo)

      const fileName = propOr('', 'name', downloadInfo)

      const requestUrl = `${process.env.portal_api}/download?key=${filePath}`
      this.$axios.$get(requestUrl).then((response) => {
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
