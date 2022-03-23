export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}

const actions = {
  async nuxtServerInit({dispatch}) {
      await dispatch('layouts/default/fetchFooterData');
  },
};

export default {
  actions
}
