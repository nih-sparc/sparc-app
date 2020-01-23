export const state = () => ({
  disableScrolling: false
})

export const mutations = {
  updateDisableScrolling(state, data) {
    state.disableScrolling = data
  }
}
