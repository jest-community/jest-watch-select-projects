const prompts = require('prompts');
const ansiEscapes = require('ansi-escapes');
const { readConfig } = require('jest-config');

class JestPluginProjects {
  constructor() {
    this._selectedProjects = {};
  }

  apply(jestHook) {
    jestHook.shouldRunTestSuite(
      ({ testPath, config: { displayName } }) =>
        displayName === undefined ||
        this._selectedProjects[displayName] === undefined ||
        this._selectedProjects[displayName],
    );
  }

  onKey() {}

  _getProjectNames({ projects }) {
    if (!this._projectNames) {
      this._projectNames = projects
        .map(
          projectPath => readConfig({}, projectPath).projectConfig.displayName,
        )
        .filter(Boolean);
    }

    return this._projectNames;
  }

  run(globalConfig) {
    console.log(ansiEscapes.clearScreen);
    const projectNames = this._getProjectNames(globalConfig);

    return prompts([
      {
        type: 'multiselect',
        name: 'activeProjects',
        message: 'Select projects',
        choices: projectNames.map(name => ({
          title: name,
          value: name,
          selected:
            this._selectedProjects[name] === undefined ||
            this._selectedProjects[name],
        })),
      },
    ]).then(({ activeProjects }) => {
      this._selectedProjects = projectNames.reduce((memo, name) => {
        memo[name] = activeProjects.includes(name);
        return memo;
      }, {});
      process.stdin.setRawMode(true);
      process.stdin.resume();
      return true;
    });
  }

  getUsageInfo() {
    return {
      key: 'P',
      prompt: 'select projects. ',
    };
  }
}

module.exports = JestPluginProjects;
