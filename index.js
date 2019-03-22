/* eslint-env node */
'use strict';

const Apiblueprint = require('broccoli-apiblueprint');
var mergeTrees    = require('broccoli-merge-trees');
const path = require('path');
var fs = require('fs');

module.exports = {
  name: 'ember-cli-apiblueprint',
  
  included(app){
    this._super.included.apply(this, arguments);
    
    const defaults = require('lodash.defaultsdeep');
    const srcDir = 'api-blueprints';
    const includePath = path.join(this.project.root, srcDir);
    const outputDir = 'api-docs';
    const enumerablesPath = undefined;
    
    let defaultOptions = {
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
      includePath,    // Base directory for relative includes
      locals: {},                    //  Extra locals to pass to templates
      theme: 'default',             //  Theme name to load for rendering
    };
    
    this._options = defaults(app.options['ember-cli-apiblueprint'] || {}, defaultOptions);
  },
  
  treeForPublic() {
    const inputNode = path.join(this.app.project.root, this._options.srcDir);
    const docs = new Apiblueprint([inputNode], this._options);
    let enumNodes = [];

    if (this._options.enumerablesPath) {
      const enumerablesFolder = path.join(inputNode, this._options.enumerablesPath);
      const enumerablesFiles = fs.readdirSync(enumerablesFolder);
      const enumerablesOutputPath = path.join(this._options.outputPath, this._options.enumerablesPath);

      enumNodes = enumerablesFiles.map((enumFile) => {
        return new Apiblueprint([enumerablesFolder], {
          indexFile: enumFile,
          outputFile: `${enumFile.split('.')[0]}.html`,
          outputPath: enumerablesOutputPath,
        })
      });
    }


    return mergeTrees([docs, ...enumNodes]);
  },
};
