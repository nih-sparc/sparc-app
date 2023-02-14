export default function({ redirect, app, store }) {
  const userToken = app.$cookies.get('user-token') || store.getters['user/cognitoUserToken']
  if (!userToken) {
    return redirect('/')
  }
}
