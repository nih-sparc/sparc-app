export default function ({ store, route, redirect }) {
  if (store.getters['user/cognitoUser'] && route.name !== 'welcome') {
    redirect("/welcome")
  }
}