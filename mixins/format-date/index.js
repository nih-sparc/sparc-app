import moment from 'moment'

export default {
  methods: {
    /**
     * Format date for display
     * @param {Date} date
     * @returns {String}
     */
    formatDate: function (date) {
      return moment.utc(date).format('MMMM D, YYYY')
    }
  }
}
