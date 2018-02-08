/* eslint-env node */
'use strict';

const Apiblueprint = require('broccoli-apiblueprint');
const path = require('path');

module.exports = {
  name: 'ember-cli-apiblueprint',
  
  included(app){
    this._super.included.apply(this, arguments);
    
    const defaults = require('lodash.defaultsdeep');
    const srcDir = 'api-blueprints';
    const includePath = path.join(this.project.root, srcDir);
    
    let defaultOptions = {
      /**
       * Available options on broccoli-apibluprint
       */
      enabled: true,
      srcDir,
      
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
    
    return docs;
  },
};
