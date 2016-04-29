# ScenicNinja

ScenicNinja uses your current location to find great views nearby. It utilizes the Google Places API to find parks and restaurants within 10km of your location that have reviews matching keywords like "panoramic" and "beautiful view". Anyone can use the service, but you'll need to sign-in with a Google account to save your favorite locations. Enjoy!

**Screenshot**  
<img src="http://i.imgur.com/Bj3RnoF.png" width="600px"/>  


## Team

  - __Product Owner__: Genevieve Sublette
  - __Scrum Master__: Thomas Ingalls
  - __Development Team Members__: Jonathen Chen, Hao Huang

## Table of Contents

1. [Overview](#overview)
2. [Usage](#usage)
3. [Requirements](#requirements)
4. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
5. [Team](#team)
6. [Contributing](#contributing)

## Overview

### Tech Stack
- [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/)
- [Node](https://nodejs.org/en/) and [Express](http://expressjs.com/)
- [Sequelize ORM](http://docs.sequelizejs.com/en/latest/) and [MySQL](https://www.mysql.com/)

#### Webpack
Webpack bundles dependencies into one file, so that all dependencies can be loaded into the DOM with a single `<script>` tag.  Webpack starts with an entry file (`App.js`) and traverses the project’s dependencies based on the `import` and `export` statements in the code. It uses a `webpack.config.js` file in the root directory to define which loaders are required for compilation and the destination of the output file.

#### React and Redux
On the client side, the state of the app is maintained in a Redux store. When a user interacts with the app (e.g. when the &hearts; is clicked, for example), an action is triggered, which tells the reducers how the state should update in response (e.g. add the place to the list of saved places). For more information, review the [Redux documentation](http://redux.js.org/index.html) and watch [Getting Started with Redux](https://egghead.io/series/getting-started-with-redux).
On the server side, we render the index page by initializing the Redux store (which determines the initial state of the app, including logged-in user data).

#### Schema
User data and saved places are managed in a MySQL database called `scenic`.
![Schema design]
(http://i.imgur.com/lag3WRs.png)

## Usage
You'll need API keys for [Google Places](https://developers.google.com/places/web-service/get-api-key) and for [Google Plus](https://developers.google.com/+/web/api/rest/oauth#acquiring-and-using-an-api-key). Add these to the config files in `/server/config`, following the format of the example files. Remove `.example` from the filename.
Ensure all [dependencies](#installing-dependencies) are installed. Start a MySQL server by running `mysql.server start`. Then, from within the root directory:
```
npm install
webpack
npm start
```

Visit `localhost:4568` in the browser.

## Requirements

- Node 0.10.x
- MySQL 5.7.11
- [Google Places API key](https://developers.google.com/places/web-service/get-api-key)
- [Google Plus API key](https://developers.google.com/+/web/api/rest/oauth#acquiring-and-using-an-api-key)
- [Flickr API key](https://www.flickr.com/services/apps/create/noncommercial)

## Development

### Installing Dependencies

From within the root directory:

```
npm install -g nodemon webpack
```

### Running Locally

To compile client-side code, run:
```
webpack --watch
```
`webpack --watch` will recompile a `bundle.js` file when any client-side JS files have changed, streamlining the development workflow.

In a separate shell, start the server by running:
```
npm install
npm run dev
```

Visit `localhost:4568` in the browser.

## Deployment
#### Initial Setup on Digital Ocean
- Set up your droplet with raw Ubuntu
- `apt` is the package manager on Ubuntu (it's like `brew`, but for Ubuntu)
- Do an apt update:  `sudo apt-get update`
- Install MySql:  `sudo apt-get install mysql-server`
- Enter a secure password when prompted and note it down as it will be added to `server/config/mysqlsetup.js` later
- Follow the below instructions for deploying new changes manually
- If you get `ERRCONN`, check `server/db/db.js` for correct credentials
- Ensure that the credentials in `db.js` match those exported in `server/config` files

#### Deploying New Changes
- Merge the production branch of the repo with the master branch
- Log in to the Digital Ocean droplet using: `ssh root@xxx.xxx.xxx.x` (get your droplet IP Address from Digital Ocean)
- If the `ssh` fails three times, you'll be prompted for the password
- Enter UNIX Password for your Digital Ocean droplet (if you need to reset it, go to the Access menu)
- Clone down your production repo, or `cd` into the root directory and run the following commands:

   `git pull origin master`  
   `npm install`  
   `webpack`  
   `cd server`  
   `ls` to see if the `config` directory exists, if not, create it as below  
   `mkdir config`  
   `cd config`  

- See if the below files are already on the server (`ls`). If not, add them using the following commands:

   `touch googleplus.js`  
   `touch googleplaces.js`  
   `touch mysqlsetup.js`  

- Update the file `googleplus.js` to contain the following:  
   ```
   module.exports = {  
     CLIENT_ID: 'enter-your-googleplus-api-key-here',  
     CLIENT_SECRET: 'enter-your-googleplus-api-key-here'  
   };
   ```

- Update the file `googleplaces.js` to contain the following:  
   ```
   module.exports = 'your-googleplaces-api-key-goes-here';  
   ```

- Update the file `mysqlsetup.js` to contain the following:  
   ```
   module.exports = 'your-serverside-mysql-password-goes-here';  
   ```

- Note that the Google Places API will limit you to 1,000 results per hour, and each request returns 200 results. When you've reached the limit, photos will stop rendering.

==============================

- `npm start`
- Go to `xxx.xxx.xx.x:4568` to see your site live


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
