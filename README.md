# SPARC WEB APPLICATION
This is the repository for the SPARC-Portal Web Application. The application is build using [Nuxt.js](https://nuxtjs.org) and [Vue.js](https://vuejs.org/).

It depends on the SPARC-API which can be found [here](https://github.com/nih-sparc/sparc-api) 

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
## Important Note on Running Locally

Ensure that the following configuration variables are set in your environment prior to running (values can be obtained once you are given access to the sparc-portal developer apps on Heroku):
* ALGOLIA_API_KEY
* ALGOLIA_APP_ID
* PENNSIEVE_API_HOST
* PENNSIEVE_API_SECRET
* PENNSIEVE_API_TOKEN
* CTF_SPACE_ID
* CTF_CDA_ACCESS_TOKEN
* CTF_API_HOST
* DEPLOY_ENV
* PORTAL_API_HOST


For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
