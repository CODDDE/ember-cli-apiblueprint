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
  description: 'Adds a `hasMany` relationship to a model and the related calls to it´s group',
  
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
      pluralizedName: `${dasherize(options.entity.name)}s`,
      pluralCamelizedModuleName: camelize(options.entity.name) + 's',
    };
  },

  fileMapTokens() {
    // Return custom tokens to be replaced in your files.
    return {
      __modelname__(options) {
        // Logic to determine value goes here.
        return options.locals.targetModel;
      },
      __pluralname__(options) {
        return options.locals.pluralizedName;
      },
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
    
    let content = `+ ${camelize(name)}s (array[${capitalize(camelize(name))}Type]) - related objects`;

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
    const pluralizedModelName = dasherize(name) + 's';
    let relationshipCalls = `${EOL}<!-- include(./relationships/${pluralizedModelName}.apib) -->`
    
    return this.insertIntoFile(sourceModelGroup, relationshipCalls);
    
  }
};
