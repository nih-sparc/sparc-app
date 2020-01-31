export const state = () => ({
  disableScrolling: false
})

export const mutations = {
  UPDATE_DISABLED_SCROLLING(state, data) {
    state.disableScrolling = data
  }
}

export const actions = {
  updateDisabledScrolling: ({ commit }, state) => {
    commit('UPDATE_DISABLED_SCROLLING', state)
  }
}
