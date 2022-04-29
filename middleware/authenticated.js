export default function({ redirect, app }) {
  const userToken = app.$cookies.get('user-token')
  if (!userToken) {
    return redirect('/')
  }
}
