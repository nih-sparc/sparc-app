import createClient from "~/plugins/contentful";
import { propOr } from 'ramda'

const client = createClient()

let redirectsMapping = {}

client.getEntry(process.env.ctf_documentation_hub_redirects_id).then(({fields}) => {
  redirectsMapping = propOr({}, 'redirectsMapping', fields)
})

export default function getRedirectsMapping() {
  return redirectsMapping
}
