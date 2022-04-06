import { Auth } from '@aws-amplify/auth'
import { pathOr } from 'ramda'

export const state = () => ({
  cognitoUser: null,
  pennsieveUser: null,
  loginError: '',
  logoutError: '',
})

export const mutations = {
  SET_COGNITO_USER(state, data){
    state.cognitoUser = data
  },
  SET_PENNSIEVE_USER(state, data){
    state.pennsieveUser = data
  },
}

export const actions = {
  async login({ dispatch }, providerName){
    state.loginError = ''
    try {
      await Auth.federatedSignIn({customProvider: providerName})
      await dispatch('fetchCognitoUser')
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
      await dispatch('fetchCognitoUser')
    }
    catch(err){
      console.log(`Logout Error [${err}]`)
      state.logoutError = err.message
    }
  },
  async fetchCognitoUser({ commit }){
    const session = await Auth.currentSession()
    if (session) {
      const user = await Auth.currentAuthenticatedUser()
      commit('SET_COGNITO_USER', user)
      const userToken = pathOr('', ['signInUserSession', 'accessToken', 'jwtToken'], user)
      if (userToken) {
        const request = `https://api.pennsieve.net/user?api_key=${userToken}`
        await this.$axios.$get(request).then(response => {
          commit('SET_PENNSIEVE_USER', response)
        })
        .catch(err => {
          console.log(`Error retrieving pennsieve user: ${err}`)
        })
      }
      else {
        commit('SET_PENNSIEVE_USER', null)
      }
    }
  },
}

export const getters = {
  cognitoUser (state) {
    return state.cognitoUser
  },
  pennsieveUser (state) {
    return state.pennsieveUser
  },
  pennsieveUsername (state, getters) {
    const firstName = pathOr('', ['firstName'], getters.pennsieveUser)
    const lastName = pathOr('', ['lastName'], getters.pennsieveUser)
    return `${firstName} ${lastName[0]}.`
  },
  cognitoUsername (state, getters) {
    return pathOr('', ['username'], getters.cognitoUser)
  },
  cognitoUserToken (state, getters) {
    return pathOr('', ['signInUserSession', 'accessToken', 'jwtToken'], getters.cognitoUser)
  },
  cognitoUserAttributes (state, getters) {
    return pathOr({}, ['attributes'], getters.cognitoUser)
  },
  pennsieveUserIntId (state, getters) {
    return pathOr('', ['intId'], getters.pennsieveUser)
  },
  profileColor (state, getters) {
    return pathOr('', ['color'], getters.pennsieveUser)
  },
  profileUrl (state, getters) {
    return pathOr('', ['url'], getters.pennsieveUser)
  },
  profilePreferredOrganization (state, getters) {
    return pathOr('', ['preferredOrganization'], getters.pennsieveUser)
  },
  profileEmail (state, getters) {
    return pathOr('', ['email'], getters.pennsieveUser)
  },
  profileComplete (state, getter) {
    const isEmailSet = !getters.profileEmail.includes('pennsieve')
    const sparcTermsOfServiceAccepted = pathOr('', ['customTermsOfService'], getters.pennsieveUser)
    const pennsieveTermsOfService = pathOr('', ['pennsieveTermsOfService'], getters.pennsieveUser)

    return isEmailSet && sparcTermsOfServiceAccepted && pennsieveTermsOfService
  }
}
