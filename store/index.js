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
    await dispatch('pages/contact-us/fetchContactUsFormOptions');
    await dispatch('layouts/default/fetchFooterData');
    await dispatch('user/fetchUser');
  },
};

export default {
  actions
}
