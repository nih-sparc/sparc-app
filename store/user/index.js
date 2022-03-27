import { Auth } from '@aws-amplify/auth'
import { pathOr } from 'ramda'

export const state = () => ({
  loggedInUser: null,
  loginError: '',
  logoutError: '',
})

export const mutations = {
  SET_LOGGED_IN_USER(state, data){
    state.loggedInUser = data
  },
  UPDATE_USER_TOKEN(state, data) {
   state.userToken = data.token
  },
}

export const actions = {
  async login({ dispatch }, providerName){
    state.loginError = ''
    try {
      await Auth.federatedSignIn({customProvider: providerName})
      await dispatch('fetchUser')
    }
    catch(err){
      console.log(`Login Error [${err}]`)
      state.loginError = err.message
    }
  },
  async logout({ dispatch }){
    state.logoutError = ''
    try {
      await Auth.signOut()
      await dispatch('fetchUser')
    }
    catch(err){
      console.log(`Logout Error [${err}]`)
      state.logoutError = err.message
    }
  },
  async fetchUser({ commit }){
    const session = await Auth.currentSession()
    if (session) {
      const user = await Auth.currentAuthenticatedUser()
      commit('SET_LOGGED_IN_USER', user)
    }
  },
}

export const getters = {
  userToken (state, getters) {
    return pathOr('', ['signInUserSession', 'accessToken', 'jwtToken'], getters.user)
  },
  user (state) {
    return state.loggedInUser
  }
}