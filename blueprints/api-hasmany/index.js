/* eslint-env node */
const existsSync = require('exists-sync');
const path = require('path');
const EOL = require('os').EOL;
const emberInflector = require('ember-inflector');

const {
  camelize,
  capitalize,
  dasherize
} = require('ember-cli-string-utils');

const { pluralize } = emberInflector;

const indent = '    ';

module.exports = {
  description: 'Adds a `hasMany` relationship to a model and the related calls to it´s group',

  availableOptions: [
    { name: 'to', type: String, default: 'Not present, model name is required' },
    { name: 'linked', type: Boolean, default: false, description: 'Serialize has a link-related url in the source model',
      aliases: [
        { 'l': true }
      ]
    },
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
      pluralizedTargetName: pluralize(dasherize(options.to)),
      capitalCamelizedModuleName: capitalize(camelize(options.entity.name)),
      capitalCamelizedModelType: capitalize(camelize(modelType)),
      pluralizedName: pluralize(dasherize(options.entity.name)),
      pluralCamelizedModuleName: pluralize(camelize(options.entity.name)),
      pluralCapilaCamelModuleName: capitalize(pluralize(camelize(options.entity.name))),
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
      linked,
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
    const resourceName = pluralize(dasherize(name));
    const nestedUnder = pluralize(dasherize(model));
    const description = `All ${pluralize(camelize(name))} for this ${sourceModelName}`;

    const relationshipSection = `## ${sourceModelName}${required ? 'RequiredRelationships' : 'OptionalRelationships'} (object)${EOL}`;

    let content = `+ \`${resourceName}\` (object)${EOL}`;
    if (linked) {
      content += `${indent}+ links (object)${EOL}`
      content += `${indent}${indent}+ related: \`/api/v1/${nestedUnder}/1/relationships/${resourceName}\` (string, required) - ${description}`
    } else {
      content += `${indent}+ data (array[${targetModelName}Type]) - ${description}`
    }

    return this.insertIntoFile(sourceModelFile, content, {
      after: relationshipSection
    })
    .then(()=>{
      // Ensure `relationships` object is marked as required in schema
      this.insertIntoFile(sourceModelFile, ', required', {
        after: `+ relationships (${sourceModelName}Relationships`,
      })
    });
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
    const pluralizedModelName = pluralize(dasherize(name));
    let relationshipCalls = `${EOL}<!-- include(./relationships/${pluralizedModelName}.apib) -->`

    return this.insertIntoFile(sourceModelGroup, relationshipCalls);

  }
};
