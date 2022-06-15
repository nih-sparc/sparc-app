import getRedirectsMapping from "~/plugins/documentation-hub-redirects";
import { propOr } from 'ramda'

export default function ({ route, redirect }) {
  const redirectsMapping = getRedirectsMapping()
  const redirectUrls = propOr([], 'redirectUrls', redirectsMapping)
  redirectUrls.forEach(redirectUrl => {
    if (route.path.includes(redirectUrl.oldUrl)) {
      redirect(redirectUrl.newUrl)
    }
  })
}
