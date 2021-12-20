export const state = () => ({
  datasetInfo: {},
  datasetTypeName: "",
  showAllVersionsModal: false
})

export const mutations = {
  SET_DATASET_INFO(state, data) {
    state.datasetInfo = data
  },
  SET_DATASET_TYPE_NAME(state, data) {
    state.datasetTypeName = data
  },
}

export const actions = {
  setDatasetInfo: ({ commit }, state) => {
    commit('SET_DATASET_INFO', state)
  },
  setDatasetTypeName: ({ commit }, state) => {
    commit('SET_DATASET_TYPE_NAME', state)
  },
}