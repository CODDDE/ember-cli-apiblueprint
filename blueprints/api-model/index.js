/* eslint-env node */
const existsSync = require('exists-sync');
const path = require('path');
const EOL = require('os').EOL;
const inflection = require('inflection');
const removeFromFile = require('../../lib/utilities/remove-from-file');

const {
  camelize,
  capitalize,
  dasherize
} = require('ember-cli-string-utils');

const { pluralize } = inflection;

module.exports = {
  description: '',

  locals(options) {
    // Return custom template variables here.
    return {
      capitalCamelizedModuleName: capitalize(camelize(options.entity.name)),
      // pluralizedModuleName: `${dasherize(options.entity.name)}s`,
      pluralizedModuleName: pluralize(dasherize(options.entity.name)),
      defaultModuleName: options.entity.name,
    };
  },

  sectionTitle: '# Data Structures' + EOL,

  /**
   * Import the created data structure into main apib file.
   * Also import generated group in appropiated files.
   *
   * @param {*} options
   */
  afterInstall(options) {
    const mainFile = path.join('api-blueprints', 'index.apib');
    if (!existsSync(mainFile)) {
      return;
    }
    const capitalCamelizedModuleName = capitalize(camelize(options.entity.name));
    const content = `<!-- include(api-models/${options.entity.name}.apib) -->`;
    const groupContent = `# Group ${capitalCamelizedModuleName} ${EOL}<!-- include(api-groups/${options.entity.name}/${options.entity.name}.apib) --> ${EOL}`;

    return this.insertIntoFile(mainFile, EOL + this.sectionTitle)
      .then(() => {
        return this.insertIntoFile(mainFile, content, {
          after: this.sectionTitle,
        });
      })
      .then(() => {
        return this.insertIntoFile(mainFile, groupContent, {
          before: this.sectionTitle,
        })
      });
  },

  afterUninstall(options) {
    const mainFile = path.join('api-blueprints', 'index.apib');
    if (!existsSync(mainFile)) {
      return;
    }

    const capitalCamelizedModuleName = capitalize(camelize(options.entity.name));
    const content = `<!-- include(api-models/${options.entity.name}.apib) -->`
    const groupContent = `# Group ${capitalCamelizedModuleName} ${EOL}<!-- include(api-groups/${options.entity.name}/${options.entity.name}.apib) --> ${EOL}`;

    return removeFromFile(mainFile, content)
      .then(() => removeFromFile(mainFile, groupContent) )
      .then((resultValue)=>{
        const clearSection = resultValue.contents.indexOf('include(api-models') === -1;

        if(clearSection){
          return removeFromFile(mainFile, this.sectionTitle);
        }

        return resultValue;
      })
  },
};
