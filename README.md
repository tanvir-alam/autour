# Autour

Test development for Autour, a "get-me-out-of-here" travel app that finds destinations you can fly to based on your budget and travel dates. The app uses Node.js, Express.js, AngularJS and Twitter Bootstrap. 

## Getting started 

1. Install the latest stable version of [Node.js] (https://nodejs.org/en/download/).
  * To check if Node.js is installed type `node -v` in Terminal/Command Prompt. If installed, it should show the installed Node version.
2. Install `npm` if not installed already (Node.js installation usually includes `npm`).
  * To check if `npm` is installed type `npm -v` in Terminal/Command Prompt. If installed, it should show the installed `npm` version.
3. Install [nodemon] (https://www.npmjs.com/package/nodemon).
  * Nodemon automatically detects changes in code and restarts the server. It helps us avoid manually starting and stopping the local server after every little code change during development.
  ```
  npm install -g nodemon
  ```

### Source code

1. Clone the Git repository into a local directory.
  ```
  cd /path/to/directory
  git clone https://github.com/tanvir-alam/autour.git autour
  ```

2. Install modules/dependencies. The following command will install all the modules/dependencies listed in `package.json` into the `node_modules` directory.
  ```
  cd autour
  npm install
  ```

3. Replace the tokenized configuration in `config/sabre_config.js` with Sabre credentials (ask Tanvir).


## Starting local server

During development, Nodemon is extremely useful it automatically detects changes in code and restarts the server. To start the server using Nodemon, navigate to the directory where the repository is cloned and use the command:
```
nodemon bin/www
```

In general cases, the server can be started using:
```
node bin/www
```

## Folder structure

```
autour
  |--bin
  |   |--www        // server configuration file
  |
  |--config         // application configuration files
  |    |--...
  |    |--...
  |
  |--node-modules   // installed modules/dependencies
  |    |--...
  |    |--...
  |
  |--public     // front-end part of the application
  |    |--images        // all the images used in the site
  |    |--stylesheets   // all the CSS
  |    |--app.js        // AngularJS file with routing and directives
  |    |--index.html    // main HTML page
  |
  |--routes
  |    |--index.js      // Express.js routing for search, etc.
  |
  |--app.js             // basic Express.js routing
  |--package.json       // file containing list of modules/dependencies
```