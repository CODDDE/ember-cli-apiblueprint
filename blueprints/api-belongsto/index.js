/* eslint-env node */
const existsSync = require('exists-sync');
const path = require('path');
const EOL = require('os').EOL;

const {
  camelize,
  capitalize,
  dasherize
} = require('ember-cli-string-utils');

module.exports = {
  description: 'Adds a `belongTo` relationship to a model and the related calls to it´s group',
  
  availableOptions: [
    { name: 'to', type: String, default: 'Not present, model name is required' },
  ],

  locals(options) {
    // Return custom template variables here.
    return {
      targetModel: options.to,
      camelizedTarget: camelize(options.to),
      capitalizedCamelizedTarget: capitalize(camelize(options.to)),
      pluralizedTargetName: `${dasherize(options.to)}s`,
      capitalCamelizedModuleName: capitalize(camelize(options.entity.name)),
    };
  },
  
  fileMapTokens() {
    // Return custom tokens to be replaced in your files.
    return {
      __modelname__(options) {
        // Logic to determine value goes here.
        return options.locals.targetModel;
      }
    }
  },
  
  beforeInstall(options) {
    const {
      entity: {
        name,
      },
      to: model,
    } = options;
    
    const targetModel = path.join('api-blueprints', 'api-models', `${name}.apib`);
    const sourceModel = path.join('api-blueprints', 'api-models', `${model}.apib`);
    if (!existsSync(sourceModel) || !existsSync(targetModel)) {
      throw `#### Error, either: \n ${sourceModel} \nor \n${targetModel} \ndoes not exist`
    }
    
    let content = `+ ${camelize(name)} (${capitalize(camelize(name))}Type) - related object`;

    return this.insertIntoFile(sourceModel, content, {
      after: `## ${capitalize(camelize(model))}Relationships (object)${EOL}`
    })
  },

  afterInstall(options) {
    const {
      entity: {
        name,
      },
      to: model,
    } = options;
    
    const sourceModelGroup = path.join(
      'api-blueprints',
      'api-groups',
      model,
      `${model}.apib`
    );
    
    let relationshipCalls = `${EOL}<!-- include(./relationships/${dasherize(name)}.apib) -->`
    
    return this.insertIntoFile(sourceModelGroup, relationshipCalls);
    
  }
};
