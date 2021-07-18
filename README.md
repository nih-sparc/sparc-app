# SPARC WEB APPLICATION
This is the repository for the SPARC-Portal Web Application. The application is build using [Nuxt.js](https://nuxtjs.org) and [Vue.js](https://vuejs.org/).

It depends on the SPARC-API which can be found [here](https://github.com/nih-sparc/sparc-api) 

## Build Setup

``` bash
# install dependencies
$ yarn install

# set env vars
export CTF_SPACE_ID=...
...
# (see below for what to set)

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# KNOWN ISSUES
- hot reload for frontend server isn't working, seems like each time it reloads it starts reading on a path that prepends the prefix (`sparc-app`) Everytime.
    * e.g., first time it's correct (`http://localhost:3000/sparc-app/enrich-data-for-datasets`)
    * second time it prepends the prefix again (`http://localhost:3000/sparc-app/sparc-app/enrich-data-for-datasets`)
    * third time it adds the prefix again, and so on

    * To solve, just restart the dev server and start again using `yarn dev`

## Other Debugging
### ERROR TypeError: Cannot read property 'isString' of undefined
This can happen even if all data for graph vis is correct, but there's some other error that happens before vega finishes that messes stuff up. Probably need better error handling so this doesn't happen...but it's happening, so just know that the vega spec can be perfect but this still happens

# ENV VARS to set
e.g., 

```
export CTF_SPACE_ID=
export CTF_CDA_ACCESS_TOKEN=
export CTF_API_HOST=
export CTF_API_HOST=
export SCICRUNCH_API_KEY=
export PORTAL_API_HOST=http://localhost:3000
export FLASK_API_HOST=http://localhost:5000
```
