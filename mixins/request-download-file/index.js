import { compose, last, defaultTo, split, propOr } from 'ramda'
import FileDownload from 'js-file-download'

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

      this.$axios.$post(process.env.zipit_api_host, payload).then((response) => {
        FileDownload(response, fileName)
      })
    },
}
}
