/* eslint-env node */
const existsSync = require('exists-sync');
const path = require('path');
const EOL = require('os').EOL;
var inflection = require('inflection');

const {
  camelize,
  capitalize,
  dasherize
} = require('ember-cli-string-utils');

const indent = '    ';

module.exports = {
  description: 'Adds a `belongTo` relationship to a model and the related calls to it´s group',
  
  availableOptions: [
    { name: 'to', type: String, default: 'Not present, model name is required' },
    { name: 'required', type: Boolean, default: false, description: 'Mark this relationship required to create an instance of the main resource',
      aliases: [
        { 'r': true}
      ]
    },
    { name: 'modeltype', type: String, description: 'Name of the model thah has to be related, defaults to relationship name (singularized)' }
  ],

  locals(options) {
    // Return custom template variables here.
    const modelType = options.modeltype || options.entity.name;
    return {
      targetModel: options.to,
      camelizedTarget: camelize(options.to),
      capitalizedCamelizedTarget: capitalize(camelize(options.to)),
      pluralizedTargetName: `${dasherize(options.to)}s`,
      capitalCamelizedModuleName: capitalize(camelize(options.entity.name)),
      capitalCamelizedModelType: capitalize(camelize(modelType)),
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
      required
    } = options;
    const modelType = options.modeltype || options.entity.name;
    
    const targetModelFile = path.join('api-blueprints', 'api-models', `${modelType}.apib`);
    const sourceModelFile = path.join('api-blueprints', 'api-models', `${model}.apib`);
    if (!existsSync(sourceModelFile) || !existsSync(targetModelFile)) {
      throw `#### Error, either: \n ${sourceModelFile} \nor \n${targetModelFile} \ndoes not exist`
    }
    
    const sourceModelName = capitalize(camelize(model));
    const targetModelName = capitalize(camelize(modelType));
    const resourceName = dasherize(name);
    const description = `The ${camelize(name)} for this ${sourceModelName}`;
    
    const relationshipSection = `## ${sourceModelName}${required ? 'RequiredRelationships' : 'OptionalRelationships'} (object)${EOL}`;
    
    let content = `+ \`${resourceName}\` (object)${EOL}`;
    content += `${indent}+ data (${targetModelName}Type) - ${description}`;

    return this.insertIntoFile(sourceModelFile, content, {
      after: relationshipSection
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
