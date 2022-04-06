export default function ({ store, route, redirect }) {
  if (store.getters['user/cognitoUser'] && !store.getters['user/profileComplete'] && route.name !== 'welcome') {
    redirect("/welcome")
  }
}