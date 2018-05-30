[![Build Status](https://travis-ci.org/jest-community/jest-watch-select-project.svg?branch=master)](https://travis-ci.org/jest-community/jest-watch-select-project) [![npm version](https://badge.fury.io/js/jest-watch-select-project.svg)](https://badge.fury.io/js/jest-watch-select-project)

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://cdn.worldvectorlogo.com/logos/jest.svg">
  </a>
  <h1>jest-watch-select-project</h1>
  <p>Select which Jest project to run</p>
</div>

![select-projects](https://user-images.githubusercontent.com/574806/40687850-d23ec5ea-6350-11e8-8a8d-a72b7faf2163.gif)

## Usage

### Install

Install `jest`_(it needs Jest 23+)_ and `jest-watch-select-project`

```bash
yarn add --dev jest jest-watch-select-project

# or with NPM

npm install --save-dev jest jest-watch-select-project
```

### Add it to your Jest config

In your `package.json`

```json
{
  "jest": {
    "watchPlugins": ["jest-watch-select-project"]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  watchPlugins: ['jest-watch-select-project']
};
```

### Run Jest in watch mode

```bash
yarn jest --watch
```
