export const state = () => ({
  datasetInfo: {},
  datasetType: "",
  showAllVersionsModal: false
})

export const mutations = {
  SET_DATASET_INFO(state, data) {
    state.datasetInfo = data
  },
  SET_DATASET_TYPE(state, data) {
    state.datasetType = data
  },
  SHOW_ALL_VERSIONS_MODAL(state, data) {
    state.showAllVersionsModal = data
  },
}

export const actions = {
  setDatasetInfo: ({ commit }, state) => {
    commit('SET_DATASET_INFO', state)
  },
  setDatasetType: ({ commit }, state) => {
    commit('SET_DATASET_TYPE', state)
  },
  showAllVersionsModal: ({ commit }, state) => {
    commit('SHOW_ALL_VERSIONS_MODAL', state)
  }
}