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
* BLACKFYNN_API_HOST
* BLACKFYNN_API_SECRET
* BLACKFYNN_API_TOKEN
* CTF_SPACE_ID
* CTF_CDA_ACCESS_TOKEN
* CTF_API_HOST
* DEPLOY_ENV
* PORTAL_API_HOST


For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## External dependencies:

#### Sparc-api 
**Source:** https://github.com/nih-sparc/sparc-api/  \
**Summary:** Python backend  \
**Used on sparc-app for:** Sparc-app's back end  \
**Critical:** yes  

#### Flatmaps
**Source:** uknown  \
**Summary:** Neural path map  \
**Used on sparc-app for:** Displaying neruon maps  \
**Critical:** Critcal to the /maps and /flatmap-viewer pages  

#### Pennsieve Discover API
**Source:** https://developer.pennsieve.io/api/index.html  \
**Summary:** API endpoint for the Pennsieve Discover data management platform  \
**Used on sparc-app for:** Retrieving dataset metadata   \
**Critical:** yes  

#### Pennsieve API
**Source:** https://developer.pennsieve.io/api/index.html  \
**Summary:** API endpoint for the Pennsieve  data management platform  \
**Used on sparc-app for:** Retrieving dataset metadata and files  \
**Critical:** yes  

#### Zipit
**Source:** uknown  \
**Summary:** Zips files  \
**Used on sparc-app for:** Zipping files  \
**Critical:** yes?  

#### Contentful
**Source:** https://www.contentful.com/  \
**Summary:** Content management platfrom  \
**Used on sparc-app for:** Contains a lot of content displayed on sparc-app. Allows changes to be made without having to modify the code  \
**Critical:** yes  

### Algolia
**Source:** https://www.algolia.com/  \
**Summary:** Search service  \
**Used on sparc-app for:** Stores scicrunch and discover data to make it quickly searchable. (Algolia searches come from the front end for sparc-app)  \
**Critical:** yes  


#### Biolucida 
**Source:** https://www.mbfbioscience.com/biolucida  \
**Summary:** Image viewer and image repository  \
**Used on sparc-app for:** Displaying images and image metadata  \
**Critical:** Critical for image display  
