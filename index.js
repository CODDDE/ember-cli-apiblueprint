/* eslint-env node */
'use strict';

const Apiblueprint = require('broccoli-apiblueprint');
var mergeTrees    = require('broccoli-merge-trees');
const path = require('path');
const defaults = require('lodash.defaultsdeep');

module.exports = {
  name: 'ember-cli-apiblueprint',
  
  included(app){
    this._super.included.apply(this, arguments);
    
    const srcDir = 'api-blueprints';
    const includePath = path.join(this.project.root, srcDir);
    const outputDir = 'api-docs';
    const enumerablesPath = undefined;
    
    let defaultOptions = {
      /**
       * Default configuration
       */

      indexFiles: ['index.apib'],

      /**
       * Available options on broccoli-apibluprint
       */
      enabled: true,
      srcDir,
      outputPath: outputDir,      
      
      // Own options
      enumerablesPath,
      
      // Aglio options
      themeVariables: 'default',    //	Built-in color scheme or path to LESS or CSS
      themeCondenseNav: true,       //	Condense single-action navigation links
      themeFullWidth: true,         //	Use the full page width
      themeTemplate: undefined,     //  Layout name or path to custom layout file
      themeStyle: 'default',        //	Built-in style name or path to LESS or CSS
      
      filterInput: true,            //  Filter \r and \t from the input
      includePath,                  // Base directory for relative includes
      locals: {},                    //  Extra locals to pass to templates
      theme: 'default',             //  Theme name to load for rendering
    };
    this._options = defaults(app.options['ember-cli-apiblueprint'] || {}, defaultOptions);
  },
  
  treeForPublic() {
    const inputNode = path.join(this.app.project.root, this._options.srcDir);
    const docNodes = this._options.indexFiles.map( indexFile => {
      let buildOptions = Object.assign({}, this._options, {
        indexFile,
        outputFile: `${indexFile.split('.')[0]}.html`,
      });

      return new Apiblueprint([inputNode], buildOptions);
    });

    return mergeTrees(docNodes);
  },
};
