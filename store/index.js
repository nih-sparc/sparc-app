import createClient from "~/plugins/contentful";

export const state = () => ({
  disableScrolling: false,
  footerData: {}
})

export const mutations = {
  UPDATE_DISABLED_SCROLLING(state, data) {
    state.disableScrolling = data
  },
  SET_FOOTER_DATA(state, data) {
    state.footerData = data
  }
}

export const actions = {
  updateDisabledScrolling: ({ commit }, state) => {
    commit('UPDATE_DISABLED_SCROLLING', state)
  },
  async nuxtServerInit({ commit }) {
    try {
      const client = createClient()
      const response = await client.getEntry(process.env.ctf_footer_copy_id)
      commit('SET_FOOTER_DATA', response.fields.copy)
    } catch (e) {
      console.error(e)
    }
  }
}
