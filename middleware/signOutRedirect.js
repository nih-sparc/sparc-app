export default function ({ redirect, app }) {
  const authRedirectUrl = app.$cookies.get('sign-out-redirect-url')
  if (authRedirectUrl) {
    app.$cookies.set('sign-out-redirect-url', null)
    redirect(authRedirectUrl)
  }
}
