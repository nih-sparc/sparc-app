import createClient from '~/plugins/contentful'
import { pathOr } from 'ramda'

export const state = () => ({
  disableScrolling: false,
  footerData: {},
  hasAcceptedGDPR: false,
  portalNotification: {},
  hasSeenPortalNotification: false
})

export const mutations = {
  UPDATE_DISABLED_SCROLLING(state, data) {
    state.disableScrolling = data
  },
  SET_FOOTER_DATA(state, data) {
    state.footerData = data
  },
  SET_HAS_ACCEPTED_GDPR(state, hasAcceptedGDPR) {
    state.hasAcceptedGDPR = hasAcceptedGDPR
  },
  SET_HAS_SEEN_PORTAL_NOTIFICATION(state, hasSeen) {
    state.hasSeenPortalNotification = hasSeen
  },
  SET_PORTAL_NOTIFICATION(state, data) {
    state.portalNotification = data
  },
}

export const actions = {
  updateDisabledScrolling: ({ commit }, state) => {
    commit('UPDATE_DISABLED_SCROLLING', state)
  },
  setHasAcceptedGdpr: ({ commit }, state) => {
    commit('SET_HAS_ACCEPTED_GDPR', state)
  },
  setPortalNotification: ({ commit }, state) => {
    commit('SET_PORTAL_NOTIFICATION', state)
  },
  setHasSeenPortalNotification: ({ commit }, state) => {
    commit('SET_HAS_SEEN_PORTAL_NOTIFICATION', state)
  },
  async fetchPortalNotification({ commit, dispatch }) {
    try {
      const client = createClient()
      const response = await client.getEntry(process.env.ctf_portal_notification_entry_id)
      dispatch('setPortalNotification', response.fields)
      const newNotificationMessage = pathOr('', ['fields', 'message'], response)
      const oldNotificationMessage = this.$cookies.get('PortalNotificationMessage')
      // If the message has changes then reset if the user has seen it to false
      if (newNotificationMessage != oldNotificationMessage) {
        const expirationDate = new Date(today.setDate(today.getDate() + 30))
        this.$cookies.set('PortalNotification:hasBeenSeen', false, { expires: expirationDate })
        this.$cookies.set('PortalNotificationMessage', newNotificationMessage)
      }
      const hasSeenPortalNotification = this.$cookies.get('PortalNotification:hasBeenSeen')
      dispatch('setHasSeenPortalNotification', hasSeenPortalNotification)
    } catch (e) {
      console.error(e)
    }
  },
  async fetchFooterData({ commit, dispatch }) {
    try {
      const client = createClient()
      const response = await client.getEntry(process.env.ctf_footer_copy_id)
      commit('SET_FOOTER_DATA', response.fields)

      // Load GDPR cookie info
      const hasAcceptedGDPR = this.$cookies.get('GDPR:accepted')
      dispatch('setHasAcceptedGdpr', hasAcceptedGDPR)
    } catch (e) {
      console.error(e)
    }
  }
}
