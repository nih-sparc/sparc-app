import auth from '@/services/auth'
import { pathOr, isEmpty } from 'ramda'

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
      await auth.signIn(providerName)
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
      await auth.signOut()
      await dispatch('fetchUser')
    }
    catch(err){
      console.log(`Logout Error [${err}]`)
      state.logoutError = err.message
    }
  },
  async fetchUser({ commit }){
    const user = await auth.user()
    const token = pathOr(null, ['signInUserSession', 'accessToken', 'jwtToken'], user)
    const unixExpirationDate = pathOr('', ['signInUserSession', 'accessToken', 'payload', 'exp'], user)
    const expirationDate = unixExpirationDate ? new Date(unixExpirationDate * 1000) : null
    this.$cookies.set('user-token', token, expirationDate)
    commit('SET_COGNITO_USER', user)
    const profile = await auth.userProfile()
    commit('SET_PENNSIEVE_USER', profile)
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
  firstName (state, getters) {
    return pathOr('', ['firstName'], getters.pennsieveUser)
  },
  lastName (state, getters) {
    return pathOr('', ['lastName'], getters.pennsieveUser)
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
  profileComplete (state, getters) {
    const isEmailSet = !getters.profileEmail.includes('pennsieve')
    const sparcTermsOfServiceAccepted = !isEmpty(pathOr('', ['customTermsOfService'], getters.pennsieveUser))
    const pennsieveTermsOfServiceAccepted = !isEmpty(pathOr('', ['pennsieveTermsOfService'], getters.pennsieveUser))

    return isEmailSet && sparcTermsOfServiceAccepted && pennsieveTermsOfServiceAccepted
  }
}
