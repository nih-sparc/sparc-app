# SPARC WEB APPLICATION
This is our fork of the repository for the SPARC-Portal Web Application used to showcase [KnowMore](https://github.com/SPARC-FAIR-Codeathon/KnowMore). The application is build using [Nuxt.js](https://nuxtjs.org) and [Vue.js](https://vuejs.org/).

## Prerequisites 
We recommend using Anaconda to create and manage your development environments for KnowMore. All the subsequent instructions are provided assuming you are using [Anaconda (Python 3 version)](https://www.anaconda.com/products/individual).

## Setup

### Clone repo
Clone the repo and submodules
```
git clone https://github.com/SPARC-FAIR-Codeathon/KnowMore.git --recurse
```

### cd into this repo

Open Anaconda prompt (Windows) or the system Command line interface then naviguate to the this folder
```sh
cd ./sparc-app
```

### Setup conda env
```sh
$ conda create -n "sparc-app-env" nodejs=12.14.1 yarn
$ conda activate sparc-app-env
```

### Install dependencies
``` 
$ yarn install
``` 

### Setup env vars
The environment variables required are listed in the table below along with information on how to get them

<table>
<thead>
  <tr>
    <th>Suggested name</th>
    <th>Value or instructions for obtaining it</th>
    <th>Purpose</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>PORTAL_API_HOST</td>
    <td>"http://localhost:3000"</td>
    <td>frontend url</td>
  </tr>
  <tr>
    <td>FLASK_API_HOST</td>
    <td>"localhost:5000"</td>
    <td>Url of flask server</td>
  </tr>
  <tr>
    <td> CTF_SPACE_ID</td>
    <td>get from project admin</td>
    <td></td>
  </tr>
  <tr>
    <td>CTF_CDA_ACCESS_TOKEN</td>
    <td>get from project admin</td>
    <td></td>
  </tr>
  <tr>
    <td>CTF_API_HOST</td>
    <td>cdn.contentful.com</td>
    <td></td>
  </tr>
  <tr>
    <td>SCICRUNCH_API_KEY</td>
    <td>get from project admin</td>
    <td>API key to access scicrunch</td>
  </tr>
  <tr>
    <td>ALGOLIA_API_KEY</td>
    <td>get from project admin</td>
    <td>API key to access Algolia, so frontend can do searches</td>
  </tr>
  <tr>
    <td>ALGOLIA_APP_ID</td>
    <td>get from project admin</td>
    <td>API id to access Algolia, so frontend can do searches</td>
  </tr>
</tbody>
</table>


Each of them can be set in your conda environment as follows
```sh
$ conda env config vars set MY_VAR=value1 MY_OTHER_VAR=value2
```

### serve with hot reload at localhost:3000
```
$ yarn dev
```

## Build for production and launch server
```
$ yarn build
$ yarn start
```

## Generate static project
```
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

