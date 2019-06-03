const chalk = require('chalk');
const prompts = require('prompts');
const ansiEscapes = require('ansi-escapes');
const path = require('path');

class JestPluginProjects {
  constructor() {
    this._activeProjects = {};
    this._projectNames = [];
  }

  apply(jestHook) {
    jestHook.onFileChange(({ projects }) => this._setProjects(projects));
    jestHook.shouldRunTestSuite(({ testPath, config }) => {
      const name = config.displayName || path.basename(config.rootDir);
      return (
        this._activeProjects[name] === undefined || this._activeProjects[name]
      );
    });
  }

  onKey() {}

  _setProjects(projects) {
    if (!this._projectNames.length) {
      const projectNameSet = projects.reduce((state, p) => {
        const { displayName, rootDir } = p.config;
        if (state.has(displayName)) {
          throw new Error(`

Found multiple projects with the same \`displayName\`: "${displayName}"

Change the \`displayName\` on at least one of them to prevent name collision.
    - More info: https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig

            `);
        }

        const basename = path.basename(rootDir);
        if (state.has(basename)) {
          throw new Error(`

Found multiple projects with the same directory basename: "${basename}"

Add a \`displayName\` to at least one of them to prevent name collision.
    - More info: https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig

            `);
        }

        return new Set([...state, displayName || basename]);
      }, new Set());

      this._projectNames = [...projectNameSet];
      this._setActiveProjects(this._projectNames);
    }
  }

  _setActiveProjects(activeProjects) {
    this._numActiveProjects = activeProjects.length;
    this._activeProjects = this._projectNames.reduce((memo, name) => {
      memo[name] = activeProjects.includes(name);
      return memo;
    }, {});
  }

  run(globalConfig) {
    console.log(ansiEscapes.clearScreen);
    return prompts([
      {
        type: 'multiselect',
        name: 'activeProjects',
        message: 'Select projects',
        choices: this._projectNames.map(value => ({
          value,
          selected: this._activeProjects[value],
        })),
      },
    ]).then(({ activeProjects }) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();

      if (activeProjects !== undefined) {
        this._setActiveProjects(activeProjects);
        return true;
      }
      return Promise.reject();
    });
  }

  _getActiveProjectsText() {
    const numProjects = this._projectNames.length;

    if (this._numActiveProjects === numProjects) {
      return '(all selected)';
    } else if (this._numActiveProjects === 0) {
      return '(zero selected)';
    } else {
      return `(${this._numActiveProjects}/${numProjects} selected)`;
    }
    return;
  }

  getUsageInfo() {
    return {
      key: 'P',
      prompt: `select projects ${chalk.italic(this._getActiveProjectsText())}`,
    };
  }
}

module.exports = JestPluginProjects;
