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
  description: 'Adds a `hasMany` relationship to a model and the related calls to it´s group',
  
  availableOptions: [
    { name: 'to', type: String, default: 'Not present, model name is required' },
    { name: 'linked', type: Boolean, default: false },
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
      linked
    } = options;
    
    const targetModelFile = path.join('api-blueprints', 'api-models', `${name}.apib`);
    const sourceModelFile = path.join('api-blueprints', 'api-models', `${model}.apib`);
    if (!existsSync(sourceModelFile) || !existsSync(targetModelFile)) {
      throw `#### Error, either: \n ${sourceModelFile} \nor \n${targetModelFile} \ndoes not exist`
    }
    const sourceModelName = capitalize(camelize(model));
    const targetModelName = capitalize(camelize(name));
    const propertyName = inflection.pluralize(camelize(name));
    const resourceName = inflection.pluralize(dasherize(name));
    const nestedUnder = inflection.pluralize(dasherize(model));
    const description = `All ${propertyName} for this ${sourceModelName}`;
    
    let content = `+ ${propertyName} (object)${EOL}`;
    if (linked) {
      content += `${indent}+ links (object)${EOL}`
      content += `${indent}${indent}+ related: \`/api/v1/${nestedUnder}/1/relationships/${resourceName}\` (string, required) - ${description}`
    } else {
      content += `${indent}+ data (array[${targetModelName}]) - ${description}`
    }

    return this.insertIntoFile(sourceModelFile, content, {
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
